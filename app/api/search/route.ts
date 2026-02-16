import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { generateIngredientInfo } from "@/lib/gemini";
import type { SearchApiResponse, IngredientData } from "@/lib/types";

// In-memory rate limiter (IP당 분당 요청 제한)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;
const MAX_QUERY_LENGTH = 50;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  // Rate limit check
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json<SearchApiResponse>(
      { success: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const q = request.nextUrl.searchParams.get("q");

  if (!q || !q.trim()) {
    return NextResponse.json<SearchApiResponse>(
      { success: false, error: "검색어를 입력해주세요." },
      { status: 400 }
    );
  }

  const query = q.trim().slice(0, MAX_QUERY_LENGTH);

  try {
    const supabase = getSupabase();

    // Check Supabase cache first
    const { data: cached } = await supabase
      .from("ingredients")
      .select("name, storage, shelf_life, seasonal")
      .eq("name", query.toLowerCase())
      .single();

    if (cached) {
      const data: IngredientData = {
        isValid: true,
        correctedName: cached.name,
        storage: cached.storage,
        shelfLife: cached.shelf_life,
        seasonal: cached.seasonal,
      };
      return NextResponse.json<SearchApiResponse>({
        success: true,
        data,
        query,
        cached: true,
      });
    }

    // Cache miss — call Gemini
    const geminiResult = await generateIngredientInfo(query);

    if (geminiResult.isValid) {
      const cacheName = geminiResult.correctedName.toLowerCase();

      // Check if correctedName already cached (e.g. "apple" → "사과" already exists)
      const { data: existingCorrected } = await supabase
        .from("ingredients")
        .select("name, storage, shelf_life, seasonal")
        .eq("name", cacheName)
        .single();

      if (existingCorrected) {
        const data: IngredientData = {
          isValid: true,
          correctedName: existingCorrected.name,
          storage: existingCorrected.storage,
          shelfLife: existingCorrected.shelf_life,
          seasonal: existingCorrected.seasonal,
        };
        return NextResponse.json<SearchApiResponse>({
          success: true,
          data,
          query,
          cached: true,
        });
      }

      // Save to Supabase (non-blocking)
      supabase
        .from("ingredients")
        .upsert(
          {
            name: cacheName,
            storage: geminiResult.storage,
            shelf_life: geminiResult.shelfLife,
            seasonal: geminiResult.seasonal,
          },
          { onConflict: "name" }
        )
        .then(({ error }) => {
          if (error) console.error("Supabase upsert error:", error.message);
        });
    }

    return NextResponse.json<SearchApiResponse>({
      success: true,
      data: geminiResult,
      query,
      cached: false,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json<SearchApiResponse>(
      {
        success: false,
        error: "검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}

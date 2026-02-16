import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/main/SearchBar";
import SearchResultCards from "@/components/main/SearchResultCards";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return {
      title: "검색 | FreshCheck",
      description: "식재료를 검색하여 보관법과 소비기한을 확인하세요.",
    };
  }

  return {
    title: `${query} 보관법 | FreshCheck`,
    description: `${query}의 냉장, 냉동, 상온 보관 기간과 보관법을 확인하세요.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-10">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-fresh-50)_0%,_transparent_50%)] pointer-events-none" />

      {/* Header */}
      <Link
        href="/"
        aria-label="FreshCheck 홈으로 이동"
        className="relative z-10 group mb-8"
      >
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-fresh-600 to-fresh-500 bg-clip-text text-transparent group-hover:from-fresh-700 group-hover:to-fresh-600 transition-all duration-300">
          FreshCheck
        </span>
      </Link>

      {/* Search bar */}
      <div className="relative z-10 w-full max-w-xl mb-12">
        <SearchBar initialQuery={query} />
      </div>

      {/* Results */}
      <div className="relative z-10 w-full flex justify-center">
        {query ? (
          <SearchResultCards query={query} />
        ) : (
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <span className="text-4xl">🔍</span>
            <p className="text-lg">식재료 이름을 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

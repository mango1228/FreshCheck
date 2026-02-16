import { GoogleGenAI, Type } from "@google/genai";
import type { IngredientData } from "./types";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const ingredientSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: { type: Type.BOOLEAN },
    correctedName: { type: Type.STRING },
    suggestion: { type: Type.STRING },
    storage: {
      type: Type.OBJECT,
      properties: {
        refrigerator: { type: Type.STRING },
        freezer: { type: Type.STRING },
        roomTemp: { type: Type.STRING },
      },
      required: ["refrigerator", "freezer", "roomTemp"],
    },
    shelfLife: {
      type: Type.OBJECT,
      properties: {
        refrigerator: {
          type: Type.OBJECT,
          properties: {
            days: { type: Type.NUMBER },
            label: { type: Type.STRING },
          },
          required: ["days", "label"],
        },
        freezer: {
          type: Type.OBJECT,
          properties: {
            days: { type: Type.NUMBER },
            label: { type: Type.STRING },
          },
          required: ["days", "label"],
        },
        roomTemp: {
          type: Type.OBJECT,
          properties: {
            days: { type: Type.NUMBER },
            label: { type: Type.STRING },
          },
          required: ["days", "label"],
        },
      },
      required: ["refrigerator", "freezer", "roomTemp"],
    },
    seasonal: {
      type: Type.OBJECT,
      properties: {
        isInSeason: { type: Type.BOOLEAN },
        seasonMonths: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        seasonLabel: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["isInSeason", "seasonMonths", "seasonLabel", "description"],
    },
  },
  required: [
    "isValid",
    "correctedName",
    "suggestion",
    "storage",
    "shelfLife",
    "seasonal",
  ],
};

function sanitizeInput(input: string): string {
  return input
    .slice(0, 50)
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
}

export async function generateIngredientInfo(
  ingredientName: string
): Promise<IngredientData> {
  const currentMonth = new Date().getMonth() + 1;
  const sanitized = sanitizeInput(ingredientName);

  if (!sanitized) {
    throw new Error("유효하지 않은 입력입니다.");
  }

  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `당신은 한국의 식재료 전문가입니다. 모든 정보는 한국 기준으로 답변하세요. 사용자가 입력한 "${sanitized}"에 대해 분석해주세요.

## 규칙
1. 입력이 실제 식재료(채소, 과일, 육류, 해산물, 곡물, 유제품 등)인지 판단하세요.
2. 영어 입력(예: "apple", "carrot")도 인식하여 한국어로 응답하세요.
3. 식재료가 맞으면 isValid=true로, correctedName에 정확한 한국어 식재료 이름을 넣으세요.
4. 식재료가 아니면 isValid=false로, suggestion에 입력과 가장 유사한 실제 식재료 이름을 추천하세요. 유사한 것이 없으면 빈 문자열로 두세요.
5. 한국 기준으로 현재 ${currentMonth}월의 제철 여부를 판단하세요.
6. 모든 텍스트는 한국어로 작성하세요.

## 응답 필드 설명
- isValid: 실제 식재료인지 여부
- correctedName: 정정된 한국어 식재료 이름 (식재료가 아니면 입력값 그대로)
- suggestion: isValid=false일 때 추천 식재료 (isValid=true이면 빈 문자열)
- storage: 냉장(refrigerator), 냉동(freezer), 상온(roomTemp) 보관 방법 설명
- shelfLife: 각 보관방법별 소비기한 (days: 일수, label: "약 7일" 형태)
- seasonal: 제철 정보 (isInSeason: 현재 제철인지, seasonMonths: 제철 월 배열, seasonLabel: "3월 ~ 5월" 형태, description: 제철 관련 설명)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: ingredientSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini 응답이 비어있습니다.");
  }

  try {
    return JSON.parse(text) as IngredientData;
  } catch {
    throw new Error("Gemini 응답을 파싱할 수 없습니다.");
  }
}

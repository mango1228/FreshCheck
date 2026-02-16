import { generateIngredientInfo } from "../lib/gemini";
import { getSupabase } from "../lib/supabase";

const INGREDIENTS = [
  // 채소 (30)
  "배추", "무", "당근", "감자", "고구마", "양파", "대파", "마늘", "생강", "시금치",
  "상추", "깻잎", "부추", "콩나물", "숙주", "브로콜리", "양배추", "오이", "호박", "애호박",
  "가지", "고추", "파프리카", "토마토", "셀러리", "미나리", "연근", "우엉", "도라지", "쑥갓",
  // 과일 (20)
  "사과", "배", "귤", "오렌지", "바나나", "딸기", "포도", "수박", "참외", "복숭아",
  "자두", "감", "키위", "망고", "블루베리", "체리", "레몬", "라임", "파인애플", "아보카도",
  // 육류 (10)
  "소고기", "돼지고기", "닭고기", "오리고기", "양고기", "소갈비", "삼겹살", "목살", "안심", "등심",
  // 해산물 (14)
  "연어", "고등어", "참치", "갈치", "오징어", "새우", "조개", "굴", "전복", "꽃게",
  "미역", "다시마", "김", "멸치",
  // 곡물/콩 (10)
  "쌀", "현미", "찹쌀", "보리", "밀가루", "두부", "콩", "팥", "녹두", "옥수수",
  // 양념/가공 (16)
  "고추장", "된장", "간장", "참기름", "들기름", "식초", "버터", "치즈", "우유", "달걀",
  "꿀", "설탕", "소금", "후추", "카레가루", "고춧가루",

  // === 추가 식재료 ===
  // 채소 추가 (20)
  "청경채", "비트", "아스파라거스", "케일", "청양고추", "피망", "쪽파", "방울토마토", "단호박", "새송이버섯",
  "팽이버섯", "표고버섯", "느타리버섯", "양송이버섯", "무순", "비타민", "고사리", "취나물", "냉이", "달래",
  // 과일 추가 (10)
  "한라봉", "석류", "유자", "대추", "무화과", "라즈베리", "매실", "살구", "천도복숭아", "코코넛",
  // 육류 추가 (10)
  "닭가슴살", "닭날개", "차돌박이", "갈비살", "항정살", "족발", "곱창", "베이컨", "소시지", "햄",
  // 해산물 추가 (15)
  "광어", "도미", "대구", "삼치", "장어", "낙지", "문어", "홍합", "바지락", "꼬막",
  "가리비", "대하", "해삼", "톳", "파래",
  // 곡물 추가 (9)
  "귀리", "메밀", "수수", "율무", "전분", "떡", "당면", "국수", "라면",
  // 가공/양념 추가 (15)
  "마요네즈", "케첩", "쌈장", "맛술", "올리브오일", "생크림", "요거트", "두유", "크림치즈", "모짜렐라치즈",
  "어묵", "쌀국수", "물엿", "굴소스", "식용유",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const total = INGREDIENTS.length;
  let saved = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`\n식재료 시딩 시작 — 총 ${total}개\n`);

  const supabase = getSupabase();

  for (let i = 0; i < total; i++) {
    const name = INGREDIENTS[i];
    const label = `[${i + 1}/${total}] ${name}`;

    try {
      // 이미 존재하는지 확인
      const { data: existing } = await supabase
        .from("ingredients")
        .select("name")
        .eq("name", name.toLowerCase())
        .single();

      if (existing) {
        console.log(`${label} — 이미 존재, 스킵`);
        skipped++;
        continue;
      }

      // Gemini 호출
      const result = await generateIngredientInfo(name);

      if (!result.isValid) {
        console.log(`${label} ✗ Gemini가 유효하지 않은 식재료로 판단`);
        failed++;
        await sleep(1000);
        continue;
      }

      const cacheName = result.correctedName.toLowerCase();

      // correctedName 기준으로 중복 체크
      if (cacheName !== name.toLowerCase()) {
        const { data: correctedExisting } = await supabase
          .from("ingredients")
          .select("name")
          .eq("name", cacheName)
          .single();

        if (correctedExisting) {
          console.log(`${label} — "${cacheName}"으로 이미 존재, 스킵`);
          skipped++;
          await sleep(1000);
          continue;
        }
      }

      // Supabase에 저장
      const { error } = await supabase.from("ingredients").upsert(
        {
          name: cacheName,
          storage: result.storage,
          shelf_life: result.shelfLife,
          seasonal: result.seasonal,
        },
        { onConflict: "name" }
      );

      if (error) {
        console.log(`${label} ✗ 저장 실패: ${error.message}`);
        failed++;
      } else {
        console.log(`${label} ✓ 저장 완료`);
        saved++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`${label} ✗ 오류: ${msg}`);
      failed++;
    }

    // Rate limit 대기
    await sleep(1000);
  }

  console.log(`\n===== 시딩 완료 =====`);
  console.log(`저장: ${saved}개`);
  console.log(`스킵(이미 존재): ${skipped}개`);
  console.log(`실패: ${failed}개`);
  console.log(`총: ${total}개\n`);
}

main().catch((err) => {
  console.error("시딩 스크립트 오류:", err);
  process.exit(1);
});

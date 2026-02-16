export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className="text-xl text-neutral-600">
        <span className="font-semibold text-fresh-700">&ldquo;{q || ""}&rdquo;</span> 검색 결과 페이지
      </p>
      <p className="mt-2 text-neutral-400">준비 중입니다</p>
    </div>
  );
}

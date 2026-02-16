"use client";

import { useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import SearchLoading from "./SearchLoading";
import SearchError from "./SearchError";
import type { IngredientData, SearchApiResponse } from "@/lib/types";

interface SearchResultCardsProps {
  query: string;
}

type State = {
  data: IngredientData | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; data: IngredientData }
  | { type: "FETCH_ERROR"; error: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { data: null, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { data: action.data, loading: false, error: null };
    case "FETCH_ERROR":
      return { data: null, loading: false, error: action.error };
  }
}

export default function SearchResultCards({ query }: SearchResultCardsProps) {
  const [{ data, loading, error }, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    dispatch({ type: "FETCH_START" });

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<SearchApiResponse>;
      })
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          dispatch({
            type: "FETCH_ERROR",
            error: result.error || "알 수 없는 오류가 발생했습니다.",
          });
        } else if (result.data) {
          dispatch({ type: "FETCH_SUCCESS", data: result.data });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        const status = Number(err.message);
        const message =
          status === 429
            ? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
            : status >= 500
              ? "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
              : "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
        dispatch({ type: "FETCH_ERROR", error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) return <SearchLoading />;
  if (error) return <SearchError message={error} />;
  if (!data) return null;

  // Invalid ingredient — show suggestion
  if (!data.isValid) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl rounded-2xl bg-white shadow-md border border-neutral-200 p-6 sm:p-10 text-center"
      >
        <span className="inline-block text-4xl sm:text-5xl mb-4">🤔</span>
        <p className="text-xl text-neutral-700">
          <span className="font-bold text-neutral-800">
            &ldquo;{query}&rdquo;
          </span>
          은(는) 식재료가 아닌 것 같아요.
        </p>
        {data.suggestion && (
          <p className="mt-5 text-lg text-neutral-600">
            혹시{" "}
            <button
              onClick={() =>
                router.push(
                  `/search?q=${encodeURIComponent(data.suggestion!)}`
                )
              }
              className="inline-flex items-center gap-1 font-bold text-fresh-600 hover:text-fresh-700 bg-fresh-50 hover:bg-fresh-100 px-4 py-2 rounded-full cursor-pointer transition-all duration-200"
            >
              {data.suggestion}
              <span aria-hidden="true">→</span>
            </button>
            을(를) 찾으시나요?
          </p>
        )}
      </motion.div>
    );
  }

  // Valid ingredient — show 3 cards
  const storageItems = [
    { label: "상온 보관", value: data.storage.roomTemp, emoji: "🌡️" },
    { label: "냉장 보관", value: data.storage.refrigerator, emoji: "❄️" },
    { label: "냉동 보관", value: data.storage.freezer, emoji: "🧊" },
  ];

  const shelfLifeItems = [
    {
      label: "상온",
      value: data.shelfLife.roomTemp.label,
      days: data.shelfLife.roomTemp.days,
    },
    {
      label: "냉장",
      value: data.shelfLife.refrigerator.label,
      days: data.shelfLife.refrigerator.days,
    },
    {
      label: "냉동",
      value: data.shelfLife.freezer.label,
      days: data.shelfLife.freezer.days,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="w-full max-w-5xl">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 mb-8 text-center"
      >
        <span className="text-fresh-500">{data.correctedName}</span>
        <span className="text-neutral-400 font-normal text-lg ml-2">
          보관 가이드
        </span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Storage card */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl bg-white shadow-sm hover:shadow-md border border-neutral-200 border-l-4 border-l-blue-400 p-4 sm:p-6 transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-xl">
              📦
            </span>
            <h3 className="text-lg font-bold text-neutral-800">보관법</h3>
          </div>
          <ul className="space-y-4">
            {storageItems.map((item) => (
              <li key={item.label}>
                <p className="text-sm font-semibold text-neutral-500 mb-1">
                  {item.emoji} {item.label}
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  {item.value}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Shelf life card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl bg-white shadow-sm hover:shadow-md border border-neutral-200 border-l-4 border-l-amber-400 p-4 sm:p-6 transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-xl">
              ⏳
            </span>
            <h3 className="text-lg font-bold text-neutral-800">소비기한</h3>
          </div>
          <ul className="space-y-4">
            {shelfLifeItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
              >
                <span className="text-neutral-600">{item.label}</span>
                <span className="font-bold text-neutral-800 bg-neutral-50 px-3 py-1 rounded-lg text-sm">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Seasonal card */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl bg-white shadow-sm hover:shadow-md border border-neutral-200 border-l-4 border-l-fresh-400 p-4 sm:p-6 transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-fresh-50 text-xl">
              🌱
            </span>
            <h3 className="text-lg font-bold text-neutral-800">제철 정보</h3>
          </div>
          <div className="space-y-4">
            <div>
              <span
                className={
                  data.seasonal.isInSeason
                    ? "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold bg-fresh-100 text-fresh-700"
                    : "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold bg-neutral-100 text-neutral-600"
                }
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {data.seasonal.isInSeason ? "지금이 제철!" : "비제철"}
              </span>
            </div>
            <p className="text-sm text-neutral-500">
              제철 시기:{" "}
              <span className="font-semibold text-neutral-700">
                {data.seasonal.seasonLabel}
              </span>
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {data.seasonal.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

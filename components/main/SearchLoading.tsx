"use client";

import { motion } from "motion/react";

const cards = [
  { title: "보관법", emoji: "📦", borderColor: "border-l-blue-400" },
  { title: "소비기한", emoji: "⏳", borderColor: "border-l-amber-400" },
  { title: "제철 정보", emoji: "🌱", borderColor: "border-l-fresh-400" },
];

export default function SearchLoading() {
  return (
    <div className="w-full max-w-5xl">
      {/* Title skeleton */}
      <div className="flex justify-center mb-8">
        <div className="h-8 w-48 rounded-lg bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:200%_100%] animate-shimmer" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`rounded-2xl bg-white shadow-sm border border-neutral-200 border-l-4 ${card.borderColor} p-4 sm:p-6`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-50 text-xl">
                {card.emoji}
              </span>
              <span className="text-lg font-bold text-neutral-800">
                {card.title}
              </span>
            </div>
            <div className="space-y-3">
              <div className="h-5 rounded-lg bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:200%_100%] animate-shimmer" />
              <div className="h-5 rounded-lg bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:200%_100%] animate-shimmer w-4/5" />
              <div className="h-5 rounded-lg bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:200%_100%] animate-shimmer w-3/5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

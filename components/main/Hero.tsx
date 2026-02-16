"use client";

import { motion } from "motion/react";
import SearchBar from "./SearchBar";
import FreshIcon from "./FreshIcon";

const decorativeEmoji = [
  { emoji: "🥕", className: "absolute top-[10%] left-[8%] opacity-20", duration: 3.2, delay: 0 },
  { emoji: "🥦", className: "absolute top-[15%] right-[12%] opacity-25", duration: 2.8, delay: 0.5 },
  { emoji: "🍋", className: "absolute bottom-[20%] left-[15%] opacity-20", duration: 3.5, delay: 1.0 },
  { emoji: "🍅", className: "absolute bottom-[15%] right-[10%] opacity-25", duration: 3.0, delay: 0.3 },
  { emoji: "🥬", className: "absolute top-[40%] left-[3%] opacity-15", duration: 3.8, delay: 0.7 },
  { emoji: "🥑", className: "absolute top-[35%] right-[5%] opacity-15", duration: 2.6, delay: 1.2 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Layered gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-fresh-100)_0%,_var(--color-fresh-50)_30%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-warm-100)_0%,_transparent_50%)] opacity-30 pointer-events-none" />

      {/* Decorative floating emoji — hidden on small screens */}
      <div className="hidden sm:block">
        {decorativeEmoji.map((item, i) => (
          <FreshIcon key={i} {...item} />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-fresh-600 to-fresh-500 bg-clip-text text-transparent">
              FreshCheck
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-4 text-lg md:text-xl text-neutral-600 max-w-xs sm:max-w-md"
        >
          보관법부터 남은 소비기한까지, 내 식재료를 freshcheck하세요
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-8 md:mt-10 w-full flex justify-center"
        >
          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
}

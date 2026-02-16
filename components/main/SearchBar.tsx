"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative flex">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg pointer-events-none">
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="식재료를 검색해보세요..."
          className="flex-1 rounded-l-full py-4 pl-12 pr-4 bg-white border-2 border-fresh-200 text-neutral-800 placeholder:text-neutral-400 text-base md:text-lg outline-none focus:border-fresh-400 focus:ring-2 focus:ring-fresh-100 transition-colors duration-200"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-r-full py-4 px-6 md:px-8 bg-warm-400 hover:bg-warm-500 text-white font-semibold text-base md:text-lg cursor-pointer transition-colors duration-200"
        >
          검색
        </motion.button>
      </div>
    </form>
  );
}

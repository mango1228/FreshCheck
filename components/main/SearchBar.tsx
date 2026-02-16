"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative flex shadow-md rounded-full hover:shadow-lg transition-shadow duration-300">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg pointer-events-none">
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="식재료를 검색해보세요..."
          aria-label="식재료 검색"
          className="flex-1 rounded-l-full py-4 pl-12 pr-4 bg-white border-2 border-neutral-200 border-r-0 text-neutral-800 placeholder:text-neutral-400 text-base md:text-lg outline-none focus:border-fresh-400 focus:ring-2 focus:ring-fresh-100 transition-all duration-200"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-r-full py-4 px-5 sm:px-6 md:px-8 bg-fresh-500 hover:bg-fresh-600 text-white font-semibold text-base md:text-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        >
          검색
        </motion.button>
      </div>
    </form>
  );
}

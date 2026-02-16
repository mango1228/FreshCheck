"use client";

import { motion } from "motion/react";

interface SearchErrorProps {
  message: string;
}

export default function SearchError({ message }: SearchErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl rounded-2xl bg-red-50 border border-red-200 shadow-sm p-8 text-center"
    >
      <span className="inline-block text-4xl mb-3">⚠️</span>
      <p className="text-lg font-medium text-red-700">{message}</p>
    </motion.div>
  );
}

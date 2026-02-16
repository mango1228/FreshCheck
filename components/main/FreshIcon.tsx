"use client";

import { motion } from "motion/react";

interface FreshIconProps {
  emoji: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export default function FreshIcon({
  emoji,
  className = "",
  duration = 3,
  delay = 0,
}: FreshIconProps) {
  return (
    <motion.span
      className={`select-none text-4xl md:text-5xl ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {emoji}
    </motion.span>
  );
}

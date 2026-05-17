"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "emerald" | "violet" | "cyan" | "none";
  animate?: boolean;
  delay?: number;
}

export function Card({
  children,
  className,
  hover = false,
  glow = "none",
  animate = false,
  delay = 0,
}: CardProps) {
  const glowStyles = {
    emerald: "hover:border-emerald-500/30 hover:shadow-glow-emerald",
    violet: "hover:border-violet-500/30 hover:shadow-glow-violet",
    cyan: "hover:border-cyan-500/30 hover:shadow-glow-cyan",
    none: "",
  };

  const wrapper = (
    <div
      className={cn(
        "glass-card rounded-2xl",
        hover && "glass-card-hover cursor-pointer",
        glow !== "none" && glowStyles[glow],
        className
      )}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      >
        {wrapper}
      </motion.div>
    );
  }

  return wrapper;
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  href?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  id?: string;
}

const variantStyles = {
  primary:
    "relative bg-gradient-to-r from-emerald-500 to-violet-600 text-white font-semibold hover:opacity-90 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40",
  secondary:
    "glass-card text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 font-medium",
  ghost:
    "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] font-medium",
  danger:
    "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-medium",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  href,
  className,
  children,
  disabled,
  type = "button",
  onClick,
  id,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 transition-all duration-200 btn-press select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-flex">
        <Link href={href} className={classes} id={id}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={classes}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      id={id}
    >
      {content}
    </motion.button>
  );
}

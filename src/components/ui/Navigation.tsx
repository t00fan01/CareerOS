"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Briefcase, Zap, LogOut, Code2, Bell, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Applications", href: "#" },
    { icon: Code2, label: "Interview", href: "/dashboard/interview" },
    { icon: Zap, label: "Skills", href: "#" },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/8 flex flex-col p-5 z-30 hidden lg:flex"
    >
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-zinc-100">CareerOS</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 pt-4 mt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
}

export function Topbar({ email }: { email: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 glass-card border-b border-white/8 flex items-center px-6 gap-4 z-20"
    >
      <div className="relative flex-1 max-w-sm hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          type="search"
          placeholder="Search companies, roles..."
          className="input-dark w-full rounded-xl pl-9 pr-4 py-2.5 text-sm"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.07] transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg shadow-emerald-500/20">
          {email?.[0] ?? "U"}
        </div>
      </div>
    </motion.header>
  );
}

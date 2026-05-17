"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Map, BarChart3, Target, CheckCircle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// ── Animated background grid + orbs ──────────────────────────────────────────
function HeroBG() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow" />
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[0%] left-[10%] w-[300px] h-[300px] rounded-full bg-cyan-500/8 blur-[80px]" />
    </div>
  );
}

// ── Floating mock bento widget ────────────────────────────────────────────────
function FloatingMockup() {
  const statuses = [
    { company: "Google", role: "SWE Intern", status: "interview", statusLabel: "Interview" },
    { company: "Stripe", role: "Frontend Eng", status: "applied", statusLabel: "Applied" },
    { company: "Vercel", role: "Full Stack", status: "offer", statusLabel: "Offer 🎉" },
    { company: "OpenAI", role: "ML Engineer", status: "wishlist", statusLabel: "Wishlist" },
  ];

  const statusColors: Record<string, string> = {
    interview: "status-interview",
    applied: "status-applied",
    offer: "status-offer",
    wishlist: "status-wishlist",
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    >
      {/* Glow behind mockup */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-violet-500/5 to-transparent blur-3xl rounded-3xl" />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="relative"
      >
        {/* Main bento container */}
        <div className="grid grid-cols-2 gap-3 p-1">
          {/* Applications widget */}
          <div className="col-span-2 glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-emerald-500/15">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-200">Applications</span>
              <span className="ml-auto text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">12 total</span>
            </div>
            <div className="space-y-2">
              {statuses.map((app, i) => (
                <motion.div
                  key={app.company}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center justify-between bg-white/[0.03] rounded-xl px-3 py-2 border border-white/[0.06]"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{app.company}</p>
                    <p className="text-[10px] text-zinc-500">{app.role}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
                    {app.statusLabel}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Goal widget */}
          <div className="glass-card rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-violet-500/15">
                <Target className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <span className="text-xs font-semibold text-zinc-200">Goal</span>
            </div>
            <p className="text-xs text-zinc-400 mb-1">Targeting</p>
            <p className="text-sm font-bold gradient-text">Full Stack Dev</p>
            <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "68%" }}
                transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">68% complete</p>
          </div>

          {/* Skills widget */}
          <div className="glass-card rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/15">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-zinc-200">Skills</span>
            </div>
            {[
              { name: "React", pct: 90 },
              { name: "Node.js", pct: 75 },
              { name: "SQL", pct: 60 },
            ].map((skill) => (
              <div key={skill.name} className="mb-2">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[10px] text-zinc-400">{skill.name}</span>
                  <span className="text-[10px] text-zinc-500">{skill.pct}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${skill.pct}%` }}
                    transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="glass-card glass-card-hover rounded-2xl p-6 group cursor-default"
    >
      <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
    >
      <div className="glass-card px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm text-zinc-100">CareerOS</span>
      </div>

      <div className="glass-card px-6 py-2 rounded-2xl border border-white/10 hidden md:flex items-center gap-6">
        {["Features", "Roadmap", "Pricing"].map((item) => (
          <a key={item} href="#" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors hidden md:block">
          Sign in
        </Link>
        <Button href="/login" size="sm">
          Get Started <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.nav>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const features = [
    {
      icon: Map,
      title: "Visual Career Roadmaps",
      description: "Build custom learning paths for any tech role — from junior dev to staff engineer — with milestones you can actually track.",
      color: "bg-emerald-500/15 text-emerald-400",
      delay: 0,
    },
    {
      icon: BarChart3,
      title: "Application Intelligence",
      description: "Track every job application in one place. Know your conversion rate, identify patterns, and never miss a follow-up.",
      color: "bg-violet-500/15 text-violet-400",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: "Skill Gap Analysis",
      description: "Compare your skillset against job listings. CareerOS surfaces exactly what to learn next to close the gap.",
      color: "bg-cyan-500/15 text-cyan-400",
      delay: 0.2,
    },
    {
      icon: Target,
      title: "Goal Setting & Tracking",
      description: "Set a target role, timeline, and milestones. CareerOS keeps you accountable with weekly progress nudges.",
      color: "bg-orange-500/15 text-orange-400",
      delay: 0.3,
    },
  ];

  const stats = [
    { value: "10K+", label: "Students Tracking" },
    { value: "94%", label: "Interview Rate" },
    { value: "3.2x", label: "Faster Job Search" },
    { value: "500+", label: "Companies Tracked" },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <HeroBG />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 glass-card border border-emerald-500/20 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">AI-Powered Career Intelligence</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
              >
                Map Your Tech Career.{" "}
                <span className="gradient-text">Without the Chaos.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg"
              >
                CareerOS is the command center for IT & tech students. Track applications, build skill roadmaps, and navigate your career with clarity — not spreadsheets.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button href="/login" size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/login" variant="secondary" size="lg">
                  View Demo
                </Button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-3 mt-8"
              >
                <div className="flex -space-x-2">
                  {["🧑‍💻", "👩‍💻", "🧑‍🎓", "👩‍🎓"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-zinc-400">
                  Trusted by <span className="text-zinc-200 font-semibold">10,000+</span> students
                </p>
              </motion.div>
            </div>

            {/* Right: Floating mockup */}
            <div className="hidden lg:block">
              <FloatingMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats banner ── */}
      <section className="relative z-10 py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-black gradient-text mb-1">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              Everything you need to{" "}
              <span className="gradient-text-violet">land the role.</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Stop juggling spreadsheets, Notion docs, and sticky notes. CareerOS unifies your entire career strategy in one beautiful interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card gradient-border rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              Ready to <span className="gradient-text">take control?</span>
            </h2>
            <p className="text-zinc-400 mb-8">
              Join thousands of students who&apos;ve replaced spreadsheet chaos with a clear, structured career system.
            </p>
            <Button href="/login" size="lg">
              Start for Free — No Credit Card <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-400">CareerOS</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} CareerOS. Built for the next generation of tech talent.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

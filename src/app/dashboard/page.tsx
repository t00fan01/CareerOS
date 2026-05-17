"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Target, Zap, Plus, LogOut, Bell, Search,
  TrendingUp, Calendar, ChevronRight, ExternalLink,
  CheckCircle2, Clock, XCircle, Star, Briefcase,
  Code2, Database, Globe, Cpu, ArrowUpRight, Filter,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sidebar, Topbar } from "@/components/ui/Navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

// ── Types ─────────────────────────────────────────────────────────────────────
type AppStatus = "applied" | "interview" | "offer" | "rejected" | "wishlist";

interface Application {
  id: string;
  company: string;
  role: string;
  status: AppStatus;
  appliedDate: string;
  logo: string;
  createdAt: any;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: "frontend" | "backend" | "devops" | "ml";
  createdAt: any;
}

// ── Mock Data (Only Roadmap) ──────────────────────────────────────────────────
const ROADMAP_MILESTONES = [
  { label: "HTML/CSS/JS Basics", done: true },
  { label: "React & TypeScript", done: true },
  { label: "Node.js & REST APIs", done: true },
  { label: "Databases & ORM", done: true },
  { label: "System Design Basics", done: false },
  { label: "Cloud & DevOps", done: false },
  { label: "Full Stack Projects", done: false },
];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<AppStatus, { label: string; className: string; icon: React.ElementType }> = {
  applied:   { label: "Applied",    className: "status-applied",   icon: Clock },
  interview: { label: "Interview",  className: "status-interview", icon: Calendar },
  offer:     { label: "Offer 🎉",  className: "status-offer",     icon: CheckCircle2 },
  rejected:  { label: "Rejected",  className: "status-rejected",  icon: XCircle },
  wishlist:  { label: "Wishlist",  className: "status-wishlist",  icon: Star },
};

// ── Logo avatar ───────────────────────────────────────────────────────────────
const LOGO_COLORS: Record<string, string> = {
  A: "bg-red-500/20 text-red-300", B: "bg-blue-500/20 text-blue-300", C: "bg-emerald-500/20 text-emerald-300",
  D: "bg-violet-500/20 text-violet-300", E: "bg-amber-500/20 text-amber-300", F: "bg-pink-500/20 text-pink-300",
  G: "bg-blue-500/20 text-blue-300", H: "bg-orange-500/20 text-orange-300", I: "bg-indigo-500/20 text-indigo-300",
  J: "bg-cyan-500/20 text-cyan-300", K: "bg-lime-500/20 text-lime-300", L: "bg-purple-500/20 text-purple-300",
  M: "bg-rose-500/20 text-rose-300", N: "bg-orange-500/20 text-orange-300", O: "bg-sky-500/20 text-sky-300",
  P: "bg-fuchsia-500/20 text-fuchsia-300", Q: "bg-teal-500/20 text-teal-300", R: "bg-rose-500/20 text-rose-300",
  S: "bg-violet-500/20 text-violet-300", T: "bg-teal-500/20 text-teal-300", U: "bg-blue-500/20 text-blue-300",
  V: "bg-zinc-500/20 text-zinc-300", W: "bg-emerald-500/20 text-emerald-300", X: "bg-zinc-500/20 text-zinc-300",
  Y: "bg-yellow-500/20 text-yellow-300", Z: "bg-zinc-500/20 text-zinc-300",
};

function getLogoColor(letter: string) {
  const up = letter.toUpperCase();
  return LOGO_COLORS[up] || "bg-zinc-700/50 text-zinc-300";
}

// ── Skill category color & icon ───────────────────────────────────────────────
const SKILL_CONFIG = {
  frontend: { color: "from-cyan-500 to-emerald-500", icon: Globe },
  backend:  { color: "from-emerald-500 to-violet-500", icon: Database },
  devops:   { color: "from-violet-500 to-pink-500", icon: Cpu },
  ml:       { color: "from-orange-500 to-red-500", icon: Code2 },
};

// ── Modals ────────────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card w-full max-w-md p-6 rounded-2xl border border-white/10 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
           <XCircle className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
        {children}
      </motion.div>
    </div>
  );
}

function AddAppModal({ isOpen, onClose, userId }: { isOpen: boolean, onClose: () => void, userId: string }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<AppStatus>("applied");
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        userId,
        company,
        role,
        status,
        appliedDate,
        logo: company.charAt(0).toUpperCase() || "C",
        createdAt: serverTimestamp()
      });
      setCompany(""); setRole(""); setStatus("applied");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Application">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Company Name</label>
          <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="input-dark w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Google" />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Role</label>
          <input required type="text" value={role} onChange={e => setRole(e.target.value)} className="input-dark w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Software Engineer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as AppStatus)} className="input-dark w-full rounded-xl px-4 py-2.5 text-sm appearance-none cursor-pointer">
              <option value="applied" className="bg-zinc-900 text-zinc-200">Applied</option>
              <option value="interview" className="bg-zinc-900 text-zinc-200">Interview</option>
              <option value="offer" className="bg-zinc-900 text-zinc-200">Offer</option>
              <option value="rejected" className="bg-zinc-900 text-zinc-200">Rejected</option>
              <option value="wishlist" className="bg-zinc-900 text-zinc-200">Wishlist</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Date Applied</label>
            <input required type="date" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} className="input-dark w-full rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>
        <div className="pt-2">
          <Button type="submit" className="w-full" loading={loading}>Save Application</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddSkillModal({ isOpen, onClose, userId }: { isOpen: boolean, onClose: () => void, userId: string }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(50);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let category = "frontend";
      const n = name.toLowerCase();
      if (n.includes("node") || n.includes("sql") || n.includes("python") || n.includes("back") || n.includes("java") || n.includes("go") || n.includes("rust")) category = "backend";
      if (n.includes("docker") || n.includes("aws") || n.includes("devops") || n.includes("cloud") || n.includes("linux")) category = "devops";
      if (n.includes("ml") || n.includes("ai") || n.includes("data") || n.includes("tensor") || n.includes("pytorch")) category = "ml";

      await addDoc(collection(db, "skills"), {
        userId,
        name,
        level,
        category,
        createdAt: serverTimestamp()
      });
      setName(""); setLevel(50);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Skill">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Skill Name</label>
          <input required type="text" value={name} onChange={e => setName(e.target.value)} className="input-dark w-full rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. React.js" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-zinc-400 mb-2">
            <label>Proficiency</label>
            <span className="text-emerald-400 font-medium">{level}%</span>
          </div>
          <input type="range" min="1" max="100" value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
        <div className="pt-2">
          <Button type="submit" className="w-full" loading={loading}>Save Skill</Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Widget: Welcome ───────────────────────────────────────────────────────────
function WelcomeWidget({ name, upcomingInterviews, onAddApp }: { name: string, upcomingInterviews: number, onAddApp: () => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <Card animate delay={0} className="p-6 col-span-2 relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-full">
        <div>
          <p className="text-zinc-500 text-sm mb-1">{today}</p>
          <h1 className="text-2xl font-black text-zinc-100">
            {greeting}, <span className="gradient-text">{name}.</span> 👋
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            You have <span className="text-zinc-200 font-semibold">{upcomingInterviews} upcoming {upcomingInterviews === 1 ? 'interview' : 'interviews'}</span>. Keep it up!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onAddApp} variant="secondary" size="sm">
            <Plus className="w-3.5 h-3.5" /> Add Application
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ── Widget: Goal ──────────────────────────────────────────────────────────────
function GoalWidget() {
  const done = ROADMAP_MILESTONES.filter((m) => m.done).length;
  const pct = Math.round((done / ROADMAP_MILESTONES.length) * 100);

  return (
    <Card animate delay={0.05} hover glow="violet" className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-violet-500/15">
          <Target className="w-4 h-4 text-violet-400" />
        </div>
        <span className="text-sm font-semibold text-zinc-200">Current Goal</span>
      </div>

      <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-medium">Targeting</p>
      <p className="text-xl font-black gradient-text mb-1">Full Stack Developer</p>
      <p className="text-xs text-zinc-500 mb-4">~ Q3 2025 target date</p>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-zinc-400">Roadmap Progress</span>
          <span className="text-xs font-semibold text-zinc-300">{pct}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Milestones mini-list */}
      <div className="mt-4 space-y-1.5 flex-1">
        {ROADMAP_MILESTONES.slice(0, 3).map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.done ? "bg-emerald-500/20" : "bg-white/5"
            }`}>
              {m.done ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </div>
            <span className={`text-xs ${m.done ? "text-zinc-400 line-through" : "text-zinc-300"}`}>{m.label}</span>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors mt-3">
        View full roadmap <ChevronRight className="w-3 h-3" />
      </button>
    </Card>
  );
}

// ── Widget: Stats strip ───────────────────────────────────────────────────────
function StatsWidget({ apps }: { apps: Application[] }) {
  const total = apps.length;
  const interviews = apps.filter((a) => a.status === "interview").length;
  const offers = apps.filter((a) => a.status === "offer").length;
  const applied = apps.filter((a) => a.status === "applied").length;

  const stats = [
    { label: "Total Applied", value: total, icon: Briefcase, color: "text-zinc-300", bg: "bg-white/5" },
    { label: "Interviews", value: interviews, icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Offers", value: offers, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Pending", value: applied, icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  return (
    <Card animate delay={0.1} className="p-6 col-span-2 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-emerald-500/15">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-sm font-semibold text-zinc-200">Activity Overview</span>
        <span className="ml-auto text-xs text-zinc-600">All time</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-white/5 flex flex-col justify-between`}>
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
            <div>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-zinc-500 mt-0.5 whitespace-nowrap">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Widget: Applications ──────────────────────────────────────────────────────
function ApplicationsWidget({ applications, loading, onAddApp }: { applications: Application[], loading: boolean, onAddApp: () => void }) {
  const [filter, setFilter] = useState<AppStatus | "all">("all");

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  return (
    <Card animate delay={0.15} className="p-6 col-span-2 lg:col-span-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/15">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-zinc-200">Applications</span>
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors bg-white/5 hover:bg-white/8 px-2.5 py-1.5 rounded-lg">
            <Filter className="w-3 h-3" /> Filter
          </button>
          <Button onClick={onAddApp} variant="ghost" size="sm" className="text-xs px-2.5 py-1.5">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "applied", "interview", "offer", "wishlist", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 capitalize ${
              filter === s
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                : "border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15"
            }`}
          >
            {s === "all" ? "All" : STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
      ) : applications.length === 0 ? (
        <div className="py-12 text-center bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
            <Briefcase className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-200 font-medium text-lg">No applications tracked yet.</p>
            <p className="text-sm text-zinc-500 mb-6 mt-1">Start tracking your job hunt progress!</p>
            <Button onClick={onAddApp} size="sm">Add First Application</Button>
        </div>
      ) : filtered.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.02] rounded-xl border border-white/5">
            <p className="text-zinc-500 text-sm">No applications found for this status.</p>
          </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((app, i) => {
              const S = STATUS_CONFIG[app.status];
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3 group transition-all duration-200 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${getLogoColor(app.logo)}`}>
                    {app.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{app.company}</p>
                    <p className="text-xs text-zinc-500 truncate">{app.role}</p>
                  </div>
                  <div className="text-right hidden sm:block w-24">
                    <p className="text-xs text-zinc-600">Applied</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${S.className} flex items-center gap-1`}>
                    <S.icon className="w-3 h-3" />
                    {S.label}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 hidden sm:block" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}

// ── Widget: Skills ────────────────────────────────────────────────────────────
function SkillsWidget({ skills, loading, onAddSkill }: { skills: Skill[], loading: boolean, onAddSkill: () => void }) {
  return (
    <Card animate delay={0.2} hover glow="cyan" className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-cyan-500/15">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-sm font-semibold text-zinc-200">Skill Progress</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 ml-auto" />
      </div>

      <div className="flex-1">
          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-cyan-400" /></div>
          ) : skills.length === 0 ? (
            <div className="py-6 text-center bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                <Zap className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 mb-4">No skills logged yet.</p>
                <Button onClick={onAddSkill} variant="secondary" size="sm">Add a Skill</Button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
                {skills.slice(0, 6).map((skill, i) => {
                const conf = SKILL_CONFIG[skill.category] || SKILL_CONFIG.frontend;
                const Icon = conf.icon;
                return (
                <motion.div
                    key={skill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                >
                    <div className="flex justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs font-medium text-zinc-300">{skill.name}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${conf.color}`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                    </div>
                </motion.div>
                )})}
            </div>
          )}
      </div>

      {skills.length > 0 && (
          <button onClick={onAddSkill} className="flex items-center justify-center w-full gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 py-2 rounded-xl transition-all mt-4 border border-transparent hover:border-cyan-500/20">
            Add another skill <Plus className="w-3 h-3" />
          </button>
      )}
    </Card>
  );
}

// ── Widget: Quick actions ─────────────────────────────────────────────────────
function QuickActionsWidget({ onAddApp, onAddSkill }: { onAddApp: () => void, onAddSkill: () => void }) {
  const actions = [
    { icon: Plus, label: "New App", color: "text-emerald-400 bg-emerald-500/10", desc: "Track a job", onClick: onAddApp },
    { icon: Code2, label: "Add Skill", color: "text-cyan-400 bg-cyan-500/10", desc: "Log progress", onClick: onAddSkill },
    { icon: Target, label: "Set Goal", color: "text-violet-400 bg-violet-500/10", desc: "Target role", onClick: () => {} },
    { icon: Calendar, label: "Prep", color: "text-amber-400 bg-amber-500/10", desc: "Ace it", onClick: () => {} },
  ];

  return (
    <Card animate delay={0.25} className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-zinc-200">Quick Actions</span>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {actions.map((a) => (
          <motion.button
            key={a.label}
            onClick={a.onClick}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-start gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all text-left w-full h-full justify-center"
          >
            <div className={`p-1.5 rounded-lg ${a.color} mb-1`}>
              <a.icon className="w-3.5 h-3.5" />
            </div>
            <div>
                <p className="text-xs font-semibold text-zinc-200">{a.label}</p>
                <p className="text-[10px] text-zinc-500 hidden sm:block">{a.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}



// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [isAppModalOpen, setAppModalOpen] = useState(false);
  const [isSkillModalOpen, setSkillModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);

    const qApps = query(collection(db, "applications"), where("userId", "==", user.uid));
    const unsubApps = onSnapshot(qApps, (snap) => {
        const apps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        apps.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setApplications(apps);
    });

    const qSkills = query(collection(db, "skills"), where("userId", "==", user.uid));
    const unsubSkills = onSnapshot(qSkills, (snap) => {
        const sks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
        sks.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setSkills(sks);
        setDataLoading(false);
    });

    return () => {
        unsubApps();
        unsubSkills();
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full"
        />
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "there";
  const upcomingInterviews = applications.filter(a => a.status === "interview").length;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <Sidebar onLogout={handleLogout} />
      <Topbar email={user.email ?? ""} />

      <main className="lg:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {/* Row 1: Welcome (col-span-2) + Goal + Quick Actions */}
            <div className="md:col-span-2 lg:col-span-2">
              <WelcomeWidget name={displayName} upcomingInterviews={upcomingInterviews} onAddApp={() => setAppModalOpen(true)} />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <GoalWidget />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <QuickActionsWidget onAddApp={() => setAppModalOpen(true)} onAddSkill={() => setSkillModalOpen(true)} />
            </div>

            {/* Row 2: Stats (col-span-2) + Skills */}
            <div className="md:col-span-2 lg:col-span-2">
              <StatsWidget apps={applications} />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <SkillsWidget skills={skills} loading={dataLoading} onAddSkill={() => setSkillModalOpen(true)} />
            </div>

            {/* Row 3: Applications full width */}
            <div className="md:col-span-2 lg:col-span-4 h-auto">
              <ApplicationsWidget applications={applications} loading={dataLoading} onAddApp={() => setAppModalOpen(true)} />
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAppModalOpen && <AddAppModal isOpen={isAppModalOpen} onClose={() => setAppModalOpen(false)} userId={user.uid} />}
        {isSkillModalOpen && <AddSkillModal isOpen={isSkillModalOpen} onClose={() => setSkillModalOpen(false)} userId={user.uid} />}
      </AnimatePresence>
    </div>
  );
}

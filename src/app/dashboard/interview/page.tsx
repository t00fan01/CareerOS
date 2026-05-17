"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sidebar, Topbar } from "@/components/ui/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Zap, CheckCircle2, XCircle, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function InterviewPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // State for the interactive quiz
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerate = async () => {
    if (!role.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok && data.questions) {
        setQuestions(data.questions);
        setSelectedAnswers({});
        setIsSubmitted(false);
      } else {
        console.error(data.error);
        alert(data.error || "Failed to generate assessment");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setIsSubmitted(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <Sidebar onLogout={() => { logout(); router.push("/"); }} />
      <Topbar email={user.email ?? ""} />

      <main className="lg:ml-64 pt-24 p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400">
                <Code2 className="w-6 h-6" />
              </div>
              Mock Interview Simulator
            </h1>
            <p className="text-zinc-400 mt-2">Test your technical knowledge with AI-generated, role-specific assessments.</p>
          </div>

          {!questions.length && (
            <Card animate delay={0} className="p-8 text-center border-dashed border-white/10 bg-white/[0.01]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-zinc-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Configure Assessment</h2>
              <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto">
                Enter your target role below to generate 3 highly specific, advanced multiple-choice questions to test your readiness.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Node.js Engineer"
                  className="input-dark flex-1 rounded-xl px-4 py-3 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <Button onClick={handleGenerate} loading={loading} className="whitespace-nowrap py-3">
                  <Play className="w-4 h-4 mr-2" /> Generate
                </Button>
              </div>
            </Card>
          )}

          {questions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {questions.map((q, qIndex) => (
                <Card key={qIndex} animate delay={qIndex * 0.1} className="p-6">
                  <h3 className="text-lg font-medium text-zinc-100 mb-4 flex gap-3">
                    <span className="text-emerald-500 font-black">{qIndex + 1}.</span>
                    {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedAnswers[qIndex] === optIndex;
                      const isCorrect = q.correctIndex === optIndex;
                      
                      let btnClass = "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] text-zinc-300";
                      
                      if (isSelected && !isSubmitted) {
                        btnClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                      } else if (isSubmitted) {
                        if (isCorrect) {
                          btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-medium";
                        } else if (isSelected) {
                          btnClass = "bg-red-500/20 border-red-500/50 text-red-400";
                        } else {
                          btnClass = "bg-white/[0.01] border-white/5 text-zinc-600 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelect(qIndex, optIndex)}
                          disabled={isSubmitted}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 flex items-center justify-between group ${btnClass}`}
                        >
                          <span className="flex-1">{opt}</span>
                          {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-3" />}
                          {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 ml-3" />}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
                      >
                        <p className="text-sm text-zinc-400 bg-white/[0.02] p-4 rounded-xl border border-white/5 leading-relaxed">
                          <span className="font-semibold text-zinc-200 block mb-1">Explanation:</span>
                          {q.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => { setQuestions([]); setRole(""); }}
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Start Over
                </button>
                {!isSubmitted && (
                  <Button onClick={handleSubmit} className="px-8">
                    Submit Answers <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}

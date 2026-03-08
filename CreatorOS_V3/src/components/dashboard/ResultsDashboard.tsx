import { motion } from "framer-motion";
import { Copy, Check, AlertTriangle, ShieldAlert, BookOpen } from "lucide-react";
import { useState } from "react";
import { ScoreCard } from "./ScoreCard";
import { AnalysisResult } from "@/lib/api";

interface ResultsDashboardProps {
  results: AnalysisResult;
}

function CopyableText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative">
      <pre className="bg-secondary/30 border border-border rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto">
        {text}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const { scores, optimizedScript, viralHooks, caption, improvements, safeguard } = results;

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreCard label="Virality Score" score={scores.virality} emoji="🔥" delay={0} />
        <ScoreCard label="Clarity Score" score={scores.clarity} emoji="📖" delay={0.1} />
        <ScoreCard label="Policy Safety" score={scores.policySafety} emoji="🛡️" delay={0.2} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Optimized Script */}
        <motion.div {...fadeIn(0.3)} className="glass-card p-6 space-y-3">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Optimized Script
          </h3>
          <CopyableText text={optimizedScript} />
        </motion.div>

        {/* Viral Hooks */}
        <motion.div {...fadeIn(0.35)} className="glass-card p-6 space-y-3">
          <h3 className="text-base font-semibold text-foreground">🎣 Viral Hooks</h3>
          <ul className="space-y-2">
            {viralHooks.map((hook, i) => (
              <li key={i} className="flex gap-2 text-sm text-secondary-foreground">
                <span className="text-primary mt-0.5">▸</span>
                <span>{hook}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Caption & Hashtags */}
        <motion.div {...fadeIn(0.4)} className="glass-card p-6 space-y-3">
          <h3 className="text-base font-semibold text-foreground">📝 Caption & Hashtags</h3>
          <CopyableText text={caption} />
        </motion.div>

        {/* Improvements */}
        <motion.div {...fadeIn(0.45)} className="glass-card p-6 space-y-3">
          <h3 className="text-base font-semibold text-foreground">💡 Improvements</h3>
          <ul className="space-y-2.5">
            {improvements.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-secondary-foreground">
                <span className="inline-block w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex-shrink-0 flex items-center justify-center font-mono font-bold">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* SafeGuard Warning Panel */}
      <motion.div
        {...fadeIn(0.5)}
        className="glass-card border-neon-amber/30 bg-neon-amber/5 p-6 space-y-5"
      >
        <h3 className="text-base font-semibold text-neon-amber flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          SafeGuard Warnings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Copyright */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-neon-red flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Copyright Risks
            </h4>
            {safeguard.copyrightRisks.map((r, i) => (
              <p key={i} className="text-xs text-secondary-foreground leading-relaxed">{r}</p>
            ))}
          </div>

          {/* Factual */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-neon-amber flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Factual Issues
            </h4>
            {safeguard.factualIssues.map((r, i) => (
              <p key={i} className="text-xs text-secondary-foreground leading-relaxed">{r}</p>
            ))}
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-neon-blue flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Platform Warnings
            </h4>
            {safeguard.platformWarnings.map((w, i) => (
              <div key={i} className="text-xs text-secondary-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{w.platform}:</span> {w.warning}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

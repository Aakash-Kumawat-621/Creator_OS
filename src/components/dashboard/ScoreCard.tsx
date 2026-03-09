import { motion } from "framer-motion";

interface ScoreCardProps {
  label: string;
  score: number;
  emoji: string;
  delay?: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-neon-green";
  if (score >= 60) return "text-neon-amber";
  return "text-neon-red";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-neon-green/10 border-neon-green/20";
  if (score >= 60) return "bg-neon-amber/10 border-neon-amber/20";
  return "bg-neon-red/10 border-neon-red/20";
}

export function ScoreCard({ label, score, emoji, delay = 0 }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-card p-6 flex flex-col items-center gap-3 border ${getScoreBg(score)}`}
    >
      <span className="text-3xl">{emoji}</span>
      <motion.span
        className={`text-4xl font-bold font-mono ${getScoreColor(score)}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: delay + 0.2 }}
      >
        {score}
      </motion.span>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </motion.div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /** Live status message from the API pipeline */
  message?: string;
}

export function LoadingState({ message = "Analyzing content…" }: LoadingStateProps) {

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8">
      {/* Animated rings */}
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-accent/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-lg text-muted-foreground font-medium"
        >
          {message}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--gradient-hero)" }}
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 12, ease: "linear" }}
        />
      </div>
    </div>
  );
}

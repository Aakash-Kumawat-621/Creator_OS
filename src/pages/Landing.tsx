import { motion } from "framer-motion";
import { Zap, ArrowRight, BarChart3, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  { icon: Sparkles, title: "AI Viral Hooks", desc: "Generate scroll-stopping hooks optimized for every platform." },
  { icon: BarChart3, title: "Content Scoring", desc: "Get virality, clarity, and safety scores before you post." },
  { icon: Shield, title: "SafeGuard", desc: "Catch copyright risks, factual issues, and policy violations automatically." },
];

const Landing = () => (
  <div className="min-h-screen" style={{ background: "var(--gradient-surface)" }}>
    <main className="max-w-7xl mx-auto px-6">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-2">
          <Zap className="w-3.5 h-3.5" /> AI-Powered Content Strategy
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
          Create Content That <br /><span className="gradient-text">Goes Viral</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Analyze, optimize, and safeguard your content with AI — before you hit publish.
        </p>
        <div className="flex gap-4 justify-center pt-2">
          <Button size="lg" className="glow-purple gap-2" asChild>
            <Link to="/app">Try It Free <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/pricing">View Pricing</Link>
          </Button>
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </main>
  </div>
);

export default Landing;

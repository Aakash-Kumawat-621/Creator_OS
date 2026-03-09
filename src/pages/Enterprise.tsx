import { motion } from "framer-motion";
import { Cpu, Users, Zap, Shield, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Cpu, title: "Full API Access", desc: "Integrate CreatorOS into your existing workflow with our RESTful API and webhooks." },
  { icon: Users, title: "Dedicated Account Manager", desc: "A real human partner to help onboard your team and optimize your content pipeline." },
  { icon: Zap, title: "Bulk Processing", desc: "Analyze hundreds of scripts and videos in parallel with priority queue processing." },
  { icon: Shield, title: "Advanced SafeGuard", desc: "Custom policy rulesets, brand safety scoring, and real-time compliance monitoring." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Cross-platform performance insights, trend detection, and ROI tracking for your agency." },
  { icon: Globe, title: "Multi-Language Support", desc: "Analyze and optimize content in 30+ languages with localized viral hook generation." },
];

const Enterprise = () => (
  <div className="min-h-screen" style={{ background: "var(--gradient-surface)" }}>
    <main className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 mb-16">
        <p className="text-primary font-mono text-sm tracking-wider uppercase">For Teams & Agencies</p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Scale Your Content <span className="gradient-text">Operations</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Power your agency with AI-driven content intelligence. From script optimization to policy compliance — at scale.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button size="lg" className="glow-purple">Contact Sales</Button>
          <Button size="lg" variant="outline">Book a Demo</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass-card h-full">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-10 text-center space-y-4" style={{ background: "var(--gradient-card)" }}>
        <h2 className="text-2xl font-bold text-foreground">Ready to supercharge your agency?</h2>
        <p className="text-muted-foreground">Get a custom quote based on your team's volume and needs.</p>
        <Button size="lg" className="glow-purple">Get Started →</Button>
      </motion.div>
    </main>
  </div>
);

export default Enterprise;

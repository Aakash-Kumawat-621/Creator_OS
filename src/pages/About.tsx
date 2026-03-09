import { motion } from "framer-motion";
import { Heart, Target, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const team = [
  { name: "Aakash Kumawat", role: "Leader", avatar: "AK" },
  { name: "Abhishek Jha", role: "Member", avatar: "AJ" },
  { name: "Aryan Ujjwal", role: "Member", avatar: "AU" },
  { name: "Ashmit Rana", role: "Member", avatar: "AR" },
];

const values = [
  { icon: Heart, title: "Creator-First", desc: "Every feature we ship starts with a creator's real problem." },
  { icon: Target, title: "Precision", desc: "We obsess over accuracy — from viral predictions to policy compliance." },
  { icon: Lightbulb, title: "Innovation", desc: "We push the boundaries of what AI can do for content creation." },
];

const About = () => (
  <div className="min-h-screen" style={{ background: "var(--gradient-surface)" }}>
    <main className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Built for Creators, <span className="gradient-text">by Creators</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          We started CreatorOS because we were tired of guessing what works. So we built the AI tool we always wished existed.
        </p>
      </motion.div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {values.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card h-full">
              <CardContent className="p-6 text-center space-y-3">
                <v.icon className="w-8 h-8 text-primary mx-auto" />
                <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Team */}
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Meet the Team</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-fit mx-auto">
        {team.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
              {t.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  </div>
);

export default About;

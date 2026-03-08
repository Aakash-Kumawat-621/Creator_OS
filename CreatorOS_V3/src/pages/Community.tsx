import { motion } from "framer-motion";
import { MessageCircle, Star, Users, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  { name: "Sarah Chen", handle: "@sarahcreates", quote: "CreatorOS literally doubled my engagement in two weeks. The SafeGuard feature saved me from a copyright strike.", avatar: "SC" },
  { name: "Marcus Johnson", handle: "@marcusj", quote: "The viral hook suggestions are insanely good. My last three Reels all hit the Explore page.", avatar: "MJ" },
  { name: "Priya Sharma", handle: "@priyatech", quote: "As a tech creator, the platform-specific optimizations are a game changer. What works on YouTube doesn't work on TikTok — CreatorOS knows that.", avatar: "PS" },
  { name: "Alex Rivera", handle: "@alexrivera", quote: "I replaced three tools with CreatorOS. Script writing, trend analysis, and safety checks — all in one place.", avatar: "AR" },
  { name: "Emily Zhang", handle: "@emilyzhang", quote: "The clarity score helped me realize my scripts were too complex. Simplified them and saw 40% more watch time.", avatar: "EZ" },
  { name: "David Kim", handle: "@davidkim", quote: "Enterprise plan for our agency was a no-brainer. We process 200+ videos a month through the API.", avatar: "DK" },
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Creators" },
  { icon: MessageCircle, value: "1.2M", label: "Content Analyzed" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
];

const Community = () => (
  <div className="min-h-screen" style={{ background: "var(--gradient-surface)" }}>
    <main className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Join the Creator <span className="gradient-text">Revolution</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Connect with thousands of creators who are using AI to craft better content, grow faster, and stay safe.
        </p>
        <Button size="lg" className="glow-purple mt-4 gap-2">
          <ExternalLink className="w-4 h-4" /> Join our Discord
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {stats.map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
            <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What Creators Are Saying</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass-card h-full">
              <CardContent className="p-6 flex flex-col gap-4">
                <p className="text-secondary-foreground text-sm leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.handle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  </div>
);

export default Community;

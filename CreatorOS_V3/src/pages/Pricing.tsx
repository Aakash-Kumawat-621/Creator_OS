import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "For hobbyists getting started.",
    highlight: false,
    features: [
      "5 analyses/month",
      "Idea & Script input only",
      "2 platforms",
      "Basic viral hooks",
      "Community support",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For serious creators who want an edge.",
    highlight: true,
    features: [
      "Unlimited analyses",
      "Video upload & transcription",
      "All platforms",
      "Advanced viral hooks",
      "SafeGuard checks",
      "Caption & hashtag generation",
      "Priority support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Agency",
    price: "$149",
    period: "/month",
    desc: "For teams and agencies at scale.",
    highlight: false,
    features: [
      "Everything in Pro",
      "Full API access",
      "Bulk video processing",
      "Dedicated account manager",
      "Custom SafeGuard rules",
      "Analytics dashboard",
      "SSO & team management",
    ],
    cta: "Contact Sales",
  },
];

const Pricing = () => (
  <div className="min-h-screen" style={{ background: "var(--gradient-surface)" }}>
    <main className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Start free, upgrade when you're ready. No hidden fees. Cancel anytime.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier, i) => (
          <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card
              className={cn(
                "h-full flex flex-col",
                tier.highlight
                  ? "border-primary/60 glow-purple glass-card"
                  : "glass-card"
              )}
            >
              <CardHeader className="pb-2">
                {tier.highlight && (
                  <span className="text-xs font-mono text-primary tracking-wider uppercase mb-1">Most Popular</span>
                )}
                <CardTitle className="text-xl text-foreground">{tier.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{tier.desc}</p>
                <div className="pt-2">
                  <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-secondary-foreground">
                      <Check className="w-4 h-4 text-neon-green shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn(
                    "w-full",
                    tier.highlight ? "glow-purple" : ""
                  )}
                  variant={tier.highlight ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  </div>
);

export default Pricing;

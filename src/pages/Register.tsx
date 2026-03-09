import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Chrome, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRegister = (method: string) => {
    setLoading(method);
    setTimeout(() => {
      setLoading(null);
      toast({ title: `Registered with ${method}`, description: "Welcome to CreatorOS!" });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-surface)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-purple">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Creator<span className="gradient-text">OS</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mt-4">Create your account</h1>
            <p className="text-sm text-muted-foreground">Join thousands of creators using AI</p>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 text-sm font-medium gap-3 border-border/60 hover:bg-secondary"
              onClick={() => handleRegister("Google")}
              disabled={loading !== null}
            >
              {loading === "Google" ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Chrome className="w-5 h-5 text-primary" />
              )}
              Sign up with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 text-sm font-medium gap-3 border-border/60 hover:bg-secondary"
              onClick={() => handleRegister("Outlook")}
              disabled={loading !== null}
            >
              {loading === "Outlook" ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mail className="w-5 h-5 text-blue-400" />
              )}
              Sign up with Outlook
            </Button>

            <div className="flex items-center gap-3 py-1">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="secondary"
              className="w-full h-12 text-sm font-medium gap-3"
              onClick={() => handleRegister("Guest")}
              disabled={loading !== null}
            >
              {loading === "Guest" ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <User className="w-5 h-5" />
              )}
              Continue as Guest
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

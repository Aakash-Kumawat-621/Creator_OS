import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Community", to: "/community" },
  { label: "Enterprise", to: "/enterprise" },
  { label: "About Us", to: "/about" },
  { label: "Pricing", to: "/pricing" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.png"
            alt="CreatorOS"
            className="w-8 h-8 rounded-lg object-contain"
            onError={(e) => {
              // Fallback to text icon if logo.png not found
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-lg font-bold text-foreground">
            Creator<span className="gradient-text">OS</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 ml-auto mr-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.to
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Separator orientation="vertical" className="h-6" />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="glow-purple">
              Register
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;

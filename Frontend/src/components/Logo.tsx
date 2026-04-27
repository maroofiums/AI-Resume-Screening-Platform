import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2 group", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary blur-md opacity-50 group-hover:opacity-80 transition-opacity rounded-lg" />
        <div className="relative bg-gradient-primary rounded-lg p-1.5 shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
      </div>
      <span className="font-semibold tracking-tight text-lg">
        Aether<span className="gradient-text">Screen</span>
      </span>
    </Link>
  );
}

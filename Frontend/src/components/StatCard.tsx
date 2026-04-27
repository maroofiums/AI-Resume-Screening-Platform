import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, hint, trend, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:shadow-md-soft transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="font-display text-3xl font-bold tracking-tight">{value}</div>
        {trend && <div className="text-xs text-success font-medium">{trend}</div>}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}

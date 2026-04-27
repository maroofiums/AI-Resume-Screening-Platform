import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/utils/config";

const styles: Record<ApplicationStatus, string> = {
  applied: "bg-muted text-muted-foreground border-border",
  screened: "bg-accent/10 text-accent border-accent/30",
  shortlisted: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  const key = (status?.toLowerCase() as ApplicationStatus) || "applied";
  const cls = styles[key] ?? styles.applied;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        cls
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

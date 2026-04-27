import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, FileText, Gauge, XCircle } from "lucide-react";
import { applicationsService } from "@/services/applications";
import { PageHeader, StatCardSkeleton } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuthStore } from "@/store/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CandidateDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useQuery({
    queryKey: ["applications", "mine"],
    queryFn: () => applicationsService.list(),
  });

  const apps = data?.results ?? [];
  const total = apps.length;
  const shortlisted = apps.filter((a) => a.status === "shortlisted").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;
  const scores = apps.map((a) => a.score).filter((s): s is number => typeof s === "number");
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "-";

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.username ?? ""} 👋`}
        subtitle="Here's what's happening with your applications."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Applications Sent" value={total} icon={FileText} />
            <StatCard label="Shortlisted" value={shortlisted} icon={CheckCircle2} hint={total ? `${Math.round((shortlisted / total) * 100)}% of total` : undefined} />
            <StatCard label="Rejected" value={rejected} icon={XCircle} />
            <StatCard label="Avg Screening Score" value={avg} icon={Gauge} />
          </>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">Recent applications</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/candidate/applications">View all</Link></Button>
        </div>
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : apps.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Browse jobs and apply to get your screening score."
            action={
              <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Link to="/candidate/jobs">Browse jobs</Link></Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {apps.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors">
                <div>
                  <div className="font-medium">{a.job_title ?? `Job #${a.job}`}</div>
                  <div className="text-xs text-muted-foreground">Applied {a.applied_at ? new Date(a.applied_at).toLocaleDateString() : "-"}</div>
                </div>
                <div className="flex items-center gap-4">
                  {typeof a.score === "number" && <span className="text-sm font-mono text-muted-foreground">{a.score.toFixed(1)}</span>}
                  <StatusBadge status={a.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

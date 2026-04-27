import { useQuery } from "@tanstack/react-query";
import { Briefcase, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { jobsService } from "@/services/jobs";
import { applicationsService } from "@/services/applications";
import { PageHeader, StatCardSkeleton } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuthStore } from "@/store/auth";
import { StatusBadge } from "@/components/StatusBadge";

export default function EmployerDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: jobs, isLoading: jLoad } = useQuery({ queryKey: ["jobs", "all"], queryFn: () => jobsService.list({}) });
  const { data: apps, isLoading: aLoad } = useQuery({ queryKey: ["applications", "employer"], queryFn: () => applicationsService.list() });

  const totalJobs = jobs?.results?.length ?? 0;
  const totalApps = apps?.results?.length ?? 0;
  const shortlisted = apps?.results?.filter((a) => a.status === "shortlisted").length ?? 0;
  const funnel = totalApps ? `${Math.round((shortlisted / totalApps) * 100)}%` : "-";

  const recent = (apps?.results ?? []).slice(0, 6);

  return (
    <>
      <PageHeader title={`Hi ${user?.username ?? ""} 👋`} subtitle="An overview of your hiring pipeline." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {jLoad || aLoad ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Jobs" value={totalJobs} icon={Briefcase} />
            <StatCard label="Total Applicants" value={totalApps} icon={Users} />
            <StatCard label="Shortlisted" value={shortlisted} icon={CheckCircle2} />
            <StatCard label="Hire Funnel %" value={funnel} icon={TrendingUp} />
          </>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">Recent applicants</h2>
        </div>
        <ul className="divide-y divide-border">
          {recent.length === 0 ? (
            <li className="p-6 text-sm text-muted-foreground">No applications yet.</li>
          ) : recent.map((a) => (
            <li key={a.id} className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors">
              <div>
                <div className="font-medium">{a.candidate_name ?? `Candidate #${a.candidate}`}</div>
                <div className="text-xs text-muted-foreground">{a.job_title ?? `Job #${a.job}`} • {a.applied_at ? new Date(a.applied_at).toLocaleDateString() : "-"}</div>
              </div>
              <div className="flex items-center gap-4">
                {typeof a.score === "number" && <span className="text-sm font-mono text-muted-foreground">{a.score.toFixed(1)}</span>}
                <StatusBadge status={a.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

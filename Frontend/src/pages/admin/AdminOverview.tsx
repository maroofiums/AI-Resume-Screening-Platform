import { useQuery } from "@tanstack/react-query";
import { Activity, Briefcase, FileText, Users } from "lucide-react";
import { jobsService } from "@/services/jobs";
import { applicationsService } from "@/services/applications";
import { PageHeader, StatCardSkeleton } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminOverview() {
  const jobsQ = useQuery({ queryKey: ["admin", "jobs"], queryFn: () => jobsService.list({}) });
  const appsQ = useQuery({ queryKey: ["admin", "apps"], queryFn: () => applicationsService.list() });

  const totalJobs = jobsQ.data?.results?.length ?? 0;
  const totalApps = appsQ.data?.results?.length ?? 0;
  const activeJobs = jobsQ.data?.results?.filter((j) => j.is_active !== false).length ?? 0;
  const recent = (appsQ.data?.results ?? []).slice(0, 8);

  return (
    <>
      <PageHeader title="Platform Overview" subtitle="Snapshot of platform-wide activity." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {jobsQ.isLoading || appsQ.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Jobs" value={totalJobs} icon={Briefcase} />
            <StatCard label="Active Jobs" value={activeJobs} icon={Activity} />
            <StatCard label="Total Applications" value={totalApps} icon={FileText} />
            <StatCard label="Users" value="-" icon={Users} hint="Wire to /api/users/ when available" />
          </>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">Recent activity</h2>
        </div>
        <ul className="divide-y divide-border">
          {recent.length === 0 ? (
            <li className="p-6 text-sm text-muted-foreground">No activity yet.</li>
          ) : recent.map((a) => (
            <li key={a.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{a.candidate_name ?? `Candidate #${a.candidate}`} → {a.job_title ?? `Job #${a.job}`}</div>
                <div className="text-xs text-muted-foreground">{a.applied_at ? new Date(a.applied_at).toLocaleString() : ""}</div>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

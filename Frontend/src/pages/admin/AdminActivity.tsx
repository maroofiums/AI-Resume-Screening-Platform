import { useQuery } from "@tanstack/react-query";
import { applicationsService } from "@/services/applications";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Activity } from "lucide-react";

export default function AdminActivity() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "activity"], queryFn: () => applicationsService.list() });
  const items = data?.results ?? [];

  return (
    <>
      <PageHeader title="Recent Activity" subtitle="Latest applications across the platform." />
      <div className="rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState icon={Activity} title="Nothing yet" description="Activity will appear here as candidates apply." />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((a) => (
              <li key={a.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{a.candidate_name ?? `Candidate #${a.candidate}`} → {a.job_title ?? `Job #${a.job}`}</div>
                  <div className="text-xs text-muted-foreground">{a.applied_at ? new Date(a.applied_at).toLocaleString() : ""}</div>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

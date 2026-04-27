import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { applicationsService } from "@/services/applications";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MyApplicationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications", "mine", "table"],
    queryFn: () => applicationsService.list(),
  });
  const apps = data?.results ?? [];

  return (
    <>
      <PageHeader title="My Applications" subtitle="Track every application and see your AI screening score." />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : apps.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="When you apply to jobs, they'll appear here."
            action={<Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Link to="/candidate/jobs">Browse jobs</Link></Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Applied at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.job_title ?? `Job #${a.job}`}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="font-mono">
                    {typeof a.score === "number" ? (
                      <span className={a.score >= 70 ? "text-success" : a.score >= 40 ? "text-warning" : "text-muted-foreground"}>{a.score.toFixed(1)}</span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.applied_at ? new Date(a.applied_at).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

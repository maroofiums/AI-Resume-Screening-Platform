import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { jobsService } from "@/services/jobs";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/EmptyState";

export default function AdminJobs() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "jobs", "all"], queryFn: () => jobsService.list({}) });
  const jobs = data?.results ?? [];

  return (
    <>
      <PageHeader title="Jobs Overview" subtitle="All jobs across the platform." />
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : jobs.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.title}</TableCell>
                  <TableCell className="text-muted-foreground">{j.company_name ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{j.location ?? "-"}</TableCell>
                  <TableCell>{j.is_active === false ? "No" : "Yes"}</TableCell>
                  <TableCell className="text-muted-foreground">{j.created_at ? new Date(j.created_at).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

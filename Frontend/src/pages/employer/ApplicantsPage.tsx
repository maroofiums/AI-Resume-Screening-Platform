import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink, Search, Users, XCircle } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { applicationsService, type Application } from "@/services/applications";
import { extractApiError } from "@/services/api";
import type { ApplicationStatus } from "@/utils/config";

export default function ApplicantsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["applications", "employer-list"],
    queryFn: () => applicationsService.list(),
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) => applicationsService.update(id, { status }),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["applications"] }); },
    onError: (e) => toast.error(extractApiError(e)),
  });

  const filtered = useMemo(() => {
    let items = data?.results ?? [];
    if (status !== "all") items = items.filter((a) => a.status === status);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((a) =>
        (a.candidate_name ?? "").toLowerCase().includes(q) ||
        (a.job_title ?? "").toLowerCase().includes(q)
      );
    }
    return items;
  }, [data, status, search]);

  return (
    <>
      <PageHeader title="Applicants" subtitle="Review every applicant, their score, and take action." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by candidate or job" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus | "all")}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="screened">Screened</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No applicants" description="Once candidates apply, they'll show up here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a: Application) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.candidate_name ?? `Candidate #${a.candidate}`}</TableCell>
                  <TableCell className="text-muted-foreground">{a.job_title ?? `Job #${a.job}`}</TableCell>
                  <TableCell className="font-mono">
                    {typeof a.score === "number" ? (
                      <span className={a.score >= 70 ? "text-success" : a.score >= 40 ? "text-warning" : "text-muted-foreground"}>{a.score.toFixed(1)}</span>
                    ) : "-"}
                  </TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{a.applied_at ? new Date(a.applied_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {a.resume_url && (
                      <Button asChild variant="ghost" size="sm">
                        <a href={a.resume_url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" disabled={update.isPending} onClick={() => update.mutate({ id: a.id, status: "shortlisted" })} className="text-success hover:text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={update.isPending} onClick={() => update.mutate({ id: a.id, status: "rejected" })} className="text-destructive hover:text-destructive">
                      <XCircle className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

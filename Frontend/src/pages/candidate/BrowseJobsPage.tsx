import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, ChevronLeft, ChevronRight, MapPin, Search, Send } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { jobsService, type Job } from "@/services/jobs";
import { applicationsService } from "@/services/applications";
import { extractApiError } from "@/services/api";

export default function BrowseJobsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["jobs", { search, location, page }],
    queryFn: () => jobsService.list({ search: search || undefined, page }),
  });

  const { mutate: apply, isPending: applying, variables: applyingId } = useMutation({
    mutationFn: (jobId: number) => applicationsService.apply(jobId),
    onSuccess: () => {
      toast.success("Application submitted");
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => toast.error(extractApiError(err, "Could not apply")),
  });

  const filtered = useMemo(() => {
    const items = data?.results ?? [];
    if (!location) return items;
    return items.filter((j) => (j.location ?? "").toLowerCase().includes(location.toLowerCase()));
  }, [data, location]);

  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous;

  return (
    <>
      <PageHeader title="Browse Jobs" subtitle="Find roles that match your skills and apply in one click." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by role, skill or company"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="pl-9"
          />
        </div>
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filter by location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-9" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="Try a different search or clear the location filter." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((job: Job) => (
            <div key={job.id} className="group rounded-2xl border border-border bg-card p-5 hover:shadow-md-soft hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                  <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                    {job.company_name && <span>{job.company_name}</span>}
                    {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                    {job.employment_type && <span className="capitalize">{job.employment_type}</span>}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => apply(job.id)}
                  disabled={applying && applyingId === job.id}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 shrink-0"
                >
                  <Send className="mr-2 h-3.5 w-3.5" /> Apply
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{job.description}</p>
              {job.skills_required && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.skills_required.split(",").slice(0, 6).map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(hasPrev || hasNext) && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={!hasPrev || isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground px-3">Page {page}</span>
          <Button variant="outline" size="sm" disabled={!hasNext || isFetching} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}

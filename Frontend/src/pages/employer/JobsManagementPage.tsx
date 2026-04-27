import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/EmptyState";
import { jobsService, type Job } from "@/services/jobs";
import { extractApiError } from "@/services/api";

const jobSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  employment_type: z.string().trim().max(40).optional().or(z.literal("")),
  skills_required: z.string().trim().max(500).optional().or(z.literal("")),
  is_active: z.boolean().optional(),
});
type JobFormValues = z.infer<typeof jobSchema>;

export default function JobsManagementPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Job | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["jobs", "manage"], queryFn: () => jobsService.list({}) });
  const jobs = data?.results ?? [];

  const invalidate = () => qc.invalidateQueries({ queryKey: ["jobs"] });

  const toggleActive = useMutation({
    mutationFn: (j: Job) => jobsService.update(j.id, { is_active: !j.is_active }),
    onSuccess: () => { toast.success("Job updated"); invalidate(); },
    onError: (e) => toast.error(extractApiError(e)),
  });

  const removeJob = useMutation({
    mutationFn: (id: number) => jobsService.remove(id),
    onSuccess: () => { toast.success("Job deleted"); invalidate(); setDeleting(null); },
    onError: (e) => toast.error(extractApiError(e)),
  });

  return (
    <>
      <PageHeader
        title="Jobs"
        subtitle="Create, edit, and manage your open roles."
        actions={
          <Button onClick={() => setCreating(true)} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> New job
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={Briefcase}
            title="No jobs yet"
            description="Create your first job to start receiving applications."
            action={{ label: "Create job", onClick: () => setCreating(true) }}
          />
        </div>
      ) : (
        <div className="grid gap-3">
          {jobs.map((j) => (
            <div key={j.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{j.title}</h3>
                  {j.is_active === false && <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">Inactive</span>}
                </div>
                <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                  {j.location && <span>{j.location}</span>}
                  {j.employment_type && <span className="capitalize">{j.employment_type}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{j.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mr-2">
                  Active
                  <Switch checked={j.is_active !== false} onCheckedChange={() => toggleActive.mutate(j)} />
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditing(j)}><Edit3 className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" onClick={() => setDeleting(j)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <JobFormDialog
        open={creating || !!editing}
        onOpenChange={(o) => { if (!o) { setCreating(false); setEditing(null); } }}
        job={editing}
        onSaved={() => { invalidate(); setCreating(false); setEditing(null); }}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the posting and stop receiving new applications. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && removeJob.mutate(deleting.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function JobFormDialog({ open, onOpenChange, job, onSaved }: { open: boolean; onOpenChange: (o: boolean) => void; job: Job | null; onSaved: () => void }) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: "", description: "", location: "", employment_type: "", skills_required: "", is_active: true },
    values: job ? {
      title: job.title ?? "",
      description: job.description ?? "",
      location: job.location ?? "",
      employment_type: job.employment_type ?? "",
      skills_required: job.skills_required ?? "",
      is_active: job.is_active !== false,
    } : undefined,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (v: JobFormValues) => job ? jobsService.update(job.id, v) : jobsService.create(v),
    onSuccess: () => { toast.success(job ? "Job updated" : "Job created"); onSaved(); form.reset(); },
    onError: (e) => toast.error(extractApiError(e)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job ? "Edit job" : "New job"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Senior Backend Engineer" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={6} placeholder="Role overview, responsibilities…" {...form.register("description")} />
            {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Location</Label><Input {...form.register("location")} /></div>
            <div className="space-y-2"><Label>Employment type</Label><Input placeholder="Full-time, Contract…" {...form.register("employment_type")} /></div>
          </div>
          <div className="space-y-2">
            <Label>Skills required (comma separated)</Label>
            <Input placeholder="Python, Django, PostgreSQL" {...form.register("skills_required")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {job ? "Save changes" : "Create job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

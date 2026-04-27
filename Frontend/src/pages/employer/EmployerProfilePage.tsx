import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { employerService, type EmployerProfile } from "@/services/profiles";
import { extractApiError } from "@/services/api";

const schema = z.object({
  company_name: z.string().trim().max(200).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  size: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  about: z.string().trim().max(2000).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export default function EmployerProfilePage() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["employer", "profile"],
    queryFn: employerService.getMyProfile,
  });

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {} });

  useEffect(() => {
    if (profile) {
      form.reset({
        company_name: (profile.company_name as string) ?? "",
        website: (profile.website as string) ?? "",
        industry: (profile.industry as string) ?? "",
        size: (profile.size as string) ?? "",
        location: (profile.location as string) ?? "",
        about: (profile.about as string) ?? "",
      });
    }
  }, [profile, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: Partial<EmployerProfile> = values;
      if (profile?.id) return employerService.updateProfile(profile.id, payload);
      return employerService.createProfile(payload);
    },
    onSuccess: () => {
      toast.success("Company profile saved");
      qc.invalidateQueries({ queryKey: ["employer", "profile"] });
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  return (
    <>
      <PageHeader title="Company Profile" subtitle="A great profile attracts better candidates." />
      <form onSubmit={form.handleSubmit((v) => mutate(v))} className="rounded-2xl border border-border bg-card p-6 md:p-8 max-w-3xl">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Company name"><Input {...form.register("company_name")} disabled={isLoading} /></Field>
          <Field label="Website"><Input placeholder="https://" {...form.register("website")} disabled={isLoading} /></Field>
          <Field label="Industry"><Input {...form.register("industry")} disabled={isLoading} /></Field>
          <Field label="Company size"><Input placeholder="11-50, 51-200…" {...form.register("size")} disabled={isLoading} /></Field>
          <Field label="Location" full><Input {...form.register("location")} disabled={isLoading} /></Field>
          <Field label="About" full><Textarea rows={5} {...form.register("about")} disabled={isLoading} /></Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isPending || isLoading} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save changes
          </Button>
        </div>
      </form>
    </>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

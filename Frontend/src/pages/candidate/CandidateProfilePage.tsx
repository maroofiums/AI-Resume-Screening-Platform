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
import { candidateService, type CandidateProfile } from "@/services/profiles";
import { extractApiError } from "@/services/api";

const schema = z.object({
  full_name: z.string().trim().max(150).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  headline: z.string().trim().max(200).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  skills: z.string().trim().max(1000).optional().or(z.literal("")),
  experience_years: z.number().min(0).max(80).optional(),
});
type FormValues = z.infer<typeof schema>;

export default function CandidateProfilePage() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["candidate", "profile"],
    queryFn: candidateService.getMyProfile,
  });

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {} });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: (profile.full_name as string) ?? "",
        phone: (profile.phone as string) ?? "",
        location: (profile.location as string) ?? "",
        headline: (profile.headline as string) ?? "",
        bio: (profile.bio as string) ?? "",
        skills: (profile.skills as string) ?? "",
        experience_years: (profile.experience_years as number) ?? 0,
      });
    }
  }, [profile, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: Partial<CandidateProfile> = values;
      if (profile?.id) return candidateService.updateProfile(profile.id, payload);
      return candidateService.createProfile(payload);
    },
    onSuccess: () => {
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["candidate", "profile"] });
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  return (
    <>
      <PageHeader title="My Profile" subtitle="Tell employers about yourself - better profile, better matches." />
      <form onSubmit={form.handleSubmit((v) => mutate(v))} className="rounded-2xl border border-border bg-card p-6 md:p-8 max-w-3xl">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name"><Input {...form.register("full_name")} disabled={isLoading} /></Field>
          <Field label="Phone"><Input {...form.register("phone")} disabled={isLoading} /></Field>
          <Field label="Location"><Input placeholder="City, Country" {...form.register("location")} disabled={isLoading} /></Field>
          <Field label="Years of experience"><Input type="number" min={0} {...form.register("experience_years", { valueAsNumber: true })} disabled={isLoading} /></Field>
          <Field label="Headline" full><Input placeholder="Senior Backend Engineer specializing in distributed systems" {...form.register("headline")} disabled={isLoading} /></Field>
          <Field label="Skills (comma separated)" full><Input placeholder="Python, Django, PostgreSQL, Redis" {...form.register("skills")} disabled={isLoading} /></Field>
          <Field label="Bio" full><Textarea rows={5} placeholder="A short bio for employers…" {...form.register("bio")} disabled={isLoading} /></Field>
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, Loader2, User } from "lucide-react";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";
import { extractApiError } from "@/services/api";
import { cn } from "@/lib/utils";

const schema = z.object({
  username: z.string().trim().min(3, "Min 3 characters").max(150),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(128),
  role: z.enum(["candidate", "employer"]),
});
type FormValues = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", email: "", password: "", role: "candidate" },
  });
  const role = form.watch("role");

  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Account created - please sign in.");
      navigate("/login", { replace: true });
    },
    onError: (err) => toast.error(extractApiError(err, "Registration failed")),
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start screening resumes with AI in minutes."
      footer={<>Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></>}
    >
      <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
        <div className="space-y-2">
          <Label>I am a</Label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: "candidate", label: "Candidate", icon: User },
              { value: "employer", label: "Employer", icon: Briefcase },
            ] as const).map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => form.setValue("role", opt.value, { shouldValidate: true })}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all",
                  role === opt.value
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="username" {...form.register("username")} />
          {form.formState.errors.username && <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isPending} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}

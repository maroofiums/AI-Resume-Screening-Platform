import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { extractApiError } from "@/services/api";

const schema = z.object({
  username: z.string().trim().min(1, "Username is required").max(150),
  password: z.string().min(1, "Password is required").max(128),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { username: "", password: "" } });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const user = data.user;
      if (!user) {
        toast.error("Login response missing user info.");
        return;
      }
      setSession({ user, access: data.access, refresh: data.refresh });
      toast.success(`Welcome back, ${user.username}`);
      const from = (location.state as { from?: string } | null)?.from;
      const home = from || (user.role === "candidate" ? "/candidate" : user.role === "employer" ? "/employer" : "/admin");
      navigate(home, { replace: true });
    },
    onError: (err) => toast.error(extractApiError(err, "Invalid credentials")),
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your AetherScreen workspace."
      footer={<>Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link></>}
    >
      <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="username" {...form.register("username")} />
          {form.formState.errors.username && <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
          {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isPending} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}

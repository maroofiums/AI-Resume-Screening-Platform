import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left - form */}
      <div className="flex flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </header>
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>}
          </div>
        </main>
        <footer className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">← Back to home</Link>
        </footer>
      </div>

      {/* Right - visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 hero-glow opacity-60" />
        <div className="relative flex flex-col justify-center px-16 text-primary-foreground">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium border border-white/20">
              ✦ Semantic AI Screening
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight">Hire the right people in a fraction of the time.</h2>
            <p className="mt-4 text-primary-foreground/85 text-lg">Score, screen and shortlist with confidence. Trusted by modern hiring teams.</p>
            <div className="mt-10 grid gap-3">
              {["Semantic resume scoring", "Real-time funnel analytics", "Drag-and-drop resume uploads"].map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur border border-white/15 p-4">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

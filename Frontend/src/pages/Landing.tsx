import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileSearch,
  Gauge,
  LineChart,
  Shield,
  Sparkles,
  Star,
  Upload,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/auth";

const features = [
  { icon: Brain, title: "Semantic AI Matching", desc: "Goes beyond keywords - understands skills, context and intent for precision shortlisting." },
  { icon: Gauge, title: "Instant Screening Scores", desc: "Every applicant scored in seconds against your job requirements." },
  { icon: FileSearch, title: "Resume Intelligence", desc: "Parses PDF/DOCX, extracts skills, experience, and signals automatically." },
  { icon: LineChart, title: "Hiring Funnel Analytics", desc: "Track applied → screened → shortlisted with beautiful real-time dashboards." },
  { icon: Shield, title: "Bias-Aware Scoring", desc: "Configurable thresholds and transparent scoring you can trust." },
  { icon: Users, title: "Built for Teams", desc: "Roles for candidates, employers, and admins with secure JWT auth." },
];

const tiers = [
  { name: "Starter", price: "$0", period: "/forever", desc: "For individual recruiters getting started.", features: ["Up to 50 applicants/mo", "5 active jobs", "Basic screening", "Email support"], cta: "Get started", highlight: false },
  { name: "Growth", price: "$49", period: "/month", desc: "For growing teams that hire constantly.", features: ["Unlimited applicants", "Unlimited jobs", "Advanced AI scoring", "Funnel analytics", "Priority support"], cta: "Start free trial", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For large organizations with custom needs.", features: ["SSO + audit logs", "Custom AI thresholds", "Dedicated success manager", "SLA & onboarding"], cta: "Contact sales", highlight: false },
];

const testimonials = [
  { quote: "We cut time-to-shortlist by 80%. AetherScreen surfaces the right candidates instantly.", name: "Priya Mehta", role: "Head of Talent, Northwind" },
  { quote: "Finally an ATS that understands resumes the way a human recruiter would.", name: "Daniel Cole", role: "Recruiter, Vellum Labs" },
  { quote: "The funnel analytics alone paid for the subscription in the first week.", name: "Aisha Rahman", role: "VP People, Quanta" },
];

export default function Landing() {
  const user = useAuthStore((s) => s.user);
  const homeForRole = user?.role === "candidate" ? "/candidate" : user?.role === "employer" ? "/employer" : user?.role === "admin" ? "/admin" : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass-strong">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Customers</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {homeForRole ? (
              <Button asChild size="sm"><Link to={homeForRole}>Dashboard</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
                <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"><Link to="/register">Get started</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="container relative pt-24 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Semantic AI screening - now in public beta
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-4xl mx-auto"
          >
            AI Resume Screening for{" "}
            <span className="gradient-hero-text">Modern Hiring</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Score, screen and shortlist resumes in seconds. Built for recruiters who refuse to drown in PDFs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-7 text-base">
              <Link to="/register">Get started free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base">
              <Link to="/login">Sign in</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20 mx-auto max-w-5xl"
          >
            <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
                <div className="ml-3 text-xs text-muted-foreground font-mono">aetherscreen.app/employer</div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 p-6">
                {[
                  { label: "Applicants", value: "1,284", trend: "+12%" },
                  { label: "Shortlisted", value: "186", trend: "+24%" },
                  { label: "Avg Score", value: "78.4", trend: "+3.1" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-4 bg-background/50">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <div className="text-2xl font-bold">{s.value}</div>
                      <div className="text-xs text-success">{s.trend}</div>
                    </div>
                  </div>
                ))}
                <div className="md:col-span-3 rounded-xl border border-border p-6 bg-background/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium">Hiring funnel</div>
                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                  <div className="flex items-end gap-3 h-32">
                    {[80, 62, 44, 28, 14].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-lg bg-gradient-primary opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border">
        <div className="container">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-primary mb-3">Features</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Everything you need to hire smarter.</h2>
            <p className="mt-4 text-muted-foreground text-lg">Purpose-built primitives for high-velocity hiring teams.</p>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg-soft transition-shadow"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-border bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-sm font-medium text-primary mb-3">How it works</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Three steps to your shortlist.</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: "1. Upload", desc: "Candidates upload resumes. Employers post jobs." },
              { icon: Brain, title: "2. Screen", desc: "Our AI scores each applicant against the role." },
              { icon: CheckCircle2, title: "3. Shortlist", desc: "Filter, review, shortlist or reject in one click." },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-8">
                <s.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-xl">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-border">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-sm font-medium text-primary mb-3">Pricing</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Simple plans that scale with you.</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative rounded-2xl border p-8 ${
                  t.highlight
                    ? "border-primary/50 bg-gradient-to-b from-primary/5 to-transparent shadow-elegant"
                    : "border-border bg-card"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-glow">
                    Most popular
                  </div>
                )}
                <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
                <div className="mt-2 flex items-baseline">
                  <span className="font-display text-4xl font-bold">{t.price}</span>
                  <span className="ml-1 text-muted-foreground text-sm">{t.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                <Button asChild className={`mt-6 w-full ${t.highlight ? "bg-gradient-primary text-primary-foreground hover:opacity-90" : ""}`} variant={t.highlight ? "default" : "outline"}>
                  <Link to="/register">{t.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-border bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-sm font-medium text-primary mb-3">Loved by hiring teams</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Built for recruiters who ship.</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6">
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-16 text-center shadow-elegant">
            <div className="absolute inset-0 hero-glow opacity-50" />
            <h2 className="relative font-display text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">Ready to hire smarter?</h2>
            <p className="relative mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">Start screening resumes with AI in under two minutes.</p>
            <Button asChild size="lg" variant="secondary" className="relative mt-8 h-12 px-7 text-base">
              <Link to="/register">Create your free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Logo /></div>
          <div>© {new Date().getFullYear()} AetherScreen. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

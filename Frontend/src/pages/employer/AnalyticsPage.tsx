import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { analyticsService, type FunnelMetrics, type JobStat } from "@/services/analytics";
import { extractApiError } from "@/services/api";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--destructive))"];

export default function AnalyticsPage() {
  const [threshold, setThreshold] = useState(60);
  const [exporting, setExporting] = useState(false);

  const funnelQ = useQuery({ queryKey: ["analytics", "funnel"], queryFn: analyticsService.funnel });
  const jobsQ = useQuery({ queryKey: ["analytics", "jobs"], queryFn: analyticsService.jobStats });
  const thresholdQ = useQuery({
    queryKey: ["analytics", "threshold", threshold],
    queryFn: () => analyticsService.thresholdFilter(threshold),
  });

  const funnelData = useMemo(() => {
    const f: FunnelMetrics = funnelQ.data ?? {};
    return [
      { stage: "Applied", value: Number(f.applied ?? 0) },
      { stage: "Screened", value: Number(f.screened ?? 0) },
      { stage: "Shortlisted", value: Number(f.shortlisted ?? 0) },
      { stage: "Rejected", value: Number(f.rejected ?? 0) },
    ];
  }, [funnelQ.data]);

  const jobData: JobStat[] = jobsQ.data ?? [];
  const totals = funnelData.reduce((s, x) => s + x.value, 0);
  const shortlistRatio = totals ? ((funnelData.find((d) => d.stage === "Shortlisted")?.value ?? 0) / totals) * 100 : 0;

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await analyticsService.exportApplicants();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applicants-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch (e) {
      toast.error(extractApiError(e, "Export failed"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Insights into your hiring funnel and applicant pipeline."
        actions={
          <Button onClick={handleExport} disabled={exporting} variant="outline">
            {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Hiring funnel" loading={funnelQ.isLoading}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {funnelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Shortlist ratio" loading={funnelQ.isLoading}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: "Shortlisted", value: shortlistRatio },
                  { name: "Other", value: 100 - shortlistRatio },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                strokeWidth={0}
              >
                <Cell fill="hsl(var(--primary))" />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
              <Legend verticalAlign="bottom" />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-44 pointer-events-none">
            <div className="font-display text-3xl font-bold">{shortlistRatio.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Shortlisted</div>
          </div>
          <div className="h-32" />
        </ChartCard>

        <ChartCard title="Applications per job" loading={jobsQ.isLoading} className="lg:col-span-2">
          {jobData.length === 0 ? (
            <div className="text-sm text-muted-foreground py-12 text-center">No job data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={jobData} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="job_title" stroke="hsl(var(--muted-foreground))" fontSize={12} width={140} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                <Bar dataKey="shortlisted" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Score threshold filter" loading={false} className="lg:col-span-2">
          <div className="px-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">Show applicants scoring at least</div>
              <div className="font-mono font-semibold">{threshold}</div>
            </div>
            <Slider value={[threshold]} min={0} max={100} step={1} onValueChange={([v]) => setThreshold(v)} />
            <div className="mt-6 rounded-xl bg-muted/40 p-4 text-sm">
              {thresholdQ.isLoading ? "Loading…" : (
                <pre className="text-xs font-mono whitespace-pre-wrap break-all text-muted-foreground">
                  {JSON.stringify(thresholdQ.data ?? {}, null, 2).slice(0, 600)}
                </pre>
              )}
            </div>
          </div>
        </ChartCard>
      </div>
    </>
  );
}

function ChartCard({ title, loading, children, className = "" }: { title: string; loading: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 ${className}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      {loading ? <Skeleton className="h-64 w-full" /> : children}
    </div>
  );
}

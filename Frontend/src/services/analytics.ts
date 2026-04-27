import { api } from "./api";

export interface FunnelMetrics {
  applied?: number;
  screened?: number;
  shortlisted?: number;
  rejected?: number;
  [key: string]: unknown;
}

export interface JobStat {
  job_id?: number;
  job_title?: string;
  applications?: number;
  shortlisted?: number;
  [key: string]: unknown;
}

export const analyticsService = {
  async funnel() {
    const { data } = await api.get<FunnelMetrics>("/api/analytics/funnel_metrics/");
    return data;
  },
  async jobStats() {
    const { data } = await api.get<JobStat[]>("/api/analytics/job_stats/");
    return data;
  },
  async thresholdFilter(threshold: number) {
    const { data } = await api.get("/api/analytics/threshold_filter/", { params: { threshold } });
    return data;
  },
  async exportApplicants() {
    const res = await api.get("/api/analytics/export_applicants/", { responseType: "blob" });
    return res.data as Blob;
  },
};

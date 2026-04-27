import { api } from "./api";
import type { ApplicationStatus } from "@/utils/config";
import type { Paginated } from "./jobs";

export interface Application {
  id: number;
  job: number;
  job_title?: string;
  candidate?: number;
  candidate_name?: string;
  status: ApplicationStatus;
  score?: number | null;
  applied_at?: string;
  resume_url?: string | null;
  [key: string]: unknown;
}

export const applicationsService = {
  async list(params: Record<string, unknown> = {}) {
    const { data } = await api.get<Paginated<Application> | Application[]>("/api/applications/", { params });
    if (Array.isArray(data)) return { count: data.length, next: null, previous: null, results: data };
    return data;
  },
  async get(id: number) {
    const { data } = await api.get<Application>(`/api/applications/${id}/`);
    return data;
  },
  async apply(jobId: number) {
    const { data } = await api.post<Application>("/api/applications/", { job: jobId });
    return data;
  },
  async update(id: number, payload: Partial<Application>) {
    const { data } = await api.patch<Application>(`/api/applications/${id}/`, payload);
    return data;
  },
  async remove(id: number) {
    await api.delete(`/api/applications/${id}/`);
  },
};

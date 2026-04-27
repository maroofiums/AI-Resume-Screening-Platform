import { api } from "./api";

export interface Job {
  id: number;
  title: string;
  description: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  skills_required?: string;
  is_active?: boolean;
  created_at?: string;
  employer?: number;
  company_name?: string;
  [key: string]: unknown;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ListJobsParams {
  search?: string;
  ordering?: string;
  page?: number;
  location?: string;
}

export const jobsService = {
  async list(params: ListJobsParams = {}) {
    const { data } = await api.get<Paginated<Job> | Job[]>("/api/jobs/", { params });
    if (Array.isArray(data)) return { count: data.length, next: null, previous: null, results: data };
    return data;
  },
  async get(id: number) {
    const { data } = await api.get<Job>(`/api/jobs/${id}/`);
    return data;
  },
  async create(payload: Partial<Job>) {
    const { data } = await api.post<Job>("/api/jobs/", payload);
    return data;
  },
  async update(id: number, payload: Partial<Job>) {
    const { data } = await api.patch<Job>(`/api/jobs/${id}/`, payload);
    return data;
  },
  async remove(id: number) {
    await api.delete(`/api/jobs/${id}/`);
  },
};

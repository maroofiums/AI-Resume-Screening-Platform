import { api } from "./api";

export interface CandidateProfile {
  id?: number;
  user?: number;
  full_name?: string;
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills?: string;
  experience_years?: number;
  resume_url?: string | null;
  [key: string]: unknown;
}

export const candidateService = {
  async getMyProfile() {
    const { data } = await api.get<CandidateProfile | CandidateProfile[]>("/api/candidates/profile/");
    return Array.isArray(data) ? data[0] : data;
  },
  async createProfile(payload: Partial<CandidateProfile>) {
    const { data } = await api.post<CandidateProfile>("/api/candidates/profile/", payload);
    return data;
  },
  async updateProfile(id: number, payload: Partial<CandidateProfile>) {
    const { data } = await api.patch<CandidateProfile>(`/api/candidates/profile/${id}/`, payload);
    return data;
  },
  async uploadResume(file: File, onProgress?: (pct: number) => void) {
    const fd = new FormData();
    fd.append("resume", file);
    const { data } = await api.post("/api/candidates/resume/upload/", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (e.total && onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    return data;
  },
};

export interface EmployerProfile {
  id?: number;
  user?: number;
  company_name?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  about?: string;
  [key: string]: unknown;
}

export const employerService = {
  async getMyProfile() {
    const { data } = await api.get<EmployerProfile | EmployerProfile[]>("/api/employers/profile/");
    return Array.isArray(data) ? data[0] : data;
  },
  async createProfile(payload: Partial<EmployerProfile>) {
    const { data } = await api.post<EmployerProfile>("/api/employers/profile/", payload);
    return data;
  },
  async updateProfile(id: number, payload: Partial<EmployerProfile>) {
    const { data } = await api.patch<EmployerProfile>(`/api/employers/profile/${id}/`, payload);
    return data;
  },
};

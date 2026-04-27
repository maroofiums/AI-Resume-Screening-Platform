// API base URL - configurable via Vite env var, defaults to local Django backend.
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

export const STORAGE_KEYS = {
  accessToken: "aether.access",
  refreshToken: "aether.refresh",
  user: "aether.user",
  theme: "aether.theme",
} as const;

export type Role = "candidate" | "employer" | "admin";

export const APPLICATION_STATUSES = ["applied", "screened", "shortlisted", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

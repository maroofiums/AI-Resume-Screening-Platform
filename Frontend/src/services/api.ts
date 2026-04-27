import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "@/utils/config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem(STORAGE_KEYS.refreshToken);
  if (!refresh) return null;
  try {
    // SimpleJWT default endpoint; backend may use /api/users/login/refresh/ - try common paths.
    const { data } = await axios.post(`${API_BASE_URL}/api/token/refresh/`, { refresh });
    const access = data?.access ?? null;
    if (access) localStorage.setItem(STORAGE_KEYS.accessToken, access);
    return access;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (!refreshPromise) refreshPromise = refreshAccessToken().finally(() => (refreshPromise = null));
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${newToken}` };
        return api(original);
      }
      // Refresh failed - clear auth and bounce to login
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.user);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function extractApiError(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      // DRF returns { detail: "..." } or field-keyed errors
      const obj = data as Record<string, unknown>;
      if (typeof obj.detail === "string") return obj.detail;
      const firstKey = Object.keys(obj)[0];
      if (firstKey) {
        const v = obj[firstKey];
        if (Array.isArray(v) && v.length) return `${firstKey}: ${v[0]}`;
        if (typeof v === "string") return `${firstKey}: ${v}`;
      }
    }
    return err.message || fallback;
  }
  return fallback;
}

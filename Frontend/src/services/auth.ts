import { api } from "./api";
import type { Role } from "@/utils/config";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: AuthUser;
}

export const authService = {
  async login(payload: { username: string; password: string }) {
    const { data } = await api.post<LoginResponse>("/api/users/login/", payload);
    return data;
  },
  async register(payload: { username: string; email: string; password: string; role: Role }) {
    const { data } = await api.post<AuthUser>("/api/users/register/", payload);
    return data;
  },
};

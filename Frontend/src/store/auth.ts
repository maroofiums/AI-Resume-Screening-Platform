import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, type Role } from "@/utils/config";
import type { AuthUser } from "@/services/auth";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (s: { user: AuthUser; access: string; refresh: string }) => void;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ user, access, refresh }) => {
        localStorage.setItem(STORAGE_KEYS.accessToken, access);
        localStorage.setItem(STORAGE_KEYS.refreshToken, refresh);
        set({ user, accessToken: access, refreshToken: refresh });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.accessToken);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        localStorage.removeItem(STORAGE_KEYS.user);
        set({ user: null, accessToken: null, refreshToken: null });
      },
      hasRole: (role) => {
        const u = get().user;
        if (!u) return false;
        return Array.isArray(role) ? role.includes(u.role) : u.role === role;
      },
    }),
    { name: STORAGE_KEYS.user }
  )
);

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import type { Role } from "@/utils/config";

interface Props {
  roles?: Role[];
  children: React.ReactNode;
}

export function ProtectedRoute({ roles, children }: Props) {
  const location = useLocation();
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    // Authenticated but wrong role - send to their proper home
    const home =
      user.role === "candidate" ? "/candidate" : user.role === "employer" ? "/employer" : "/admin";
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}

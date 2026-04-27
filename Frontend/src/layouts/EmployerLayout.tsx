import { Outlet } from "react-router-dom";
import { LayoutDashboard, Building2, Briefcase, Users, BarChart3 } from "lucide-react";
import { DashboardLayout, type NavItem } from "@/layouts/DashboardLayout";

const nav: NavItem[] = [
  { to: "/employer", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/employer/profile", label: "Company Profile", icon: Building2 },
  { to: "/employer/jobs", label: "Jobs", icon: Briefcase },
  { to: "/employer/applicants", label: "Applicants", icon: Users },
  { to: "/employer/analytics", label: "Analytics", icon: BarChart3 },
];

export default function EmployerLayout() {
  return (
    <DashboardLayout nav={nav}>
      <Outlet />
    </DashboardLayout>
  );
}

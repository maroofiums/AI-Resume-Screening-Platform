import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, Activity } from "lucide-react";
import { DashboardLayout, type NavItem } from "@/layouts/DashboardLayout";

const nav: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/activity", label: "Activity", icon: Activity },
];

export default function AdminLayout() {
  return (
    <DashboardLayout nav={nav}>
      <Outlet />
    </DashboardLayout>
  );
}

import { Outlet } from "react-router-dom";
import { LayoutDashboard, User, UploadCloud, Search, FileText } from "lucide-react";
import { DashboardLayout, type NavItem } from "@/layouts/DashboardLayout";

const nav: NavItem[] = [
  { to: "/candidate", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/candidate/profile", label: "My Profile", icon: User },
  { to: "/candidate/resume", label: "Upload Resume", icon: UploadCloud },
  { to: "/candidate/jobs", label: "Browse Jobs", icon: Search },
  { to: "/candidate/applications", label: "My Applications", icon: FileText },
];

export default function CandidateLayout() {
  return (
    <DashboardLayout nav={nav}>
      <Outlet />
    </DashboardLayout>
  );
}

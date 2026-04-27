import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import CandidateLayout from "./layouts/CandidateLayout";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfilePage from "./pages/candidate/CandidateProfilePage";
import UploadResumePage from "./pages/candidate/UploadResumePage";
import BrowseJobsPage from "./pages/candidate/BrowseJobsPage";
import MyApplicationsPage from "./pages/candidate/MyApplicationsPage";

import EmployerLayout from "./layouts/EmployerLayout";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerProfilePage from "./pages/employer/EmployerProfilePage";
import JobsManagementPage from "./pages/employer/JobsManagementPage";
import ApplicantsPage from "./pages/employer/ApplicantsPage";
import AnalyticsPage from "./pages/employer/AnalyticsPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminActivity from "./pages/admin/AdminActivity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner richColors closeButton position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/candidate"
              element={
                <ProtectedRoute roles={["candidate"]}>
                  <CandidateLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CandidateDashboard />} />
              <Route path="profile" element={<CandidateProfilePage />} />
              <Route path="resume" element={<UploadResumePage />} />
              <Route path="jobs" element={<BrowseJobsPage />} />
              <Route path="applications" element={<MyApplicationsPage />} />
            </Route>

            <Route
              path="/employer"
              element={
                <ProtectedRoute roles={["employer"]}>
                  <EmployerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployerDashboard />} />
              <Route path="profile" element={<EmployerProfilePage />} />
              <Route path="jobs" element={<JobsManagementPage />} />
              <Route path="applicants" element={<ApplicantsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="activity" element={<AdminActivity />} />
            </Route>

            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

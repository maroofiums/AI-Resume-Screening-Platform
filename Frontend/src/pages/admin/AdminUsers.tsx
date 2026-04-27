import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Users } from "lucide-react";

export default function AdminUsers() {
  return (
    <>
      <PageHeader title="Users" subtitle="Manage platform users." />
      <div className="rounded-2xl border border-border bg-card">
        <EmptyState
          icon={Users}
          title="User management"
          description="No public /api/users/ list endpoint detected. Connect your admin endpoint to populate this view."
        />
      </div>
    </>
  );
}

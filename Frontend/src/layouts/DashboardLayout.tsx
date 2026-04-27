import { ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface Props {
  nav: NavItem[];
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ nav, children }: Props) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 glass-strong border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 lg:top-0 z-30 h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar transition-transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="hidden lg:flex h-16 items-center px-6 border-b border-sidebar-border">
            <Logo />
          </div>
          <nav className="px-3 py-4 space-y-0.5">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="absolute inset-x-0 bottom-0 border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {user?.username?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.username}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 lg:pl-0">
          <header className="hidden lg:flex sticky top-0 z-20 h-16 items-center justify-end gap-2 px-8 glass-strong border-b border-border">
            <ThemeToggle />
          </header>
          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-fade-in">{children}</main>
        </div>
      </div>
    </div>
  );
}

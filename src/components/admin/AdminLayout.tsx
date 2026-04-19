import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  Store,
  Bike,
  UserSquare,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/restaurants" as const, label: "Restaurants", icon: Store },
  { to: "/admin/riders" as const, label: "Riders", icon: Bike },
  { to: "/admin/posts" as const, label: "Posts", icon: FileText },
  { to: "/admin/authors" as const, label: "Authors", icon: Users },
  { to: "/admin/team" as const, label: "Team", icon: UserSquare },
  { to: "/admin/comments" as const, label: "Comments", icon: MessageSquare },
  { to: "/admin/settings" as const, label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  const initials = user?.email?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Link to="/admin" className="font-display font-extrabold text-base">
          Zaaou Admin
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Backdrop on mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-border flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to="/" className="font-display font-extrabold text-lg block truncate">
              Zaaou Admin
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden h-8 w-8 grid place-items-center rounded-lg hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              activeOptions={item.exact ? { exact: true } : undefined}
              activeProps={{
                className: "bg-primary/10 text-primary font-semibold",
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" /> View site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto p-5 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

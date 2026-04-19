import { type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Users, MessageSquare, Settings, LogOut, Home } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts" as const, label: "Posts", icon: FileText },
  { to: "/admin/authors" as const, label: "Authors", icon: Users },
  { to: "/admin/comments" as const, label: "Comments", icon: MessageSquare },
  { to: "/admin/settings" as const, label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-60 shrink-0 bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <Link to="/" className="font-display font-extrabold text-lg">
            Zaaou Admin
          </Link>
          <p className="text-xs text-muted-foreground truncate mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.exact ? { exact: true } : undefined}
              activeProps={{ className: "bg-primary/10 text-primary" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
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
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

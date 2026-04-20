import { type ReactNode, useEffect, useState } from "react";
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
  Mail,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ProfileMenu } from "./ProfileMenu";
import logo from "@/assets/zaaou-logo.png";

type NavItem = {
  to:
    | "/admin"
    | "/admin/restaurants"
    | "/admin/riders"
    | "/admin/posts"
    | "/admin/authors"
    | "/admin/team"
    | "/admin/reviews"
    | "/admin/comments"
    | "/admin/subscribers"
    | "/admin/settings";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  group: "Overview" | "Operations" | "Content" | "Audience" | "System";
};

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, group: "Overview" },
  { to: "/admin/restaurants", label: "Restaurants", icon: Store, group: "Operations" },
  { to: "/admin/riders", label: "Riders", icon: Bike, group: "Operations" },
  { to: "/admin/posts", label: "Posts", icon: FileText, group: "Content" },
  { to: "/admin/authors", label: "Authors", icon: Users, group: "Content" },
  { to: "/admin/team", label: "Team", icon: UserSquare, group: "Content" },
  { to: "/admin/reviews", label: "Reviews", icon: Star, group: "Content" },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare, group: "Content" },
  { to: "/admin/subscribers", label: "Newsletter", icon: Mail, group: "Audience" },
  { to: "/admin/settings", label: "Settings", icon: Settings, group: "System" },
];

const groupOrder: NavItem["group"][] = ["Overview", "Operations", "Content", "Audience", "System"];
const STORAGE_KEY = "zaaou-admin-sidebar-collapsed";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  const initials = user?.email?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="" className="h-7 w-7 rounded-md flex-shrink-0" />
          <span className="font-display font-extrabold text-base truncate">
            Zaaou Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar:
          - Mobile: fixed off-canvas drawer (translate)
          - Desktop: in-flow sticky column with animated width */}
      <aside
        className={[
          "z-50 bg-card border-r border-border flex flex-col",
          // mobile drawer
          "fixed top-0 left-0 h-screen w-72 transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // desktop in-flow sticky
          "lg:static lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0",
          "lg:transition-[width] lg:duration-300 lg:ease-out",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
        ].join(" ")}
      >
        {/* Header / Brand */}
        <div className="relative h-16 px-3 border-b border-border flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 min-w-0 flex-1 group rounded-lg p-1.5 hover:bg-muted transition-colors"
            title="View site"
          >
            <div className="relative h-9 w-9 rounded-lg bg-gradient-primary p-[2px] shadow-soft flex-shrink-0">
              <div className="h-full w-full rounded-[6px] bg-card grid place-items-center overflow-hidden">
                <img src={logo} alt="" className="h-6 w-6 rounded" />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="font-display font-extrabold text-[15px] truncate">
                  Zaaou <span className="text-primary">Admin</span>
                </p>
                <p className="text-[9px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
                  Control Center
                </p>
              </div>
            )}
          </Link>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden h-8 w-8 grid place-items-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Floating collapse toggle (desktop only) */}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:grid absolute -right-3 top-12 h-6 w-6 place-items-center rounded-full bg-card border border-border shadow-soft hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-visible">
          {groupOrder.map((group) => {
            const items = nav.filter((i) => i.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mb-5 last:mb-0">
                {!collapsed ? (
                  <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
                    {group}
                  </p>
                ) : (
                  <div className="mx-2 mb-2 h-px bg-border" aria-hidden />
                )}
                <ul className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.to} className="relative group/item">
                        <Link
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          activeOptions={item.exact ? { exact: true } : undefined}
                          activeProps={{
                            className:
                              "bg-primary/10 text-primary font-semibold border-primary/30",
                          }}
                          title={collapsed ? item.label : undefined}
                          className={[
                            "flex items-center rounded-lg text-sm font-medium",
                            "text-foreground/70 hover:bg-muted hover:text-foreground",
                            "border border-transparent transition-colors",
                            collapsed
                              ? "justify-center h-11 w-11 mx-auto"
                              : "gap-3 px-3 py-2.5",
                          ].join(" ")}
                        >
                          <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </Link>

                        {/* Tooltip on hover (collapsed only) */}
                        {collapsed && (
                          <span className="hidden lg:block pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity shadow-card z-[60]">
                            {item.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Footer: profile card */}
        <div className="p-3 border-t border-border bg-muted/40">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
              <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-soft flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.email?.split("@")[0] ?? "Admin"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-soft">
                {initials}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col">
        {/* Desktop top bar with profile menu */}
        <div className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-end gap-3 px-6 lg:px-10 bg-background/80 backdrop-blur-md border-b border-border">
          <ProfileMenu />
        </div>
        {/* Mobile top-right profile (sits inside the existing mobile header) */}
        <div className="lg:hidden fixed top-2 right-14 z-50">
          <ProfileMenu />
        </div>
        <div className="flex-1 max-w-6xl w-full mx-auto p-5 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

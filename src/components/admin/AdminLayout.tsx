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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/zaaou-logo.png";

type NavItem = {
  to: "/admin" | "/admin/restaurants" | "/admin/riders" | "/admin/posts" | "/admin/authors" | "/admin/team" | "/admin/comments" | "/admin/settings";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  group: "Overview" | "Operations" | "Content" | "System";
};

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, group: "Overview" },
  { to: "/admin/restaurants", label: "Restaurants", icon: Store, group: "Operations" },
  { to: "/admin/riders", label: "Riders", icon: Bike, group: "Operations" },
  { to: "/admin/posts", label: "Posts", icon: FileText, group: "Content" },
  { to: "/admin/authors", label: "Authors", icon: Users, group: "Content" },
  { to: "/admin/team", label: "Team", icon: UserSquare, group: "Content" },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare, group: "Content" },
  { to: "/admin/settings", label: "Settings", icon: Settings, group: "System" },
];

const groupOrder: NavItem["group"][] = ["Overview", "Operations", "Content", "System"];

const STORAGE_KEY = "zaaou-admin-sidebar-collapsed";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Load persisted collapsed state
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
  const sidebarWidth = collapsed ? "lg:w-[76px]" : "lg:w-64";

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/40 via-background to-muted/30 flex">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-card/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-7 w-7 rounded-md" />
          <span className="font-display font-extrabold text-base">Zaaou Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Backdrop on mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 ${sidebarWidth} shrink-0 flex flex-col transition-all duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar surface with subtle gradient & border */}
        <div className="relative flex-1 flex flex-col bg-card/95 backdrop-blur-xl border-r border-border shadow-card overflow-hidden">
          {/* Decorative top glow */}
          <div
            aria-hidden
            className="absolute -top-24 -left-12 h-56 w-56 rounded-full bg-primary/15 blur-3xl pointer-events-none"
          />

          {/* Header / Brand */}
          <div className="relative p-4 border-b border-border/70 flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 min-w-0 flex-1 group"
              title="View site"
            >
              <div className="relative h-10 w-10 rounded-xl bg-gradient-primary p-[2px] shadow-soft flex-shrink-0 group-hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-[10px] bg-card grid place-items-center overflow-hidden">
                  <img src={logo} alt="" className="h-7 w-7 rounded-md" />
                </div>
              </div>
              {!collapsed && (
                <div className="min-w-0 leading-tight">
                  <p className="font-display font-extrabold text-base truncate">
                    Zaaou <span className="text-primary">Admin</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
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

            {/* Desktop collapse toggle */}
            <button
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:grid absolute -right-3 top-7 h-6 w-6 place-items-center rounded-full bg-card border border-border shadow-soft hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10"
            >
              {collapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="relative flex-1 p-3 overflow-y-auto overflow-x-hidden">
            {groupOrder.map((group) => {
              const items = nav.filter((i) => i.group === group);
              if (!items.length) return null;
              return (
                <div key={group} className="mb-4 last:mb-0">
                  {!collapsed && (
                    <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
                      {group}
                    </p>
                  )}
                  {collapsed && (
                    <div className="mx-3 mb-2 h-px bg-border/60" aria-hidden />
                  )}
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          activeOptions={item.exact ? { exact: true } : undefined}
                          activeProps={{
                            className:
                              "!bg-gradient-to-r !from-primary/15 !to-primary/5 !text-primary !font-semibold shadow-[inset_2px_0_0_0] shadow-primary",
                          }}
                          title={collapsed ? item.label : undefined}
                          className={`group relative flex items-center ${
                            collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"
                          } rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-all`}
                        >
                          <Icon
                            className={`h-[18px] w-[18px] flex-shrink-0 transition-transform group-hover:scale-110`}
                          />
                          {!collapsed && <span className="truncate">{item.label}</span>}

                          {/* Tooltip when collapsed */}
                          {collapsed && (
                            <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-card z-50">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Pro tip card (only when expanded) */}
          {!collapsed && (
            <div className="px-3 pb-3">
              <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-4 text-primary-foreground shadow-soft">
                <Sparkles className="absolute -right-2 -top-2 h-16 w-16 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                  Quick tip
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug">
                  Add new restaurants to grow your reach.
                </p>
                <Link
                  to="/admin/restaurants"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold underline-offset-2 hover:underline"
                >
                  Go to Restaurants →
                </Link>
              </div>
            </div>
          )}

          {/* Footer: profile + actions */}
          <div className="p-3 border-t border-border/70 space-y-1 bg-muted/30">
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

            <Link
              to="/"
              title={collapsed ? "View site" : undefined}
              className={`group relative flex items-center ${
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
              } rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors`}
            >
              <Home className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>View site</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-card z-50">
                  View site
                </span>
              )}
            </Link>
            <button
              onClick={handleSignOut}
              title={collapsed ? "Sign out" : undefined}
              className={`group relative w-full flex items-center ${
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
              } rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Sign out</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-card z-50">
                  Sign out
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto p-5 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

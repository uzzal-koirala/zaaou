import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  UserCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/zaaou-logo.png";

type NavItem = {
  to: "/author" | "/author/posts" | "/author/comments" | "/author/profile";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/author", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/author/posts", label: "My Posts", icon: FileText },
  { to: "/author/comments", label: "Comments", icon: MessageSquare },
  { to: "/author/profile", label: "Profile", icon: UserCircle },
];

const STORAGE_KEY = "zaaou-author-sidebar-collapsed";

export function AuthorLayout({ children }: { children: ReactNode }) {
  const { author, user, signOut } = useAuth();
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

  const initials = author?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
        <Link to="/author" className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="" className="h-7 w-7 rounded-md flex-shrink-0" />
          <span className="font-display font-extrabold text-base truncate">Author</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "z-50 bg-card border-r border-border flex flex-col",
          "fixed top-0 left-0 h-screen w-72 transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0",
          "lg:transition-[width] lg:duration-300 lg:ease-out",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
        ].join(" ")}
      >
        <div className="relative h-16 px-3 border-b border-border flex items-center gap-2">
          <Link
            to="/author"
            className="flex items-center gap-2.5 min-w-0 flex-1 group rounded-lg p-1.5 hover:bg-muted transition-colors"
          >
            <div className="relative h-9 w-9 rounded-lg bg-gradient-primary p-[2px] shadow-soft flex-shrink-0">
              <div className="h-full w-full rounded-[6px] bg-card grid place-items-center overflow-hidden">
                <img src={logo} alt="" className="h-6 w-6 rounded" />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="font-display font-extrabold text-[15px] truncate">
                  Zaaou <span className="text-primary">Author</span>
                </p>
                <p className="text-[9px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
                  Writer Studio
                </p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden h-8 w-8 grid place-items-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:grid absolute -right-3 top-12 h-6 w-6 place-items-center rounded-full bg-card border border-border shadow-soft hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-visible">
          <ul className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to} className="relative group/item">
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    activeOptions={item.exact ? { exact: true } : undefined}
                    activeProps={{
                      className: "bg-primary/10 text-primary font-semibold border-primary/30",
                    }}
                    title={collapsed ? item.label : undefined}
                    className={[
                      "flex items-center rounded-lg text-sm font-medium",
                      "text-foreground/70 hover:bg-muted hover:text-foreground",
                      "border border-transparent transition-colors",
                      collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5",
                    ].join(" ")}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                  {collapsed && (
                    <span className="hidden lg:block pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity shadow-card z-[60]">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-border bg-muted/40">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
              {author?.avatar_url ? (
                <img src={author.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-soft flex-shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{author?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              {author?.avatar_url ? (
                <img src={author.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-soft">
                  {initials}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col">
        <div className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-end gap-2 px-6 lg:px-10 bg-background/80 backdrop-blur-md border-b border-border">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/70 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-muted"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Visit site
          </a>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/70 hover:text-destructive px-3 py-1.5 rounded-lg hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
        <div className="flex-1 max-w-6xl w-full mx-auto p-5 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

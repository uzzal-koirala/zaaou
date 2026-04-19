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
  PenSquare,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/zaaou-logo.png";

type NavItem = {
  to: "/author" | "/author/posts" | "/author/comments" | "/author/profile";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  section: "main" | "account";
  badgeKey?: "pending";
};

const nav: NavItem[] = [
  { to: "/author", label: "Dashboard", icon: LayoutDashboard, exact: true, section: "main" },
  { to: "/author/posts", label: "My Posts", icon: FileText, section: "main" },
  { to: "/author/comments", label: "Comments", icon: MessageSquare, section: "main", badgeKey: "pending" },
  { to: "/author/profile", label: "Profile", icon: UserCircle, section: "account" },
];

const STORAGE_KEY = "zaaou-author-sidebar-collapsed";

export function AuthorLayout({ children }: { children: ReactNode }) {
  const { author, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  // Pending comments badge
  useEffect(() => {
    if (!author?.id) return;
    let active = true;
    (async () => {
      const { data: posts } = await supabase
        .from("posts")
        .select("id")
        .eq("author_id", author.id);
      const ids = (posts ?? []).map((p) => p.id);
      if (ids.length === 0) {
        if (active) setPendingCount(0);
        return;
      }
      const { count } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .in("post_id", ids)
        .eq("status", "pending");
      if (active) setPendingCount(count ?? 0);
    })();
    return () => {
      active = false;
    };
  }, [author?.id]);

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
  const mainItems = nav.filter((n) => n.section === "main");
  const accountItems = nav.filter((n) => n.section === "account");

  function badgeFor(key?: NavItem["badgeKey"]) {
    if (key === "pending" && pendingCount > 0) return pendingCount;
    return null;
  }

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
          "z-50 bg-gradient-to-b from-card to-card/95 border-r border-border flex flex-col",
          "fixed top-0 left-0 h-screen w-72 transition-transform duration-300 ease-out shadow-xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0 lg:shadow-none",
          "lg:transition-[width] lg:duration-300 lg:ease-out",
          collapsed ? "lg:w-[76px]" : "lg:w-[260px]",
        ].join(" ")}
      >
        {/* Brand */}
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

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:grid absolute -right-3 top-12 h-6 w-6 place-items-center rounded-full bg-card border border-border shadow-soft hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-10"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* Quick action: New post */}
        <div className="px-3 pt-4 pb-2">
          <Link
            to="/author/posts/new"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? "Write new post" : undefined}
            className={[
              "group relative flex items-center rounded-xl shadow-soft",
              "bg-gradient-primary text-primary-foreground font-semibold",
              "hover:shadow-glow hover:-translate-y-0.5 transition-all overflow-hidden",
              collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-2 px-3.5 py-2.5 text-sm justify-center",
            ].join(" ")}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <PenSquare className="h-4 w-4 relative" />
            {!collapsed && <span className="relative">Write new post</span>}
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-visible">
          {/* Main section */}
          {!collapsed && (
            <p className="px-3 mt-2 mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
              Workspace
            </p>
          )}
          {collapsed && <div className="my-3 mx-auto h-px w-8 bg-border" />}

          <ul className="space-y-1">
            {mainItems.map((item) => renderNavItem(item, collapsed, setMobileOpen, badgeFor(item.badgeKey)))}
          </ul>

          {/* Account section */}
          {!collapsed && (
            <p className="px-3 mt-6 mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
              Account
            </p>
          )}
          {collapsed && <div className="my-3 mx-auto h-px w-8 bg-border" />}

          <ul className="space-y-1">
            {accountItems.map((item) => renderNavItem(item, collapsed, setMobileOpen, badgeFor(item.badgeKey)))}
          </ul>

          {/* Tip card (only when expanded) */}
          {!collapsed && (
            <div className="mt-6 mx-1 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-7 w-7 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center shadow-soft">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-bold">Writer's tip</p>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Posts with cover images get up to 3× more reads. Add one before publishing!
              </p>
            </div>
          )}
        </nav>

        {/* User card + actions */}
        <div className="p-3 border-t border-border bg-muted/40">
          {!collapsed ? (
            <>
              <Link
                to="/author/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {author?.avatar_url ? (
                  <img src={author.avatar_url} alt="" className="h-9 w-9 rounded-lg object-cover flex-shrink-0 ring-2 ring-primary/20" />
                ) : (
                  <div className="h-9 w-9 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-soft flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{author?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
              </Link>
              <div className="flex items-center gap-1 mt-2">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-foreground/70 hover:text-primary px-2 py-1.5 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all"
                >
                  <ExternalLink className="h-3 w-3" /> Site
                </a>
                <button
                  onClick={handleSignOut}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-foreground/70 hover:text-destructive px-2 py-1.5 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all"
                >
                  <LogOut className="h-3 w-3" /> Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link to="/author/profile" onClick={() => setMobileOpen(false)} title={author?.name}>
                {author?.avatar_url ? (
                  <img src={author.avatar_url} alt="" className="h-9 w-9 rounded-lg object-cover ring-2 ring-primary/20" />
                ) : (
                  <div className="h-9 w-9 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-soft">
                    {initials}
                  </div>
                )}
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="h-8 w-8 grid place-items-center rounded-lg text-foreground/70 hover:text-destructive hover:bg-card border border-transparent hover:border-border transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col">
        <div className="flex-1 max-w-6xl w-full mx-auto p-5 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

function renderNavItem(
  item: NavItem,
  collapsed: boolean,
  setMobileOpen: (v: boolean) => void,
  badge: number | null,
) {
  const Icon = item.icon;
  return (
    <li key={item.to} className="relative group/item">
      <Link
        to={item.to}
        onClick={() => setMobileOpen(false)}
        activeOptions={item.exact ? { exact: true } : undefined}
        activeProps={{
          className: "bg-primary/10 text-primary font-semibold",
        }}
        title={collapsed ? item.label : undefined}
        className={[
          "flex items-center rounded-lg text-sm font-medium relative",
          "text-foreground/70 hover:bg-muted hover:text-foreground transition-colors",
          collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5",
        ].join(" ")}
      >
        <Icon className="h-[18px] w-[18px] flex-shrink-0" />
        {!collapsed && <span className="truncate flex-1">{item.label}</span>}
        {!collapsed && badge !== null && (
          <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
        {collapsed && badge !== null && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold ring-2 ring-card">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </Link>
      {collapsed && (
        <span className="hidden lg:block pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity shadow-card z-[60]">
          {item.label}
          {badge !== null && <span className="ml-1.5 text-primary-foreground/80">({badge})</span>}
        </span>
      )}
    </li>
  );
}

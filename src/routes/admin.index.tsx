import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  MessageSquare,
  ArrowRight,
  Store,
  Bike,
  Sparkles,
  TrendingUp,
  Plus,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin - Zaaou Food" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </RoleGuard>
  ),
});

type Stats = {
  posts: number;
  drafts: number;
  authors: number;
  pending: number;
  restaurants: number;
  activeRestaurants: number;
  riders: number;
  ridersOnline: number;
};

type RecentPost = { id: string; title: string; status: string; updated_at: string };
type RecentComment = { id: string; name: string; content: string; created_at: string };

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    drafts: 0,
    authors: 0,
    pending: 0,
    restaurants: 0,
    activeRestaurants: 0,
    riders: 0,
    ridersOnline: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);

  useEffect(() => {
    (async () => {
      const [posts, drafts, authors, pending, rest, restActive, riders, ridersOn, rPosts, rComments] =
        await Promise.all([
          supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
          supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
          supabase.from("authors").select("id", { count: "exact", head: true }),
          supabase.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("restaurants").select("id", { count: "exact", head: true }),
          supabase.from("restaurants").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("riders").select("id", { count: "exact", head: true }),
          supabase.from("riders").select("id", { count: "exact", head: true }).eq("status", "online"),
          supabase
            .from("posts")
            .select("id, title, status, updated_at")
            .order("updated_at", { ascending: false })
            .limit(5),
          supabase
            .from("comments")
            .select("id, name, content, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);
      setStats({
        posts: posts.count ?? 0,
        drafts: drafts.count ?? 0,
        authors: authors.count ?? 0,
        pending: pending.count ?? 0,
        restaurants: rest.count ?? 0,
        activeRestaurants: restActive.count ?? 0,
        riders: riders.count ?? 0,
        ridersOnline: ridersOn.count ?? 0,
      });
      setRecentPosts(rPosts.data ?? []);
      setRecentComments(rComments.data ?? []);
    })();
  }, []);

  const cards = [
    {
      label: "Restaurants",
      value: stats.restaurants,
      sub: `${stats.activeRestaurants} active`,
      icon: Store,
      to: "/admin/restaurants" as const,
      gradient: "from-orange-500/15 to-orange-500/5",
      iconColor: "text-orange-500",
    },
    {
      label: "Riders",
      value: stats.riders,
      sub: `${stats.ridersOnline} online`,
      icon: Bike,
      to: "/admin" as const,
      gradient: "from-blue-500/15 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      label: "Published posts",
      value: stats.posts,
      sub: `${stats.drafts} drafts`,
      icon: FileText,
      to: "/admin/posts" as const,
      gradient: "from-primary/15 to-primary/5",
      iconColor: "text-primary",
    },
    {
      label: "Pending comments",
      value: stats.pending,
      sub: stats.pending > 0 ? "Needs review" : "All clear",
      icon: MessageSquare,
      to: "/admin/comments" as const,
      gradient: "from-rose-500/15 to-rose-500/5",
      iconColor: "text-rose-500",
    },
  ];

  const greeting = greetingFor(new Date());
  const adminName = user?.email?.split("@")[0] ?? "Admin";

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            {greeting}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="capitalize">{adminName}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with Zaaou Food today.</p>
        </div>
        <Link
          to="/admin/restaurants/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow self-start sm:self-end"
        >
          <Plus className="h-4 w-4" /> New restaurant
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.gradient} bg-card p-5 shadow-soft hover:shadow-glow transition-all hover:-translate-y-0.5 group`}
          >
            <div className="flex items-start justify-between">
              <div className={`h-10 w-10 rounded-xl bg-card grid place-items-center ${c.iconColor} shadow-soft`}>
                <c.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-4xl font-display font-extrabold mt-4 tabular-nums">{c.value}</p>
            <p className="text-sm font-semibold text-foreground mt-1">{c.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickAction
          to="/admin/restaurants/new"
          title="Add restaurant"
          desc="Onboard a new partner restaurant"
          icon={Store}
          accent="bg-orange-500/10 text-orange-500"
        />
        <QuickAction
          to="/admin/posts/new"
          title="Write a blog post"
          desc="Publish a new article"
          icon={FileText}
          accent="bg-primary/10 text-primary"
        />
        <QuickAction
          to="/admin/comments"
          title="Review comments"
          desc={`${stats.pending} pending approval`}
          icon={MessageSquare}
          accent="bg-rose-500/10 text-rose-500"
        />
      </div>

      {/* Two-column lists */}
      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <Panel title="Recent posts" icon={FileText} cta={{ label: "All posts", to: "/admin/posts" }}>
          {recentPosts.length === 0 ? (
            <EmptyHint text="No posts yet" />
          ) : (
            <ul className="divide-y divide-border">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/admin/posts/$id/edit"
                    params={{ id: p.id }}
                    className="flex items-center justify-between gap-3 py-3 hover:text-primary transition-colors"
                  >
                    <span className="font-medium text-sm truncate">{p.title}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        p.status === "published"
                          ? "bg-primary/10 text-primary"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent comments"
          icon={MessageSquare}
          cta={{ label: "All comments", to: "/admin/comments" }}
        >
          {recentComments.length === 0 ? (
            <EmptyHint text="No comments yet" />
          ) : (
            <ul className="divide-y divide-border">
              {recentComments.map((c) => (
                <li key={c.id} className="py-3">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{c.content}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Link
          to="/admin/authors"
          className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-glow transition-shadow flex items-start gap-4"
        >
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-500 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-base">Manage authors</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {stats.authors} {stats.authors === 1 ? "author" : "authors"} registered
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
        </Link>
        <Link
          to="/admin/team"
          className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-glow transition-shadow flex items-start gap-4"
        >
          <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-base">Edit team page</p>
            <p className="text-sm text-muted-foreground mt-0.5">Update the people behind Zaaou</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
        </Link>
      </div>
    </>
  );
}

function QuickAction({
  to,
  title,
  desc,
  icon: Icon,
  accent,
}: {
  to: "/admin/restaurants/new" | "/admin/posts/new" | "/admin/comments";
  title: string;
  desc: string;
  icon: typeof Store;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center gap-4"
    >
      <div className={`h-11 w-11 rounded-xl ${accent} grid place-items-center`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

function Panel({
  title,
  icon: Icon,
  cta,
  children,
}: {
  title: string;
  icon: typeof FileText;
  cta: { label: string; to: "/admin/posts" | "/admin/comments" };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="font-display font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>
        <Link to={cta.to} className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
          {cta.label} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="py-6 text-center">
      <TrendingUp className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function greetingFor(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

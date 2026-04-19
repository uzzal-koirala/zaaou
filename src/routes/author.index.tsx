import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FileText,
  MessageSquare,
  Eye,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { AuthorGuard } from "@/components/author/AuthorGuard";
import { AuthorLayout } from "@/components/author/AuthorLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/blog-utils";

export const Route = createFileRoute("/author/")({
  head: () => ({ meta: [{ title: "Author dashboard - Zaaou Food" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AuthorGuard>
      <AuthorLayout>
        <Dashboard />
      </AuthorLayout>
    </AuthorGuard>
  ),
});

type Stats = {
  total: number;
  published: number;
  drafts: number;
  views: number;
  comments: number;
  pending: number;
};

type RecentPost = {
  id: string;
  title: string;
  status: "draft" | "published";
  updated_at: string;
};

type RecentComment = {
  id: string;
  name: string;
  content: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
};

function Dashboard() {
  const { author, user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    drafts: 0,
    views: 0,
    comments: 0,
    pending: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!author?.id) return;
    (async () => {
      setLoading(true);

      // Get all my post ids for filtering comments/views
      const { data: myPosts } = await supabase
        .from("posts")
        .select("id, title, status, updated_at")
        .eq("author_id", author.id)
        .order("updated_at", { ascending: false });

      const ids = (myPosts ?? []).map((p) => p.id);
      const published = (myPosts ?? []).filter((p) => p.status === "published").length;
      const drafts = (myPosts ?? []).filter((p) => p.status === "draft").length;

      let viewsCount = 0;
      let commentsCount = 0;
      let pendingCount = 0;
      let recentCommentsList: RecentComment[] = [];

      if (ids.length > 0) {
        const [viewsRes, commentsRes, pendingRes, recentCommRes] = await Promise.all([
          supabase.from("post_views").select("id", { count: "exact", head: true }).in("post_id", ids),
          supabase.from("comments").select("id", { count: "exact", head: true }).in("post_id", ids),
          supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .in("post_id", ids)
            .eq("status", "pending"),
          supabase
            .from("comments")
            .select("id, name, content, created_at, status")
            .in("post_id", ids)
            .order("created_at", { ascending: false })
            .limit(5),
        ]);
        viewsCount = viewsRes.count ?? 0;
        commentsCount = commentsRes.count ?? 0;
        pendingCount = pendingRes.count ?? 0;
        recentCommentsList = (recentCommRes.data as RecentComment[]) ?? [];
      }

      setStats({
        total: myPosts?.length ?? 0,
        published,
        drafts,
        views: viewsCount,
        comments: commentsCount,
        pending: pendingCount,
      });
      setRecentPosts(((myPosts as RecentPost[]) ?? []).slice(0, 5));
      setRecentComments(recentCommentsList);
      setLoading(false);
    })();
  }, [author?.id]);

  const greeting = greetingFor(new Date());
  const displayName = author?.name ?? user?.email?.split("@")[0] ?? "Author";

  const cards = [
    {
      label: "Total views",
      value: stats.views,
      sub: `${stats.published} published posts`,
      icon: Eye,
      gradient: "from-blue-500/15 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      label: "Comments",
      value: stats.comments,
      sub: stats.pending > 0 ? `${stats.pending} pending` : "All reviewed",
      icon: MessageSquare,
      gradient: "from-rose-500/15 to-rose-500/5",
      iconColor: "text-rose-500",
    },
    {
      label: "Published posts",
      value: stats.published,
      sub: `${stats.drafts} drafts`,
      icon: FileText,
      gradient: "from-primary/15 to-primary/5",
      iconColor: "text-primary",
    },
    {
      label: "Total posts",
      value: stats.total,
      sub: "All time",
      icon: TrendingUp,
      gradient: "from-emerald-500/15 to-emerald-500/5",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">{greeting}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, <span className="capitalize">{displayName}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's how your posts are performing.</p>
        </div>
        <Link
          to="/author/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow self-start sm:self-end"
        >
          <Plus className="h-4 w-4" /> Write a post
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.gradient} bg-card p-5 shadow-soft`}
          >
            <div className={`h-10 w-10 rounded-xl bg-card grid place-items-center ${c.iconColor} shadow-soft`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="text-4xl font-display font-extrabold mt-4 tabular-nums">
              {loading ? "—" : c.value}
            </p>
            <p className="text-sm font-semibold text-foreground mt-1">{c.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Recent posts</h3>
            </div>
            <Link to="/author/posts" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              All posts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No posts yet.</p>
              <Link to="/author/posts/new" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Plus className="h-3.5 w-3.5" /> Write your first post
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/author/posts/$id/edit"
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
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Recent comments</h3>
            </div>
            <Link to="/author/comments" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              All comments <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentComments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No comments yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {recentComments.map((c) => (
                <li key={c.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        c.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : c.status === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {c.status === "approved" ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{c.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatDate(c.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function greetingFor(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

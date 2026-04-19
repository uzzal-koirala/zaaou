import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  MessageSquare,
  Eye,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
  Edit3,
  Sparkles,
  Calendar,
  Award,
  Activity,
  ExternalLink,
  Globe,
  PenSquare,
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
  approved: number;
  views7d: number;
  viewsPrev7d: number;
};

type RecentPost = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updated_at: string;
  published_at: string | null;
  cover_image_url: string | null;
  reading_time_minutes: number | null;
};

type TopPost = {
  id: string;
  title: string;
  slug: string;
  views: number;
  cover_image_url: string | null;
};

type RecentComment = {
  id: string;
  name: string;
  content: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
  post_id: string;
};

type DraftPost = {
  id: string;
  title: string;
  updated_at: string;
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
    approved: 0,
    views7d: 0,
    viewsPrev7d: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [trend, setTrend] = useState<number[]>([]);
  const [authorMeta, setAuthorMeta] = useState<{
    bio: string | null;
    role: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    slug: string;
    avatar_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!author?.id) return;
    (async () => {
      setLoading(true);

      const now = new Date();
      const since7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
      const since14 = new Date(now.getTime() - 14 * 24 * 3600 * 1000).toISOString();

      const [postsRes, authorRes] = await Promise.all([
        supabase
          .from("posts")
          .select("id, title, slug, status, updated_at, published_at, cover_image_url, reading_time_minutes")
          .eq("author_id", author.id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("authors")
          .select("bio, role, twitter_url, linkedin_url, website_url, slug, avatar_url")
          .eq("id", author.id)
          .maybeSingle(),
      ]);

      const myPosts = (postsRes.data ?? []) as RecentPost[];
      const ids = myPosts.map((p) => p.id);
      const published = myPosts.filter((p) => p.status === "published").length;
      const draftsList = myPosts.filter((p) => p.status === "draft");

      let viewsCount = 0;
      let commentsCount = 0;
      let pendingCount = 0;
      let approvedCount = 0;
      let recentCommentsList: RecentComment[] = [];
      let topList: TopPost[] = [];
      let views7d = 0;
      let viewsPrev7d = 0;
      let dailyCounts: number[] = new Array(7).fill(0);

      if (ids.length > 0) {
        const [
          viewsRes,
          commentsRes,
          pendingRes,
          approvedRes,
          recentCommRes,
          views7dRes,
          viewsPrevRes,
          allViewsRes,
        ] = await Promise.all([
          supabase.from("post_views").select("id", { count: "exact", head: true }).in("post_id", ids),
          supabase.from("comments").select("id", { count: "exact", head: true }).in("post_id", ids),
          supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .in("post_id", ids)
            .eq("status", "pending"),
          supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .in("post_id", ids)
            .eq("status", "approved"),
          supabase
            .from("comments")
            .select("id, name, content, created_at, status, post_id")
            .in("post_id", ids)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("post_views")
            .select("id", { count: "exact", head: true })
            .in("post_id", ids)
            .gte("created_at", since7),
          supabase
            .from("post_views")
            .select("id", { count: "exact", head: true })
            .in("post_id", ids)
            .gte("created_at", since14)
            .lt("created_at", since7),
          supabase
            .from("post_views")
            .select("post_id, created_at")
            .in("post_id", ids)
            .gte("created_at", since7)
            .limit(5000),
        ]);

        viewsCount = viewsRes.count ?? 0;
        commentsCount = commentsRes.count ?? 0;
        pendingCount = pendingRes.count ?? 0;
        approvedCount = approvedRes.count ?? 0;
        recentCommentsList = (recentCommRes.data as RecentComment[]) ?? [];
        views7d = views7dRes.count ?? 0;
        viewsPrev7d = viewsPrevRes.count ?? 0;

        // Compute daily trend (last 7 days)
        const buckets = new Array(7).fill(0);
        const startMs = new Date(now.toDateString()).getTime() - 6 * 24 * 3600 * 1000;
        for (const v of allViewsRes.data ?? []) {
          const d = new Date(v.created_at as string);
          const dayStart = new Date(d.toDateString()).getTime();
          const idx = Math.floor((dayStart - startMs) / (24 * 3600 * 1000));
          if (idx >= 0 && idx < 7) buckets[idx]++;
        }
        dailyCounts = buckets;

        // Top posts by views
        const viewsByPost: Record<string, number> = {};
        for (const v of allViewsRes.data ?? []) {
          const id = v.post_id as string;
          viewsByPost[id] = (viewsByPost[id] ?? 0) + 1;
        }
        // Fallback: query all-time top by counting on each post (cheap)
        const totalViewsByPost: Record<string, number> = { ...viewsByPost };
        // Get all-time totals via grouped count (single query per post would be slow; use head count)
        // We'll just rank by 7d for performance and fall back to recent posts.
        const ranked = myPosts
          .map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            cover_image_url: p.cover_image_url,
            views: totalViewsByPost[p.id] ?? 0,
          }))
          .filter((p) => p.views > 0)
          .sort((a, b) => b.views - a.views)
          .slice(0, 4);
        topList = ranked;
      }

      setStats({
        total: myPosts.length,
        published,
        drafts: draftsList.length,
        views: viewsCount,
        comments: commentsCount,
        pending: pendingCount,
        approved: approvedCount,
        views7d,
        viewsPrev7d,
      });
      setRecentPosts(myPosts.slice(0, 5));
      setDrafts(draftsList.slice(0, 4).map((p) => ({ id: p.id, title: p.title, updated_at: p.updated_at })));
      setRecentComments(recentCommentsList);
      setTopPosts(topList);
      setTrend(dailyCounts);
      setAuthorMeta(authorRes.data ?? null);
      setLoading(false);
    })();
  }, [author?.id]);

  const greeting = greetingFor(new Date());
  const displayName = author?.name ?? user?.email?.split("@")[0] ?? "Author";

  const trendDelta = useMemo(() => {
    if (stats.viewsPrev7d === 0) return stats.views7d > 0 ? 100 : 0;
    return Math.round(((stats.views7d - stats.viewsPrev7d) / stats.viewsPrev7d) * 100);
  }, [stats.views7d, stats.viewsPrev7d]);

  const profileCompleteness = useMemo(() => {
    if (!authorMeta) return 0;
    const fields = [
      authorMeta.bio,
      authorMeta.role,
      authorMeta.avatar_url,
      authorMeta.twitter_url || authorMeta.linkedin_url,
      authorMeta.website_url,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [authorMeta]);

  const cards = [
    {
      label: "Total views",
      value: stats.views,
      sub: `${stats.views7d} in last 7 days`,
      icon: Eye,
      gradient: "from-blue-500/15 to-blue-500/5",
      iconColor: "text-blue-500",
      delta: trendDelta,
    },
    {
      label: "Comments",
      value: stats.comments,
      sub: stats.pending > 0 ? `${stats.pending} pending review` : `${stats.approved} approved`,
      icon: MessageSquare,
      gradient: "from-rose-500/15 to-rose-500/5",
      iconColor: "text-rose-500",
    },
    {
      label: "Published",
      value: stats.published,
      sub: `${stats.drafts} draft${stats.drafts === 1 ? "" : "s"}`,
      icon: FileText,
      gradient: "from-primary/15 to-primary/5",
      iconColor: "text-primary",
    },
    {
      label: "Engagement",
      value: stats.published > 0 ? Math.round(stats.comments / stats.published) : 0,
      sub: "Avg comments / post",
      icon: TrendingUp,
      gradient: "from-emerald-500/15 to-emerald-500/5",
      iconColor: "text-emerald-500",
    },
  ];

  const maxTrend = Math.max(...trend, 1);

  return (
    <>
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 mb-6 shadow-soft">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="flex items-start gap-4">
            {author?.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={author.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/30 shadow-soft hidden sm:block"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center text-2xl font-bold shadow-soft hidden sm:block">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-1.5 inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> {greeting}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Welcome, <span className="capitalize">{displayName}</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {stats.total === 0
                  ? "Ready to share your first story with the world?"
                  : `You have ${stats.published} live ${stats.published === 1 ? "story" : "stories"} reaching readers right now.`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/author/posts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow"
            >
              <PenSquare className="h-4 w-4" /> Write a post
            </Link>
            {authorMeta?.slug && (
              <a
                href={`/blog/author/${authorMeta.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> View public page
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.gradient} bg-card p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all`}
          >
            <div className="flex items-start justify-between">
              <div className={`h-10 w-10 rounded-xl bg-card grid place-items-center ${c.iconColor} shadow-soft`}>
                <c.icon className="h-5 w-5" />
              </div>
              {typeof c.delta === "number" && c.delta !== 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    c.delta > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  }`}
                >
                  {c.delta > 0 ? "↑" : "↓"} {Math.abs(c.delta)}%
                </span>
              )}
            </div>
            <p className="text-4xl font-display font-extrabold mt-4 tabular-nums">
              {loading ? "—" : c.value.toLocaleString()}
            </p>
            <p className="text-sm font-semibold text-foreground mt-1">{c.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Trend chart + drafts */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Views — last 7 days</h3>
            </div>
            <span className="text-2xl font-display font-extrabold tabular-nums">
              {stats.views7d.toLocaleString()}
            </span>
          </div>
          <div className="h-40 flex items-end gap-2">
            {trend.map((v, i) => {
              const h = Math.max((v / maxTrend) * 100, 4);
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-bold tabular-nums text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {v}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 hover:from-primary hover:to-primary/80 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {date.toLocaleDateString("en", { weekday: "short" })[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-amber-500" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Drafts</h3>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              {stats.drafts}
            </span>
          </div>
          {drafts.length === 0 ? (
            <div className="py-6 text-center">
              <div className="h-10 w-10 mx-auto rounded-full bg-muted grid place-items-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-xs text-muted-foreground">No drafts. You're all caught up!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {drafts.map((d) => (
                <li key={d.id}>
                  <Link
                    to="/author/posts/$id/edit"
                    params={{ id: d.id }}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center flex-shrink-0">
                      <Edit3 className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                        {d.title || "Untitled draft"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(d.updated_at)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Top posts + Profile completeness */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Top performing this week</h3>
            </div>
            <Link to="/author/posts" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              All posts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {topPosts.length === 0 ? (
            <div className="py-10 text-center">
              <div className="h-12 w-12 mx-auto rounded-full bg-muted grid place-items-center mb-3">
                <Award className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No views yet this week.</p>
              <p className="text-xs text-muted-foreground mt-1">Share your posts on social to drive traffic!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {topPosts.map((p, i) => (
                <li key={p.id}>
                  <Link
                    to="/author/posts/$id/edit"
                    params={{ id: p.id }}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted transition-colors group"
                  >
                    <span className={`h-8 w-8 rounded-lg grid place-items-center text-sm font-bold flex-shrink-0 ${
                      i === 0 ? "bg-amber-500/15 text-amber-600" :
                      i === 1 ? "bg-slate-500/15 text-slate-600" :
                      i === 2 ? "bg-orange-500/15 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt="" className="h-10 w-14 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-14 rounded-lg bg-gradient-primary/20 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {p.views} {p.views === 1 ? "view" : "views"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <UserCircleSmall />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Profile</h3>
          </div>

          <div className="text-center py-2">
            <div className="relative inline-flex">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(profileCompleteness / 100) * 264} 264`}
                  className="text-primary transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display font-extrabold text-xl">
                {profileCompleteness}%
              </span>
            </div>
            <p className="text-xs font-semibold mt-2">Profile completeness</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {profileCompleteness === 100 ? "Looking great!" : "Complete your profile"}
            </p>
          </div>

          <div className="space-y-1.5 mt-3">
            <ChecklistItem ok={!!authorMeta?.avatar_url} label="Avatar" />
            <ChecklistItem ok={!!authorMeta?.bio} label="Bio" />
            <ChecklistItem ok={!!authorMeta?.role} label="Role / Title" />
            <ChecklistItem ok={!!(authorMeta?.twitter_url || authorMeta?.linkedin_url)} label="Social link" />
            <ChecklistItem ok={!!authorMeta?.website_url} label="Website" />
          </div>

          {profileCompleteness < 100 && (
            <Link
              to="/author/profile"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/15 transition-colors"
            >
              Complete profile <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          {(authorMeta?.twitter_url || authorMeta?.linkedin_url || authorMeta?.website_url) && (
            <div className="mt-4 pt-4 border-t border-border flex justify-center gap-2">
              {authorMeta?.twitter_url && (
                <a href={authorMeta.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="h-8 w-8 grid place-items-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {authorMeta?.linkedin_url && (
                <a href={authorMeta.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-8 w-8 grid place-items-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {authorMeta?.website_url && (
                <a href={authorMeta.website_url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 grid place-items-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent posts + Recent comments */}
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Recent posts</h3>
            </div>
            <Link to="/author/posts" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              All posts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="py-10 text-center">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 grid place-items-center mb-3">
                <PenSquare className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold">No posts yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">Start sharing your stories.</p>
              <Link to="/author/posts/new" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
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
                    className="flex items-center gap-3 py-3 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors group"
                  >
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt="" className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0 grid place-items-center text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                        {p.reading_time_minutes ? <span>{p.reading_time_minutes} min read</span> : null}
                        {p.reading_time_minutes ? <span>•</span> : null}
                        <span>{formatDate(p.updated_at)}</span>
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                        p.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600"
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
              {stats.pending > 0 && (
                <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 px-1.5 py-0.5 rounded-full">
                  {stats.pending} new
                </span>
              )}
            </div>
            <Link to="/author/comments" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              All comments <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentComments.length === 0 ? (
            <div className="py-10 text-center">
              <div className="h-12 w-12 mx-auto rounded-full bg-muted grid place-items-center mb-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No comments yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Reader comments will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentComments.map((c) => (
                <li key={c.id} className="py-3">
                  <div className="flex items-start gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold flex-shrink-0">
                      {c.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold truncate">{c.name}</p>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                            c.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : c.status === "rejected"
                                ? "bg-rose-500/10 text-rose-600"
                                : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {c.status === "approved" ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{c.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(c.created_at)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function ChecklistItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`h-4 w-4 rounded-full grid place-items-center flex-shrink-0 ${ok ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
        {ok ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
      </span>
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

function UserCircleSmall() {
  return (
    <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

function greetingFor(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

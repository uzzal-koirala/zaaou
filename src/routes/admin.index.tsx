import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Users, MessageSquare, ArrowRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Zaaou Food" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </RoleGuard>
  ),
});

function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, drafts: 0, authors: 0, pending: 0 });

  useEffect(() => {
    (async () => {
      const [posts, drafts, authors, pending] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("authors").select("id", { count: "exact", head: true }),
        supabase.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        posts: posts.count ?? 0,
        drafts: drafts.count ?? 0,
        authors: authors.count ?? 0,
        pending: pending.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Published posts", value: stats.posts, icon: FileText, to: "/admin/posts" as const, color: "text-primary" },
    { label: "Drafts", value: stats.drafts, icon: FileText, to: "/admin/posts" as const, color: "text-amber-500" },
    { label: "Authors", value: stats.authors, icon: Users, to: "/admin/authors" as const, color: "text-blue-500" },
    { label: "Pending comments", value: stats.pending, icon: MessageSquare, to: "/admin/comments" as const, color: "text-rose-500" },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back. Here's what's happening with your blog.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow transition-shadow group"
          >
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="text-3xl font-display font-bold">{c.value}</p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              {c.label} <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Link to="/admin/posts/new" className="rounded-2xl border border-border bg-primary text-primary-foreground p-6 shadow-soft hover:shadow-glow transition-shadow">
          <p className="font-display font-bold text-lg">+ Write a new post</p>
          <p className="text-sm opacity-80 mt-1">Create and publish a new blog article.</p>
        </Link>
        <Link to="/admin/authors" className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-glow transition-shadow">
          <p className="font-display font-bold text-lg">Manage authors</p>
          <p className="text-sm text-muted-foreground mt-1">Add or edit author profiles.</p>
        </Link>
      </div>
    </>
  );
}

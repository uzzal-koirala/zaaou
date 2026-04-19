import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Loader2, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { AuthorGuard } from "@/components/author/AuthorGuard";
import { AuthorLayout } from "@/components/author/AuthorLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/blog-utils";

export const Route = createFileRoute("/author/posts/")({
  head: () => ({ meta: [{ title: "My posts - Author" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AuthorGuard>
      <AuthorLayout>
        <PostsPage />
      </AuthorLayout>
    </AuthorGuard>
  ),
});

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

function PostsPage() {
  const { author } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState<Record<string, { views: number; comments: number }>>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!author?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, status, published_at, updated_at")
      .eq("author_id", author.id)
      .order("updated_at", { ascending: false });
    const list = (data as Row[]) ?? [];
    setRows(list);

    // Per-post views & comments counts
    const map: Record<string, { views: number; comments: number }> = {};
    await Promise.all(
      list.map(async (p) => {
        const [v, c] = await Promise.all([
          supabase.from("post_views").select("id", { count: "exact", head: true }).eq("post_id", p.id),
          supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", p.id),
        ]);
        map[p.id] = { views: v.count ?? 0, comments: c.count ?? 0 };
      }),
    );
    setCounts(map);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author?.id]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    load();
  }

  async function togglePublish(row: Row) {
    const newStatus = row.status === "published" ? "draft" : "published";
    const update: { status: "draft" | "published"; published_at?: string } = { status: newStatus };
    if (newStatus === "published" && !row.published_at) {
      update.published_at = new Date().toISOString();
    }
    const { error } = await supabase.from("posts").update(update).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success(newStatus === "published" ? "Published" : "Unpublished");
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">My posts</h1>
          <p className="text-muted-foreground mt-1">Articles you've written for Zaaou Food.</p>
        </div>
        <Link
          to="/author/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No posts yet. Write your first one!</p>
          <Link
            to="/author/posts/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Write a post
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Views</th>
                <th className="px-5 py-3">Comments</th>
                <th className="px-5 py-3">Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{row.title}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => togglePublish(row)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        row.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.status}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {counts[row.id]?.views ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {counts[row.id]?.comments ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(row.updated_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {row.status === "published" && (
                        <Link
                          to="/blog/$slug"
                          params={{ slug: row.slug }}
                          target="_blank"
                          className="p-2 hover:bg-muted rounded-md"
                          title="View"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to="/author/posts/$id/edit"
                        params={{ id: row.id }}
                        className="p-2 hover:bg-muted rounded-md"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

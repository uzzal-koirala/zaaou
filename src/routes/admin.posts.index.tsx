import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/blog-utils";

export const Route = createFileRoute("/admin/posts/")({
  head: () => ({ meta: [{ title: "Posts — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <PostsPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
  authors: { name: string } | null;
};

function PostsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, status, published_at, updated_at, authors(name)")
      .order("updated_at", { ascending: false });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

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
          <h1 className="font-display text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">Create, edit and publish blog articles.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No posts yet. Create your first one.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{row.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.authors?.name ?? "—"}</td>
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
                        to="/admin/posts/$id/edit"
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

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AuthorGuard } from "@/components/author/AuthorGuard";
import { AuthorLayout } from "@/components/author/AuthorLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/blog-utils";

type CommentRow = {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  posts: { title: string; slug: string } | null;
};

type Filter = "pending" | "approved" | "rejected" | "all";

export const Route = createFileRoute("/author/comments")({
  head: () => ({ meta: [{ title: "Comments - Author" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AuthorGuard>
      <AuthorLayout>
        <CommentsPage />
      </AuthorLayout>
    </AuthorGuard>
  ),
});

function CommentsPage() {
  const { author } = useAuth();
  const [filter, setFilter] = useState<Filter>("pending");
  const [rows, setRows] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [postIds, setPostIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (!author?.id) return;
    (async () => {
      const { data } = await supabase.from("posts").select("id").eq("author_id", author.id);
      setPostIds((data ?? []).map((p) => p.id));
    })();
  }, [author?.id]);

  async function load() {
    if (!postIds) return;
    setLoading(true);
    if (postIds.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }
    let query = supabase
      .from("comments")
      .select("id, post_id, name, email, content, status, created_at, posts(title, slug)")
      .in("post_id", postIds)
      .order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setRows((data as CommentRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, postIds]);

  async function setStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("comments").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Comment ${status}`);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Comment deleted");
    load();
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-bold mb-2">Comments</h1>
      <p className="text-muted-foreground mb-6">Review reader comments on your posts.</p>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground/70 border-border hover:border-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No comments here.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground text-xs">{c.email}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      c.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                      c.status === "rejected" ? "bg-rose-100 text-rose-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{c.status}</span>
                  </div>
                  {c.posts && (
                    <p className="text-xs text-muted-foreground mt-1">
                      on <a href={`/blog/${c.posts.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{c.posts.title}</a>
                    </p>
                  )}
                  <p className="mt-3 text-sm text-foreground/85 whitespace-pre-wrap">{c.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status !== "approved" && (
                    <button onClick={() => setStatus(c.id, "approved")} className="p-2 rounded-md hover:bg-emerald-100 text-emerald-700" title="Approve">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {c.status !== "rejected" && (
                    <button onClick={() => setStatus(c.id, "rejected")} className="p-2 rounded-md hover:bg-amber-100 text-amber-700" title="Reject">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => remove(c.id)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

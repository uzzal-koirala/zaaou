import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/blog-utils";

const commentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Invalid email").max(254),
  content: z.string().trim().min(1, "Comment cannot be empty").max(1500),
});

type Comment = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

type Props = {
  postId: string;
  commentsEnabled: boolean;
  autoApprove: boolean;
};

export function CommentSection({ postId, commentsEnabled, autoApprove }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("comments")
        .select("id, name, content, created_at")
        .eq("post_id", postId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        setComments(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot triggered, silently drop

    const result = commentSchema.safeParse({ name, email, content });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        name: result.data.name,
        email: result.data.email,
        content: result.data.content,
      })
      .select("id, name, content, created_at, status")
      .single();

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setName("");
    setEmail("");
    setContent("");

    if (data?.status === "approved") {
      toast.success("Comment posted");
      setComments((prev) => [
        { id: data.id, name: data.name, content: data.content, created_at: data.created_at },
        ...prev,
      ]);
    } else {
      toast.success("Thanks! Your comment is awaiting moderation.");
    }
  }

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">
          Comments {comments.length > 0 && <span className="text-muted-foreground">({comments.length})</span>}
        </h2>
      </div>

      {commentsEnabled ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft mb-8">
          <h3 className="font-display font-bold text-lg mb-1">Leave a comment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {autoApprove
              ? "Your comment will appear immediately."
              : "Your comment will be visible after moderation."}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              maxLength={80}
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              type="email"
              required
              maxLength={254}
              placeholder="Your email * (not published)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          {/* honeypot */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
            aria-hidden="true"
          />
          <textarea
            required
            maxLength={1500}
            rows={4}
            placeholder="Write your comment... *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-muted-foreground">{content.length}/1500</p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Post comment
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground mb-8">
          Comments are currently disabled.
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading comments…
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Be the first to comment.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(c.created_at)}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

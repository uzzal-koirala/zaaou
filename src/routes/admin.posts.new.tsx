import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { MarkdownToolbar, useMarkdownShortcuts } from "@/components/admin/MarkdownToolbar";
import { supabase } from "@/integrations/supabase/client";
import { slugify, estimateReadingTime } from "@/lib/blog-utils";

type Author = { id: string; name: string };
type Mode = "new" | "edit";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string;
  author_id: string;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
};

const empty: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  category: "",
  tags: "",
  author_id: "",
  status: "draft",
  seo_title: "",
  seo_description: "",
};

function PostFormPage({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const editingId = mode === "edit" ? params.id : undefined;

  const [form, setForm] = useState<FormState>(empty);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const shortcuts = useMarkdownShortcuts(
    form.content,
    (next) => setForm((f) => ({ ...f, content: next })),
    contentRef,
  );

  useEffect(() => {
    (async () => {
      const { data: a } = await supabase.from("authors").select("id, name").order("name");
      setAuthors(a ?? []);

      if (mode === "edit" && editingId) {
        const { data: p } = await supabase.from("posts").select("*").eq("id", editingId).maybeSingle();
        if (p) {
          setForm({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt ?? "",
            content: p.content,
            cover_image_url: p.cover_image_url ?? "",
            category: p.category ?? "",
            tags: p.tags.join(", "),
            author_id: p.author_id ?? "",
            status: p.status,
            seo_title: p.seo_title ?? "",
            seo_description: p.seo_description ?? "",
          });
        }
        setLoading(false);
      }
    })();
  }, [mode, editingId]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);

    const tagsArr = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      cover_image_url: form.cover_image_url.trim() || null,
      category: form.category.trim() || null,
      tags: tagsArr,
      author_id: form.author_id || null,
      status: form.status,
      reading_time_minutes: estimateReadingTime(form.content),
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      published_at:
        form.status === "published"
          ? mode === "edit"
            ? undefined
            : new Date().toISOString()
          : null,
    };

    if (mode === "new") {
      const { data, error } = await supabase.from("posts").insert(payload).select("id").single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Post created");
      navigate({ to: "/admin/posts/$id/edit", params: { id: data.id } });
    } else if (editingId) {
      const updatePayload: typeof payload & { published_at?: string | null } = { ...payload };
      // Only set published_at if publishing for the first time
      if (form.status === "published") {
        const { data: existing } = await supabase
          .from("posts")
          .select("published_at")
          .eq("id", editingId)
          .single();
        if (!existing?.published_at) updatePayload.published_at = new Date().toISOString();
        else delete updatePayload.published_at;
      } else {
        updatePayload.published_at = null;
      }
      const { error } = await supabase.from("posts").update(updatePayload).eq("id", editingId);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Post saved");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">
          {mode === "new" ? "New post" : "Edit post"}
        </h1>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-primary"
        >
          <Eye className="h-4 w-4" /> {preview ? "Edit" : "Preview"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Field label="Title *">
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
                placeholder="A great article title"
                className={inputCls}
              />
            </Field>
            <Field label="Slug" hint="Auto-generated if empty">
              <input
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder={form.title ? slugify(form.title) : "my-post"}
                className={inputCls}
              />
            </Field>
            <Field label="Excerpt" hint="1–2 sentence summary shown in cards & SEO">
              <textarea
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                rows={2}
                maxLength={300}
                className={inputCls + " resize-none"}
              />
            </Field>
            <Field label="Content (Markdown) *">
              {preview ? (
                <div className="rounded-xl border border-input bg-background p-5 min-h-[400px]">
                  {form.content ? <MarkdownContent content={form.content} /> : <p className="text-muted-foreground text-sm">Nothing to preview.</p>}
                </div>
              ) : (
                <div>
                  <MarkdownToolbar
                    value={form.content}
                    onChange={(next) => update("content", next)}
                    textareaRef={contentRef}
                  />
                  <textarea
                    ref={contentRef}
                    value={form.content}
                    onChange={(e) => update("content", e.target.value)}
                    onKeyDown={shortcuts.onKeyDown}
                    rows={20}
                    required
                    placeholder="# Heading&#10;&#10;Write your article using **markdown**...&#10;&#10;Click the image icon in the toolbar to drop a photo anywhere in the post."
                    className="w-full rounded-b-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono resize-y min-h-[400px]"
                  />
                </div>
              )}
            </Field>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value as "draft" | "published")}
                  className={inputCls}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>
              <Field label="Author">
                <select
                  value={form.author_id}
                  onChange={(e) => update("author_id", e.target.value)}
                  className={inputCls}
                >
                  <option value="">- Select -</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </Field>
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save post
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <Field label="Cover image URL">
                <input
                  value={form.cover_image_url}
                  onChange={(e) => update("cover_image_url", e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="" className="mt-2 rounded-lg w-full aspect-video object-cover" />
                )}
              </Field>
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  placeholder="e.g. Restaurant Guide"
                  className={inputCls}
                />
              </Field>
              <Field label="Tags" hint="Comma separated">
                <input
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="biryani, itahari, food"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO (optional)</p>
              <Field label="SEO title">
                <input
                  value={form.seo_title}
                  onChange={(e) => update("seo_title", e.target.value)}
                  maxLength={70}
                  className={inputCls}
                />
              </Field>
              <Field label="SEO description">
                <textarea
                  value={form.seo_description}
                  onChange={(e) => update("seo_description", e.target.value)}
                  rows={2}
                  maxLength={160}
                  className={inputCls + " resize-none"}
                />
              </Field>
            </div>
          </aside>
        </div>
      </form>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
        {label}
        {hint && <span className="ml-2 font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export const Route = createFileRoute("/admin/posts/new")({
  head: () => ({ meta: [{ title: "New post - Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <PostFormPage mode="new" />
      </AdminLayout>
    </RoleGuard>
  ),
});

export { PostFormPage };

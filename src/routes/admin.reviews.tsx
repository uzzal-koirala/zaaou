import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, Star, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [{ title: "Reviews - Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <ReviewsAdminPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const emptyForm = {
  id: "",
  name: "",
  role: "",
  rating: 5,
  content: "",
  avatar_url: "",
  display_order: 0,
  is_featured: true,
  is_active: true,
};

function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({ ...emptyForm, display_order: reviews.length + 1 });
  }

  function startEdit(r: Review) {
    setEditing({
      id: r.id,
      name: r.name,
      role: r.role ?? "",
      rating: r.rating,
      content: r.content,
      avatar_url: r.avatar_url ?? "",
      display_order: r.display_order,
      is_featured: r.is_featured,
      is_active: r.is_active,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Review deleted");
    load();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      role: editing.role.trim() || null,
      rating: Math.min(5, Math.max(1, Number(editing.rating) || 5)),
      content: editing.content.trim(),
      avatar_url: editing.avatar_url.trim() || null,
      display_order: Number(editing.display_order) || 0,
      is_featured: editing.is_featured,
      is_active: editing.is_active,
    };

    if (editing.id) {
      const { error } = await supabase.from("reviews").update(payload).eq("id", editing.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else {
      const { error } = await supabase.from("reviews").insert(payload);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    setEditing(null);
    toast.success("Review saved");
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer testimonials shown on the home page.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New review
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No reviews yet. Click "New review" to add the first one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col"
            >
              <div className="flex items-start gap-3">
                {r.avatar_url ? (
                  <img
                    src={r.avatar_url}
                    alt={r.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center font-bold">
                    {r.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.name}</p>
                  {r.role && <p className="text-xs text-muted-foreground">{r.role}</p>}
                  <div className="flex gap-0.5 text-yellow-500 mt-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground line-clamp-4 flex-1">
                "{r.content}"
              </p>
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-muted-foreground">#{r.display_order}</span>
                {r.is_featured && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                    <Star className="h-3 w-3 fill-current" /> Featured
                  </span>
                )}
                {!r.is_active && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground">
                    <EyeOff className="h-3 w-3" /> Hidden
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-1">
                <button
                  onClick={() => startEdit(r)}
                  className="p-2 hover:bg-muted rounded-md text-foreground/70"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl shadow-glow w-full max-w-2xl p-6 my-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold">
                {editing.id ? "Edit review" : "New review"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="p-1.5 hover:bg-muted rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name *">
                <input
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Location / Role" hint="e.g. Itahari-3">
                <input
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Reviewer photo">
                  <ImageUpload
                    value={editing.avatar_url}
                    onChange={(url) => setEditing({ ...editing, avatar_url: url })}
                    folder="reviews"
                    variant="avatar"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Review content *">
                  <textarea
                    required
                    rows={4}
                    value={editing.content}
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                    className={inputCls + " resize-none"}
                    placeholder="What did the customer say?"
                  />
                </Field>
              </div>
              <Field label="Rating *">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditing({ ...editing, rating: n })}
                      className="p-1"
                      aria-label={`${n} star`}
                    >
                      <Star
                        className={
                          "h-6 w-6 " +
                          (n <= editing.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground/40")
                        }
                      />
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Display order" hint="Lower = first">
                <input
                  type="number"
                  value={editing.display_order}
                  onChange={(e) =>
                    setEditing({ ...editing, display_order: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </Field>
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_featured}
                    onChange={(e) =>
                      setEditing({ ...editing, is_featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  Featured on home page
                </label>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_active}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  Active (visible on site)
                </label>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2.5 text-sm font-semibold text-foreground/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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

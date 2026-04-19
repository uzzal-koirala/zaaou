import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/blog-utils";

type Mode = "new" | "edit";

type FormState = {
  name: string;
  slug: string;
  cuisine: string;
  description: string;
  cover_image_url: string;
  address: string;
  phone: string;
  rating: string;
  delivery_time_minutes: string;
  price_range: "" | "$" | "$$" | "$$$" | "$$$$";
  tags: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: string;
};

const empty: FormState = {
  name: "",
  slug: "",
  cuisine: "",
  description: "",
  cover_image_url: "",
  address: "",
  phone: "",
  rating: "0",
  delivery_time_minutes: "30",
  price_range: "$$",
  tags: "",
  is_featured: false,
  is_active: true,
  display_order: "0",
};

function RestaurantForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const editingId = mode === "edit" ? params.id : undefined;

  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !editingId) return;
    (async () => {
      const { data } = await supabase.from("restaurants").select("*").eq("id", editingId).maybeSingle();
      if (data) {
        setForm({
          name: data.name,
          slug: data.slug,
          cuisine: data.cuisine ?? "",
          description: data.description ?? "",
          cover_image_url: data.cover_image_url ?? "",
          address: data.address ?? "",
          phone: data.phone ?? "",
          rating: String(data.rating ?? 0),
          delivery_time_minutes: String(data.delivery_time_minutes ?? 30),
          price_range: (data.price_range ?? "$$") as FormState["price_range"],
          tags: data.tags.join(", "),
          is_featured: data.is_featured,
          is_active: data.is_active,
          display_order: String(data.display_order ?? 0),
        });
      }
      setLoading(false);
    })();
  }, [mode, editingId]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      cuisine: form.cuisine.trim() || null,
      description: form.description.trim() || null,
      cover_image_url: form.cover_image_url.trim() || null,
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      rating: Number(form.rating) || 0,
      delivery_time_minutes: Number(form.delivery_time_minutes) || null,
      price_range: form.price_range || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_active: form.is_active,
      display_order: Number(form.display_order) || 0,
    };

    if (mode === "new") {
      const { data, error } = await supabase.from("restaurants").insert(payload).select("id").single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Restaurant created");
      navigate({ to: "/admin/restaurants/$id/edit", params: { id: data.id } });
    } else if (editingId) {
      const { error } = await supabase.from("restaurants").update(payload).eq("id", editingId);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Restaurant saved");
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
      <Link
        to="/admin/restaurants"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to restaurants
      </Link>
      <h1 className="font-display text-3xl font-bold mb-6">
        {mode === "new" ? "Add restaurant" : "Edit restaurant"}
      </h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <Field label="Name *">
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                placeholder="The Roast House"
                className={inputCls}
              />
            </Field>
            <Field label="Slug" hint="Auto-generated if empty">
              <input
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder={form.name ? slugify(form.name) : "the-roast-house"}
                className={inputCls}
              />
            </Field>
            <Field label="Cuisine">
              <input
                value={form.cuisine}
                onChange={(e) => update("cuisine", e.target.value)}
                placeholder="Nepali, Indian, Continental..."
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                placeholder="A short description that appears on the restaurant card and detail page."
                className={inputCls + " resize-y"}
              />
            </Field>
            <Field label="Tags" hint="Comma separated">
              <input
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="momo, biryani, family-friendly"
                className={inputCls}
              />
            </Field>
          </Card>

          <Card title="Location & contact">
            <Field label="Address">
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Dharan Road, Itahari"
                className={inputCls}
              />
            </Field>
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className={inputCls}
              />
            </Field>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card title="Status">
            <Field label="Visibility">
              <Toggle
                checked={form.is_active}
                onChange={(v) => update("is_active", v)}
                label={form.is_active ? "Visible on site" : "Hidden"}
              />
            </Field>
            <Field label="Featured">
              <Toggle
                checked={form.is_featured}
                onChange={(v) => update("is_featured", v)}
                label={form.is_featured ? "Featured restaurant" : "Standard"}
              />
            </Field>
            <Field label="Display order" hint="Lower numbers appear first">
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => update("display_order", e.target.value)}
                className={inputCls}
              />
            </Field>
            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save restaurant
            </button>
          </Card>

          <Card title="Cover image">
            <ImageUpload
              value={form.cover_image_url}
              onChange={(url) => update("cover_image_url", url)}
              folder="restaurants"
              variant="cover"
            />
          </Card>

          <Card title="Details">
            <Field label="Price range">
              <select
                value={form.price_range}
                onChange={(e) => update("price_range", e.target.value as FormState["price_range"])}
                className={inputCls}
              >
                <option value="$">$ — Budget</option>
                <option value="$$">$$ — Moderate</option>
                <option value="$$$">$$$ — Premium</option>
                <option value="$$$$">$$$$ — Fine dining</option>
              </select>
            </Field>
            <Field label="Rating (0–5)">
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => update("rating", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Delivery time (minutes)">
              <input
                type="number"
                min="0"
                value={form.delivery_time_minutes}
                onChange={(e) => update("delivery_time_minutes", e.target.value)}
                className={inputCls}
              />
            </Field>
          </Card>
        </aside>
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

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      {title && (
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      )}
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group w-full"
    >
      <span
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-soft transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

export const Route = createFileRoute("/admin/restaurants/new")({
  head: () => ({ meta: [{ title: "New restaurant - Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <RestaurantForm mode="new" />
      </AdminLayout>
    </RoleGuard>
  ),
});

export { RestaurantForm };

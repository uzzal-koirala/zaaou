import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, Bike, Star } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Rider = Database["public"]["Tables"]["riders"]["Row"];

export const Route = createFileRoute("/admin/riders")({
  head: () => ({
    meta: [{ title: "Riders - Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <RidersAdminPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const VEHICLE_OPTIONS = ["Bike", "Scooter", "Bicycle", "Car"];
const STATUS_OPTIONS = ["online", "offline", "on_delivery"];

const emptyForm = {
  id: "",
  name: "",
  phone: "",
  email: "",
  vehicle_type: "Bike",
  status: "offline",
  avatar_url: "",
  rating: 0,
  total_deliveries: 0,
  is_active: true,
};

function RidersAdminPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("riders")
      .select("*")
      .order("created_at", { ascending: false });
    setRiders(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({ ...emptyForm });
  }

  function startEdit(r: Rider) {
    setEditing({
      id: r.id,
      name: r.name,
      phone: r.phone ?? "",
      email: r.email ?? "",
      vehicle_type: r.vehicle_type ?? "Bike",
      status: r.status,
      avatar_url: r.avatar_url ?? "",
      rating: Number(r.rating) || 0,
      total_deliveries: r.total_deliveries,
      is_active: r.is_active,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this rider?")) return;
    const { error } = await supabase.from("riders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Rider deleted");
    load();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      phone: editing.phone.trim() || null,
      email: editing.email.trim() || null,
      vehicle_type: editing.vehicle_type.trim() || null,
      status: editing.status,
      avatar_url: editing.avatar_url.trim() || null,
      rating: Math.min(5, Math.max(0, Number(editing.rating) || 0)),
      total_deliveries: Math.max(0, Number(editing.total_deliveries) || 0),
      is_active: editing.is_active,
    };

    if (editing.id) {
      const { error } = await supabase.from("riders").update(payload).eq("id", editing.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else {
      const { error } = await supabase.from("riders").insert(payload);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    setEditing(null);
    toast.success("Rider saved");
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Riders</h1>
          <p className="text-muted-foreground mt-1">
            Manage delivery riders shown on the home page.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New rider
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : riders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No riders yet. Click "New rider" to add the first one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {riders.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col"
            >
              <div className="flex items-start gap-3">
                {r.avatar_url ? (
                  <img
                    src={r.avatar_url}
                    alt={r.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-lg">
                    {r.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.name}</p>
                  {r.phone && (
                    <p className="text-xs text-muted-foreground truncate">{r.phone}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    {r.vehicle_type && (
                      <span className="inline-flex items-center gap-1">
                        <Bike className="h-3 w-3" />
                        {r.vehicle_type}
                      </span>
                    )}
                    {Number(r.rating) > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-yellow-600">
                        <Star className="h-3 w-3 fill-current" />
                        {Number(r.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span
                  className={
                    "text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 " +
                    (r.status === "online"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : r.status === "on_delivery"
                        ? "bg-amber-500/15 text-amber-600"
                        : "bg-muted text-muted-foreground")
                  }
                >
                  {r.status}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {r.total_deliveries} deliveries
                </span>
                {!r.is_active && (
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    Hidden
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
                {editing.id ? "Edit rider" : "New rider"}
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
              <Field label="Phone">
                <input
                  value={editing.phone}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className={inputCls}
                  placeholder="+977 98..."
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Rider photo">
                  <ImageUpload
                    value={editing.avatar_url}
                    onChange={(url) => setEditing({ ...editing, avatar_url: url })}
                    folder="riders"
                    variant="avatar"
                  />
                </Field>
              </div>
              <Field label="Email">
                <input
                  type="email"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Vehicle type">
                <select
                  value={editing.vehicle_type}
                  onChange={(e) =>
                    setEditing({ ...editing, vehicle_type: e.target.value })
                  }
                  className={inputCls}
                >
                  {VEHICLE_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  className={inputCls}
                >
                  {STATUS_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Rating (0-5)">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={editing.rating}
                  onChange={(e) =>
                    setEditing({ ...editing, rating: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Total deliveries">
                <input
                  type="number"
                  min="0"
                  value={editing.total_deliveries}
                  onChange={(e) =>
                    setEditing({ ...editing, total_deliveries: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </Field>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_active}
                    onChange={(e) =>
                      setEditing({ ...editing, is_active: e.target.checked })
                    }
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

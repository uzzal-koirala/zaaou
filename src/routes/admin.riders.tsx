import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Bike, Loader2, Trash2, Phone, Star, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";

type Rider = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  vehicle_type: string | null;
  status: "online" | "offline" | "busy" | "inactive";
  avatar_url: string | null;
  rating: number | null;
  total_deliveries: number;
  is_active: boolean;
  joined_at: string;
};

export const Route = createFileRoute("/admin/riders")({
  head: () => ({ meta: [{ title: "Riders - Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <RidersAdminPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const statusStyles: Record<Rider["status"], string> = {
  online: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  busy: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  offline: "bg-muted text-muted-foreground border-border",
  inactive: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

function RidersAdminPage() {
  const [items, setItems] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | Rider["status"]>("all");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("riders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Rider[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Rider["status"]) {
    const { error } = await supabase.from("riders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Remove rider "${name}"?`)) return;
    const { error } = await supabase.from("riders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Rider removed");
    load();
  }

  const counts = {
    all: items.length,
    online: items.filter((r) => r.status === "online").length,
    busy: items.filter((r) => r.status === "busy").length,
    offline: items.filter((r) => r.status === "offline").length,
    inactive: items.filter((r) => r.status === "inactive").length,
  };

  const filtered = filter === "all" ? items : items.filter((r) => r.status === filter);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Riders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {counts.all} riders · {counts.online} online now
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add rider
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        {(["all", "online", "busy", "offline", "inactive"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground/70 hover:bg-muted/70"
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Bike className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg">No riders {filter !== "all" && `(${filter})`}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "all"
              ? "Onboard your first delivery rider to start tracking."
              : "Try a different filter."}
          </p>
          {filter === "all" && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> Add rider
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const initials = r.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={r.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {r.avatar_url ? (
                    <img
                      src={r.avatar_url}
                      alt={r.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center font-bold ring-2 ring-primary/20">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {r.vehicle_type ?? "Vehicle not set"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[r.status]}`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Deliveries</p>
                    <p className="font-display font-bold text-base">{r.total_deliveries}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-display font-bold text-base inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {Number(r.rating ?? 0).toFixed(1)}
                    </p>
                  </div>
                </div>

                {r.phone && (
                  <a
                    href={`tel:${r.phone}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground/70 hover:text-primary"
                  >
                    <Phone className="h-3 w-3" /> {r.phone}
                  </a>
                )}

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as Rider["status"])}
                    className="flex-1 rounded-lg border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="online">Online</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => remove(r.id, r.name)}
                    aria-label="Remove rider"
                    className="h-8 w-8 grid place-items-center rounded-lg border border-border text-foreground/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <AddRiderModal onClose={() => setShowForm(false)} onSaved={load} />}
    </>
  );
}

function AddRiderModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState<"bike" | "scooter" | "cycle" | "car">("bike");
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    const { error } = await supabase.from("riders").insert({
      name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      vehicle_type: vehicle,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Rider added");
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Add rider</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Input label="Name *" value={name} onChange={setName} required />
          <Input label="Phone" value={phone} onChange={setPhone} placeholder="+977 98XXXXXXXX" />
          <Input label="Email" value={email} onChange={setEmail} type="email" />
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5">Vehicle</label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value as typeof vehicle)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="bike">Bike (motorcycle)</option>
              <option value="scooter">Scooter</option>
              <option value="cycle">Bicycle</option>
              <option value="car">Car</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Add rider
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, EyeOff, Bell, Clock } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Notif = Database["public"]["Tables"]["site_notifications"]["Row"];

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [{ title: "Notifications - Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <NotificationsAdminPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const emptyForm = {
  id: "",
  icon_url: "",
  message: "",
  time_ago_label: "just now",
  display_order: 0,
  is_active: true,
};

function NotificationsAdminPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);

  // Global toggle
  const [enabled, setEnabled] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [togglingGlobal, setTogglingGlobal] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: notifs }, { data: settings }] = await Promise.all([
      supabase
        .from("site_notifications")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("blog_settings")
        .select("id, notifications_enabled")
        .eq("singleton", true)
        .maybeSingle(),
    ]);
    setItems(notifs ?? []);
    setEnabled(settings?.notifications_enabled ?? true);
    setSettingsId(settings?.id ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleGlobal(next: boolean) {
    if (!settingsId) return;
    setTogglingGlobal(true);
    const { error } = await supabase
      .from("blog_settings")
      .update({ notifications_enabled: next })
      .eq("id", settingsId);
    setTogglingGlobal(false);
    if (error) return toast.error(error.message);
    setEnabled(next);
    toast.success(next ? "Notifications turned ON" : "Notifications turned OFF");
  }

  function startNew() {
    setEditing({ ...emptyForm, display_order: items.length + 1 });
  }

  function startEdit(n: Notif) {
    setEditing({
      id: n.id,
      icon_url: n.icon_url ?? "",
      message: n.message,
      time_ago_label: n.time_ago_label,
      display_order: n.display_order,
      is_active: n.is_active,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this notification?")) return;
    const { error } = await supabase.from("site_notifications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Notification deleted");
    load();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      icon_url: editing.icon_url.trim() || null,
      message: editing.message.trim(),
      time_ago_label: editing.time_ago_label.trim() || "just now",
      display_order: Number(editing.display_order) || 0,
      is_active: editing.is_active,
    };

    if (editing.id) {
      const { error } = await supabase
        .from("site_notifications")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else {
      const { error } = await supabase.from("site_notifications").insert(payload);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    setEditing(null);
    toast.success("Notification saved");
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Small social-proof popups that appear in the corner of the site.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New notification
        </button>
      </div>

      {/* Global toggle */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-sm">Show notifications on the site</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Master switch. When off, no popups appear anywhere on the public site.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={togglingGlobal || !settingsId}
          onClick={() => toggleGlobal(!enabled)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            enabled ? "bg-primary" : "bg-muted"
          } disabled:opacity-50`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No notifications yet. Click "New notification" to add the first one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-muted grid place-items-center flex-shrink-0">
                  {n.icon_url ? (
                    <img src={n.icon_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Bell className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug line-clamp-3">{n.message}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {n.time_ago_label}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-muted-foreground">#{n.display_order}</span>
                {!n.is_active && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground">
                    <EyeOff className="h-3 w-3" /> Hidden
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-1">
                <button
                  onClick={() => startEdit(n)}
                  className="p-2 hover:bg-muted rounded-md text-foreground/70"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
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
                {editing.id ? "Edit notification" : "New notification"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="p-1.5 hover:bg-muted rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4">
              <Field label="Icon / logo (optional)" hint="Small image shown on the left of the popup">
                <ImageUpload
                  value={editing.icon_url}
                  onChange={(url) => setEditing({ ...editing, icon_url: url })}
                  folder="notifications"
                  variant="square"
                />
              </Field>
              <Field label="Message *">
                <textarea
                  required
                  rows={3}
                  value={editing.message}
                  onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                  className={inputCls + " resize-none"}
                  placeholder="A user from Itahari just ordered momos worth Rs. 480"
                  maxLength={240}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Time-ago label *" hint="Free text">
                  <input
                    required
                    value={editing.time_ago_label}
                    onChange={(e) => setEditing({ ...editing, time_ago_label: e.target.value })}
                    className={inputCls}
                    placeholder="26 minutes ago"
                  />
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
              </div>
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                Active (include in rotation)
              </label>
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

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, Star, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export const Route = createFileRoute("/admin/team")({
  head: () => ({ meta: [{ title: "Team - Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <TeamAdminPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const emptyForm = {
  id: "",
  name: "",
  role: "",
  bio: "",
  avatar_url: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  twitter_url: "",
  display_order: 0,
  is_featured: false,
  is_active: true,
};

function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    setMembers(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({ ...emptyForm, display_order: members.length + 1 });
  }

  function startEdit(m: TeamMember) {
    setEditing({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio ?? "",
      avatar_url: m.avatar_url ?? "",
      facebook_url: m.facebook_url ?? "",
      instagram_url: m.instagram_url ?? "",
      linkedin_url: m.linkedin_url ?? "",
      twitter_url: m.twitter_url ?? "",
      display_order: m.display_order,
      is_featured: m.is_featured,
      is_active: m.is_active,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Team member deleted");
    load();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      role: editing.role.trim(),
      bio: editing.bio.trim() || null,
      avatar_url: editing.avatar_url.trim() || null,
      facebook_url: editing.facebook_url.trim() || null,
      instagram_url: editing.instagram_url.trim() || null,
      linkedin_url: editing.linkedin_url.trim() || null,
      twitter_url: editing.twitter_url.trim() || null,
      display_order: Number(editing.display_order) || 0,
      is_featured: editing.is_featured,
      is_active: editing.is_active,
    };

    if (editing.id) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else {
      const { error } = await supabase.from("team_members").insert(payload);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    setEditing(null);
    toast.success("Team member saved");
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage the team members shown on the home page and /team page.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-start gap-3">
                {m.avatar_url ? (
                  <img
                    src={m.avatar_url}
                    alt={m.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center font-bold">
                    {m.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      #{m.display_order}
                    </span>
                    {m.is_featured && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </span>
                    )}
                    {!m.is_active && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground">
                        <EyeOff className="h-3 w-3" /> Hidden
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {m.bio && (
                <p className="mt-3 text-xs text-muted-foreground line-clamp-3">{m.bio}</p>
              )}
              <div className="mt-4 flex items-center gap-1">
                <button
                  onClick={() => startEdit(m)}
                  className="p-2 hover:bg-muted rounded-md text-foreground/70"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
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
                {editing.id ? "Edit team member" : "New team member"}
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
              <Field label="Role / Title *">
                <input
                  required
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  placeholder="Founder & CEO"
                  className={inputCls}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Photo URL">
                  <input
                    value={editing.avatar_url}
                    onChange={(e) => setEditing({ ...editing, avatar_url: e.target.value })}
                    placeholder="https://..."
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Bio">
                  <textarea
                    rows={3}
                    value={editing.bio}
                    onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                    className={inputCls + " resize-none"}
                  />
                </Field>
              </div>
              <Field label="Facebook URL">
                <input
                  value={editing.facebook_url}
                  onChange={(e) => setEditing({ ...editing, facebook_url: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Instagram URL">
                <input
                  value={editing.instagram_url}
                  onChange={(e) => setEditing({ ...editing, instagram_url: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="LinkedIn URL">
                <input
                  value={editing.linkedin_url}
                  onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Twitter URL">
                <input
                  value={editing.twitter_url}
                  onChange={(e) => setEditing({ ...editing, twitter_url: e.target.value })}
                  className={inputCls}
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
              <div className="flex flex-col gap-3 justify-end">
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

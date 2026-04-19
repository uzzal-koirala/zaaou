import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, KeyRound, UserPlus, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/blog-utils";
import { createAuthorAccount, resetAuthorPassword, removeAuthorAccount } from "@/server/author-accounts.functions";
import type { Database } from "@/integrations/supabase/types";

type Author = Database["public"]["Tables"]["authors"]["Row"];

type AccountModal =
  | { kind: "create"; author: Author }
  | { kind: "reset"; author: Author }
  | null;

export const Route = createFileRoute("/admin/authors")({
  head: () => ({ meta: [{ title: "Authors - Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <AuthorsPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  role: "",
  bio: "",
  avatar_url: "",
  twitter_url: "",
  facebook_url: "",
  linkedin_url: "",
  instagram_url: "",
  website_url: "",
};

function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [accountModal, setAccountModal] = useState<AccountModal>(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountSubmitting, setAccountSubmitting] = useState(false);

  function openCreateAccount(a: Author) {
    setAccountEmail("");
    setAccountPassword("");
    setAccountModal({ kind: "create", author: a });
  }
  function openResetAccount(a: Author) {
    setAccountEmail("");
    setAccountPassword("");
    setAccountModal({ kind: "reset", author: a });
  }
  async function handleAccountSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accountModal) return;
    setAccountSubmitting(true);
    try {
      if (accountModal.kind === "create") {
        await createAuthorAccount({
          data: { authorId: accountModal.author.id, email: accountEmail.trim(), password: accountPassword },
        });
        toast.success(`Login created for ${accountModal.author.name}`);
      } else {
        await resetAuthorPassword({
          data: { authorId: accountModal.author.id, password: accountPassword },
        });
        toast.success("Password reset");
      }
      setAccountModal(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setAccountSubmitting(false);
    }
  }
  async function handleRemoveAccount(a: Author) {
    if (!confirm(`Remove login access for ${a.name}? They will no longer be able to sign in.`)) return;
    try {
      await removeAuthorAccount({ data: { authorId: a.id } });
      toast.success("Login removed");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("authors").select("*").order("name");
    setAuthors(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing(emptyForm);
  }

  function startEdit(a: Author) {
    setEditing({
      id: a.id,
      name: a.name,
      slug: a.slug,
      role: a.role ?? "",
      bio: a.bio ?? "",
      avatar_url: a.avatar_url ?? "",
      twitter_url: a.twitter_url ?? "",
      facebook_url: a.facebook_url ?? "",
      linkedin_url: a.linkedin_url ?? "",
      instagram_url: a.instagram_url ?? "",
      website_url: a.website_url ?? "",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this author? Their posts will lose the author reference.")) return;
    const { error } = await supabase.from("authors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Author deleted");
    load();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      slug: editing.slug.trim() || slugify(editing.name),
      role: editing.role.trim() || null,
      bio: editing.bio.trim() || null,
      avatar_url: editing.avatar_url.trim() || null,
      twitter_url: editing.twitter_url.trim() || null,
      facebook_url: editing.facebook_url.trim() || null,
      linkedin_url: editing.linkedin_url.trim() || null,
      instagram_url: editing.instagram_url.trim() || null,
      website_url: editing.website_url.trim() || null,
    };

    if (editing.id) {
      const { error } = await supabase.from("authors").update(payload).eq("id", editing.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else {
      const { error } = await supabase.from("authors").insert(payload);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    setEditing(null);
    toast.success("Author saved");
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Authors</h1>
          <p className="text-muted-foreground mt-1">Manage author profiles for blog posts.</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New author
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start gap-3">
                {a.avatar_url ? (
                  <img src={a.avatar_url} alt={a.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center font-bold">
                    {a.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{a.name}</p>
                  {a.role && <p className="text-xs text-muted-foreground">{a.role}</p>}
                </div>
              </div>
              {a.bio && <p className="mt-3 text-xs text-muted-foreground line-clamp-3">{a.bio}</p>}
              <div className="mt-3">
                {a.user_id ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Login enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    No login
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-1 flex-wrap">
                <button onClick={() => startEdit(a)} className="p-2 hover:bg-muted rounded-md text-foreground/70" title="Edit profile">
                  <Edit className="h-4 w-4" />
                </button>
                {a.user_id ? (
                  <>
                    <button onClick={() => openResetAccount(a)} className="p-2 hover:bg-muted rounded-md text-foreground/70" title="Reset password">
                      <KeyRound className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleRemoveAccount(a)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md" title="Remove login">
                      <ShieldOff className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => openCreateAccount(a)} className="p-2 hover:bg-primary/10 hover:text-primary rounded-md text-foreground/70" title="Create login">
                    <UserPlus className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(a.id)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md ml-auto" title="Delete author">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {accountModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center p-4">
          <form onSubmit={handleAccountSubmit} className="bg-card border border-border rounded-2xl shadow-glow w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold">
                {accountModal.kind === "create" ? "Create login" : "Reset password"} — {accountModal.author.name}
              </h2>
              <button type="button" onClick={() => setAccountModal(null)} className="p-1.5 hover:bg-muted rounded-md">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {accountModal.kind === "create" && (
                <Field label="Email *">
                  <input
                    type="email"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="author@example.com"
                    className={inputCls}
                  />
                </Field>
              )}
              <Field label="Password *" hint="Min. 8 characters">
                <input
                  type="text"
                  required
                  minLength={8}
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={inputCls}
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                Share these credentials with the author privately. They can sign in at <code className="bg-muted px-1 rounded">/author/login</code> and change their info from their profile.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setAccountModal(null)} className="px-4 py-2.5 text-sm font-semibold text-foreground/70">Cancel</button>
              <button type="submit" disabled={accountSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
                {accountSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {accountModal.kind === "create" ? "Create login" : "Reset password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl shadow-glow w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold">
                {editing.id ? "Edit author" : "New author"}
              </h2>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 hover:bg-muted rounded-md">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name *">
                <input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Slug" hint="Auto if empty">
                <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder={slugify(editing.name)} className={inputCls} />
              </Field>
              <Field label="Role / Title">
                <input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="Editor" className={inputCls} />
              </Field>
              <Field label="Avatar">
                <ImageUpload
                  value={editing.avatar_url}
                  onChange={(url) => setEditing({ ...editing, avatar_url: url })}
                  folder="authors"
                  variant="avatar"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Bio">
                  <textarea rows={3} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} className={inputCls + " resize-none"} />
                </Field>
              </div>
              <Field label="Twitter / X URL"><input value={editing.twitter_url} onChange={(e) => setEditing({ ...editing, twitter_url: e.target.value })} className={inputCls} /></Field>
              <Field label="Facebook URL"><input value={editing.facebook_url} onChange={(e) => setEditing({ ...editing, facebook_url: e.target.value })} className={inputCls} /></Field>
              <Field label="LinkedIn URL"><input value={editing.linkedin_url} onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })} className={inputCls} /></Field>
              <Field label="Instagram URL"><input value={editing.instagram_url} onChange={(e) => setEditing({ ...editing, instagram_url: e.target.value })} className={inputCls} /></Field>
              <div className="sm:col-span-2">
                <Field label="Website URL"><input value={editing.website_url} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} className={inputCls} /></Field>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 text-sm font-semibold text-foreground/70">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const inputCls = "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

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

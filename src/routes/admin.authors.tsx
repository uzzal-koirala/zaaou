import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, Mail, KeyRound, ShieldOff, LogIn, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/blog-utils";
import {
  createAuthorAccount,
  updateAuthorAccount,
  removeAuthorAccount,
  listAuthorAccountEmails,
} from "@/server/author-accounts.functions";
import { callWithAuth } from "@/lib/server-fn-auth";
import type { Database } from "@/integrations/supabase/types";

type Author = Database["public"]["Tables"]["authors"]["Row"];

type AccountModal =
  | { kind: "create"; author: Author }
  | { kind: "edit"; author: Author; currentEmail: string }
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
  const [emails, setEmails] = useState<Record<string, string>>({});

  function openCreateAccount(a: Author) {
    setAccountEmail("");
    setAccountPassword("");
    setAccountModal({ kind: "create", author: a });
  }
  function openEditAccount(a: Author) {
    const current = emails[a.id] ?? "";
    setAccountEmail(current);
    setAccountPassword("");
    setAccountModal({ kind: "edit", author: a, currentEmail: current });
  }
  async function handleAccountSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accountModal) return;
    setAccountSubmitting(true);
    try {
      if (accountModal.kind === "create") {
        await callWithAuth(createAuthorAccount, {
          authorId: accountModal.author.id,
          email: accountEmail.trim(),
          password: accountPassword,
        });
        toast.success(`Login created for ${accountModal.author.name}`);
      } else {
        const email = accountEmail.trim();
        const emailChanged = email && email !== accountModal.currentEmail;
        const payload: { authorId: string; email?: string; password?: string } = {
          authorId: accountModal.author.id,
        };
        if (emailChanged) payload.email = email;
        if (accountPassword) payload.password = accountPassword;
        if (!payload.email && !payload.password) {
          toast.error("Change the email or set a new password");
          setAccountSubmitting(false);
          return;
        }
        await callWithAuth(updateAuthorAccount, payload);
        toast.success("Login updated");
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
      await callWithAuth(removeAuthorAccount, { authorId: a.id });
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
    // Load emails (admin-only)
    try {
      const map = await callWithAuth(listAuthorAccountEmails, undefined as never);
      setEmails(map);
    } catch {
      // not fatal
    }
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
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col">
              <div className="flex items-start gap-3">
                {a.avatar_url ? (
                  <img src={a.avatar_url} alt={a.name} className="h-14 w-14 rounded-xl object-cover ring-1 ring-border" />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-lg">
                    {a.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{a.name}</p>
                  {a.role && <p className="text-xs text-muted-foreground truncate">{a.role}</p>}
                  {a.user_id && emails[a.id] && (
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground truncate max-w-full">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{emails[a.id]}</span>
                    </p>
                  )}
                </div>
              </div>
              {a.bio && <p className="mt-3 text-xs text-muted-foreground line-clamp-3">{a.bio}</p>}
              <div className="mt-3">
                {a.user_id ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    <KeyRound className="h-3 w-3" /> Login enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    No login
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                {a.user_id ? (
                  <button
                    onClick={() => openEditAccount(a)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary px-2.5 py-1.5 text-xs font-semibold transition-colors"
                    title="Change email or password"
                  >
                    <Settings2 className="h-3.5 w-3.5" /> Manage login
                  </button>
                ) : (
                  <button
                    onClick={() => openCreateAccount(a)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 px-2.5 py-1.5 text-xs font-semibold transition-opacity"
                    title="Create login credentials"
                  >
                    <LogIn className="h-3.5 w-3.5" /> Create login
                  </button>
                )}
                <button
                  onClick={() => startEdit(a)}
                  className="p-1.5 hover:bg-muted rounded-md text-foreground/70"
                  title="Edit profile"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {a.user_id && (
                  <button
                    onClick={() => handleRemoveAccount(a)}
                    className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md"
                    title="Remove login"
                  >
                    <ShieldOff className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md ml-auto"
                  title="Delete author"
                >
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
                {accountModal.kind === "create" ? "Create login" : "Manage login"} — {accountModal.author.name}
              </h2>
              <button type="button" onClick={() => setAccountModal(null)} className="p-1.5 hover:bg-muted rounded-md">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <Field label={accountModal.kind === "create" ? "Email *" : "Email"}>
                <input
                  type="email"
                  required={accountModal.kind === "create"}
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="author@example.com"
                  className={inputCls}
                />
              </Field>
              <Field
                label={accountModal.kind === "create" ? "Password *" : "New password"}
                hint={accountModal.kind === "create" ? "Min. 8 characters" : "Leave blank to keep current"}
              >
                <input
                  type="text"
                  required={accountModal.kind === "create"}
                  minLength={accountModal.kind === "create" ? 8 : undefined}
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder={accountModal.kind === "create" ? "At least 8 characters" : "Set a new password (optional)"}
                  className={inputCls}
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                Share these credentials with the author privately. They can sign in at <code className="bg-muted px-1 rounded">/author/login</code>.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setAccountModal(null)} className="px-4 py-2.5 text-sm font-semibold text-foreground/70">Cancel</button>
              <button type="submit" disabled={accountSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
                {accountSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {accountModal.kind === "create" ? "Create login" : "Save changes"}
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
                  variant="square"
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

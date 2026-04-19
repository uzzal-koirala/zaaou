import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AuthorGuard } from "@/components/author/AuthorGuard";
import { AuthorLayout } from "@/components/author/AuthorLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/author/profile")({
  head: () => ({ meta: [{ title: "My profile - Author" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AuthorGuard>
      <AuthorLayout>
        <ProfilePage />
      </AuthorLayout>
    </AuthorGuard>
  ),
});

type FormState = {
  role: string;
  bio: string;
  avatar_url: string;
  twitter_url: string;
  facebook_url: string;
  linkedin_url: string;
  instagram_url: string;
  website_url: string;
};

function ProfilePage() {
  const { author, refreshAuthor } = useAuth();
  const [form, setForm] = useState<FormState>({
    role: "",
    bio: "",
    avatar_url: "",
    twitter_url: "",
    facebook_url: "",
    linkedin_url: "",
    instagram_url: "",
    website_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!author?.id) return;
    (async () => {
      const { data } = await supabase.from("authors").select("*").eq("id", author.id).maybeSingle();
      if (data) {
        setForm({
          role: data.role ?? "",
          bio: data.bio ?? "",
          avatar_url: data.avatar_url ?? "",
          twitter_url: data.twitter_url ?? "",
          facebook_url: data.facebook_url ?? "",
          linkedin_url: data.linkedin_url ?? "",
          instagram_url: data.instagram_url ?? "",
          website_url: data.website_url ?? "",
        });
      }
      setLoading(false);
    })();
  }, [author?.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!author?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from("authors")
      .update({
        role: form.role.trim() || null,
        bio: form.bio.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
        twitter_url: form.twitter_url.trim() || null,
        facebook_url: form.facebook_url.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        instagram_url: form.instagram_url.trim() || null,
        website_url: form.website_url.trim() || null,
      })
      .eq("id", author.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    refreshAuthor();
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
      <h1 className="font-display text-3xl font-bold mb-2">My profile</h1>
      <p className="text-muted-foreground mb-6">
        This is shown on your author page and at the top of every post you publish.
      </p>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Name" hint="Edited by admin">
            <input value={author?.name ?? ""} disabled className={inputCls + " opacity-60"} />
          </Field>
          <Field label="Role / Title">
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Editor, Food Writer, etc."
              className={inputCls}
            />
          </Field>
          <Field label="Avatar">
            <ImageUpload
              value={form.avatar_url}
              onChange={(url) => setForm({ ...form, avatar_url: url })}
              folder="authors"
              variant="square"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Bio">
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className={inputCls + " resize-none"}
              />
            </Field>
          </div>
          <Field label="Twitter / X URL">
            <input value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Facebook URL">
            <input value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} className={inputCls} />
          </Field>
          <Field label="LinkedIn URL">
            <input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Instagram URL">
            <input value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} className={inputCls} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Website URL">
              <input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
          </button>
        </div>
      </form>
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

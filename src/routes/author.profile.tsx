import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Loader2,
  Save,
  User,
  Sparkles,
  Globe,
  CheckCircle2,
  Circle,
  ExternalLink,
  Mail,
  Camera,
} from "lucide-react";
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

const BIO_MAX = 280;

function ProfilePage() {
  const { author, user, refreshAuthor } = useAuth();
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
  const [authorSlug, setAuthorSlug] = useState<string>("");

  useEffect(() => {
    if (!author?.id) return;
    (async () => {
      const { data } = await supabase.from("authors").select("*").eq("id", author.id).maybeSingle();
      if (data) {
        setAuthorSlug(data.slug ?? "");
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

  const completeness = useMemo(() => {
    const checks = [
      { key: "avatar", label: "Add an avatar", done: !!form.avatar_url.trim() },
      { key: "role", label: "Set your role", done: !!form.role.trim() },
      { key: "bio", label: "Write a bio", done: form.bio.trim().length >= 40 },
      {
        key: "social",
        label: "Add a social link",
        done: !!(
          form.twitter_url.trim() ||
          form.facebook_url.trim() ||
          form.linkedin_url.trim() ||
          form.instagram_url.trim()
        ),
      },
      { key: "website", label: "Add your website", done: !!form.website_url.trim() },
    ];
    const done = checks.filter((c) => c.done).length;
    return { checks, done, total: checks.length, pct: Math.round((done / checks.length) * 100) };
  }, [form]);

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

  const initials = author?.name?.[0]?.toUpperCase() ?? "A";
  const bioLen = form.bio.length;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">My profile</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            This is shown on your author page and at the top of every post you publish.
          </p>
        </div>
        {authorSlug && (
          <a
            href={`/blog/author/${authorSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card hover:bg-muted px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors shadow-soft"
          >
            <ExternalLink className="h-4 w-4" /> View public page
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-5">
        {/* Left column — preview & completeness */}
        <aside className="lg:col-span-1 space-y-5">
          {/* Profile preview card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="h-24 bg-gradient-primary relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.6), transparent 60%)" }} />
            </div>
            <div className="px-5 pb-5 -mt-12">
              <div className="relative inline-block">
                {form.avatar_url ? (
                  <img
                    src={form.avatar_url}
                    alt="Avatar preview"
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-card shadow-card"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground grid place-items-center text-3xl font-bold ring-4 ring-card shadow-card">
                    {initials}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="font-display text-xl font-bold leading-tight">{author?.name ?? "Your name"}</p>
                {form.role.trim() ? (
                  <p className="text-sm text-primary font-semibold mt-0.5">{form.role}</p>
                ) : (
                  <p className="text-xs text-muted-foreground italic mt-0.5">Add your role below</p>
                )}
                {user?.email && (
                  <p className="text-xs text-muted-foreground mt-1.5 inline-flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> {user.email}
                  </p>
                )}
                {form.bio.trim() ? (
                  <p className="mt-3 text-sm text-foreground/75 leading-relaxed line-clamp-4">{form.bio}</p>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground italic">
                    Your bio will appear here. Tell readers about yourself.
                  </p>
                )}
                {/* Social preview */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {form.website_url && <SocialDot icon={Globe} href={form.website_url} />}
                  {form.twitter_url && <SocialDot icon={XIcon} href={form.twitter_url} />}
                  {form.facebook_url && <SocialDot icon={Facebook} href={form.facebook_url} />}
                  {form.linkedin_url && <SocialDot icon={Linkedin} href={form.linkedin_url} />}
                  {form.instagram_url && <SocialDot icon={Instagram} href={form.instagram_url} />}
                  {!form.website_url &&
                    !form.twitter_url &&
                    !form.facebook_url &&
                    !form.linkedin_url &&
                    !form.instagram_url && (
                      <p className="text-[11px] text-muted-foreground italic">No social links yet</p>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Completeness card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(completeness.pct / 100) * 97.39} 97.39`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-xs font-bold">{completeness.pct}%</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-sm flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Profile strength
                </p>
                <p className="text-xs text-muted-foreground">
                  {completeness.done} of {completeness.total} completed
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              {completeness.checks.map((c) => (
                <li key={c.key} className="flex items-center gap-2 text-sm">
                  {c.done ? (
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={c.done ? "text-foreground/60 line-through" : "text-foreground/85"}>
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right column — form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basics */}
          <Section
            icon={User}
            title="Basics"
            description="Your name and role displayed across the site."
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name" hint="Edited by admin">
                <input value={author?.name ?? ""} disabled className={inputCls + " opacity-60 cursor-not-allowed"} />
              </Field>
              <Field label="Role / Title">
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Editor, Food Writer, etc."
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          {/* Avatar & bio */}
          <Section
            icon={Camera}
            title="Avatar & bio"
            description="A friendly photo and short intro help readers connect with you."
          >
            <div className="grid sm:grid-cols-[180px,1fr] gap-5">
              <Field label="Avatar">
                <ImageUpload
                  value={form.avatar_url}
                  onChange={(url) => setForm({ ...form, avatar_url: url })}
                  folder="authors"
                  variant="square"
                />
              </Field>
              <Field
                label="Bio"
                hint={`${bioLen}/${BIO_MAX}`}
                hintClass={bioLen > BIO_MAX ? "text-destructive" : "text-muted-foreground"}
              >
                <textarea
                  rows={6}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="A short bio about yourself, your interests, and what you write about…"
                  className={inputCls + " resize-none"}
                />
              </Field>
            </div>
          </Section>

          {/* Social */}
          <Section
            icon={Globe}
            title="Social & web"
            description="Add your links so readers can follow you elsewhere."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <SocialField
                label="Website"
                icon={Globe}
                value={form.website_url}
                onChange={(v) => setForm({ ...form, website_url: v })}
                placeholder="https://yoursite.com"
              />
              <SocialField
                label="Twitter / X"
                icon={XIcon}
                value={form.twitter_url}
                onChange={(v) => setForm({ ...form, twitter_url: v })}
                placeholder="https://x.com/username"
              />
              <SocialField
                label="Facebook"
                icon={Facebook}
                value={form.facebook_url}
                onChange={(v) => setForm({ ...form, facebook_url: v })}
                placeholder="https://facebook.com/username"
              />
              <SocialField
                label="LinkedIn"
                icon={Linkedin}
                value={form.linkedin_url}
                onChange={(v) => setForm({ ...form, linkedin_url: v })}
                placeholder="https://linkedin.com/in/username"
              />
              <SocialField
                label="Instagram"
                icon={Instagram}
                value={form.instagram_url}
                onChange={(v) => setForm({ ...form, instagram_url: v })}
                placeholder="https://instagram.com/username"
              />
            </div>
          </Section>

          {/* Sticky save bar */}
          <div className="sticky bottom-4 z-10">
            <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-card px-5 py-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground hidden sm:block">
                Changes save to your public author profile.
              </p>
              <button
                type="submit"
                disabled={saving || bioLen > BIO_MAX}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-soft"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors placeholder:text-muted-foreground/60";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof User;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft">
      <header className="flex items-start gap-3 mb-5">
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center flex-shrink-0">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  hintClass,
  children,
}: {
  label: string;
  hint?: string;
  hintClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center justify-between text-xs font-semibold text-foreground/80 mb-1.5">
        <span>{label}</span>
        {hint && <span className={`font-normal ${hintClass ?? "text-muted-foreground"}`}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SocialField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls + " pl-9"}
        />
      </div>
    </div>
  );
}

function SocialDot({
  icon: Icon,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-7 w-7 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground/70 grid place-items-center transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Facebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06z" />
    </svg>
  );
}

function Instagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 11.001-4.121A2.06 2.06 0 015.34 7.43zM7.12 20.45H3.56V9h3.56z" />
      <path d="M22 0H2C.9 0 0 .88 0 1.96v20.07C0 23.12.9 24 2 24h20c1.1 0 2-.88 2-1.97V1.96C24 .88 23.1 0 22 0z" fillOpacity="0" />
    </svg>
  );
}

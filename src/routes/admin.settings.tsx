import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save, Globe, Phone, Share2, Search, Wrench, Palette, MessageSquare, Bell } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminTheme } from "@/hooks/use-admin-theme";
import { supabase } from "@/integrations/supabase/client";
import type { SiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings - Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <SettingsPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const SELECT_COLS =
  "id, comments_enabled, comments_auto_approve, notifications_enabled, site_name, site_tagline, site_logo_url, contact_phone_primary, contact_phone_secondary, contact_email, contact_address, contact_whatsapp, social_facebook_url, social_instagram_url, social_tiktok_url, social_youtube_url, social_twitter_url, social_linkedin_url, seo_default_title, seo_default_description, seo_default_og_image_url, maintenance_mode, maintenance_message";

function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_settings")
        .select(SELECT_COLS)
        .eq("singleton", true)
        .maybeSingle();
      setSettings(data as SiteSettings | null);
      setLoading(false);
    })();
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { id, ...rest } = settings;
    const { error } = await supabase.from("blog_settings").update(rest).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!settings) {
    return <p className="text-muted-foreground">No settings record found.</p>;
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Site settings</h1>
          <p className="text-muted-foreground">Control the appearance, contact details, and behavior of your site.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-50 shadow-soft"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save all settings
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        <ThemeCard />

        <Card icon={Globe} title="Site identity" description="Your brand name, tagline and logo. Shown in the header, footer and SEO.">
          <Field label="Site name">
            <Input value={settings.site_name} onChange={(v) => update("site_name", v)} />
          </Field>
          <Field label="Tagline" description="Short one-liner shown in the footer.">
            <Input value={settings.site_tagline} onChange={(v) => update("site_tagline", v)} />
          </Field>
          <Field label="Logo">
            <ImageUpload
              value={settings.site_logo_url ?? ""}
              onChange={(url) => update("site_logo_url", url || null)}
              folder="site"
              variant="square"
            />
          </Field>
        </Card>

        <Card icon={Phone} title="Contact info" description="These are used in the footer, contact CTAs and the WhatsApp button.">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Primary phone">
              <Input value={settings.contact_phone_primary} onChange={(v) => update("contact_phone_primary", v)} />
            </Field>
            <Field label="Secondary phone">
              <Input value={settings.contact_phone_secondary} onChange={(v) => update("contact_phone_secondary", v)} />
            </Field>
          </div>
          <Field label="Email">
            <Input value={settings.contact_email} onChange={(v) => update("contact_email", v)} type="email" />
          </Field>
          <Field label="Address">
            <Input value={settings.contact_address} onChange={(v) => update("contact_address", v)} />
          </Field>
          <Field label="WhatsApp number" description="Digits only or with country code (e.g. +977 9705047000). Used by the floating WhatsApp button.">
            <Input value={settings.contact_whatsapp} onChange={(v) => update("contact_whatsapp", v)} />
          </Field>
        </Card>

        <Card icon={Share2} title="Social media links" description="Leave a field empty to hide that icon from the footer.">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Facebook URL">
              <Input value={settings.social_facebook_url ?? ""} onChange={(v) => update("social_facebook_url", v || null)} placeholder="https://facebook.com/yourpage" />
            </Field>
            <Field label="Instagram URL">
              <Input value={settings.social_instagram_url ?? ""} onChange={(v) => update("social_instagram_url", v || null)} placeholder="https://instagram.com/yourhandle" />
            </Field>
            <Field label="TikTok URL">
              <Input value={settings.social_tiktok_url ?? ""} onChange={(v) => update("social_tiktok_url", v || null)} placeholder="https://tiktok.com/@yourhandle" />
            </Field>
            <Field label="YouTube URL">
              <Input value={settings.social_youtube_url ?? ""} onChange={(v) => update("social_youtube_url", v || null)} placeholder="https://youtube.com/@yourchannel" />
            </Field>
            <Field label="Twitter / X URL">
              <Input value={settings.social_twitter_url ?? ""} onChange={(v) => update("social_twitter_url", v || null)} placeholder="https://x.com/yourhandle" />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={settings.social_linkedin_url ?? ""} onChange={(v) => update("social_linkedin_url", v || null)} placeholder="https://linkedin.com/company/yourcompany" />
            </Field>
          </div>
        </Card>

        <Card icon={Search} title="SEO defaults" description="Used on pages that don't define their own metadata, and as fallbacks for social sharing.">
          <Field label="Default page title">
            <Input value={settings.seo_default_title} onChange={(v) => update("seo_default_title", v)} />
          </Field>
          <Field label="Default meta description" description="Aim for 150-160 characters.">
            <Textarea value={settings.seo_default_description} onChange={(v) => update("seo_default_description", v)} rows={3} />
          </Field>
          <Field label="Default share image (Open Graph)" description="1200×630px works best for Facebook, LinkedIn, X.">
            <ImageUpload
              value={settings.seo_default_og_image_url ?? ""}
              onChange={(url) => update("seo_default_og_image_url", url || null)}
              folder="seo"
              variant="cover"
            />
          </Field>
        </Card>

        <Card icon={Wrench} title="Maintenance mode" description="Show a 'we'll be right back' page to public visitors. Admin and author dashboards always stay open.">
          <Toggle
            label="Maintenance mode"
            description="When ON, public pages display the message below instead of the normal site."
            value={settings.maintenance_mode}
            onChange={(v) => update("maintenance_mode", v)}
          />
          <Field label="Message shown to visitors">
            <Textarea
              value={settings.maintenance_message}
              onChange={(v) => update("maintenance_message", v)}
              rows={3}
            />
          </Field>
        </Card>

        <Card icon={MessageSquare} title="Comments" description="Control how blog comments behave.">
          <Toggle
            label="Comments enabled"
            description="When off, no new comments can be submitted on any post."
            value={settings.comments_enabled}
            onChange={(v) => update("comments_enabled", v)}
          />
          <Toggle
            label="Auto-approve new comments"
            description="When on, comments are published instantly. When off, they wait for approval."
            value={settings.comments_auto_approve}
            onChange={(v) => update("comments_auto_approve", v)}
          />
        </Card>

        <Card icon={Bell} title="Notifications" description="Control the social-proof popups shown across the site.">
          <Toggle
            label="Show notification popups"
            description="Master switch for the rotating notification popups on the home page."
            value={settings.notifications_enabled}
            onChange={(v) => update("notifications_enabled", v)}
          />
        </Card>

        <div className="pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-50 shadow-soft"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save all settings
          </button>
        </div>
      </div>
    </>
  );
}

/* ----------------- helpers ----------------- */

function ThemeCard() {
  const { theme, setTheme } = useAdminTheme();
  return (
    <Card icon={Palette} title="Admin appearance" description="Switch between light and dark mode for the admin dashboard. Public site is unaffected.">
      <div className="flex gap-2">
        <button
          onClick={() => setTheme("light")}
          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${theme === "light" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
        >
          ☀️ Light mode
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${theme === "dark" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
        >
          🌙 Dark mode
        </button>
      </div>
    </Card>
  );
}

function Card({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <header className="flex items-start gap-3 mb-5 pb-4 border-b border-border">
        <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-foreground/80">{label}</label>
      {children}
      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
    />
  );
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
    />
  );
}

function Toggle({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </label>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";

type Settings = {
  id: string;
  comments_enabled: boolean;
  comments_auto_approve: boolean;
};

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <SettingsPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_settings")
        .select("id, comments_enabled, comments_auto_approve")
        .eq("singleton", true)
        .maybeSingle();
      setSettings(data);
      setLoading(false);
    })();
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("blog_settings")
      .update({
        comments_enabled: settings.comments_enabled,
        comments_auto_approve: settings.comments_auto_approve,
      })
      .eq("id", settings.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!settings) {
    return <p className="text-muted-foreground">No settings record found.</p>;
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold mb-2">Blog settings</h1>
      <p className="text-muted-foreground mb-8">Control how comments behave across the blog.</p>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft max-w-2xl space-y-5">
        <Toggle
          label="Comments enabled"
          description="When off, no new comments can be submitted on any post."
          value={settings.comments_enabled}
          onChange={(v) => setSettings({ ...settings, comments_enabled: v })}
        />
        <Toggle
          label="Auto-approve new comments"
          description="When on, comments are published instantly. When off, they wait for your approval in the Comments page."
          value={settings.comments_auto_approve}
          onChange={(v) => setSettings({ ...settings, comments_auto_approve: v })}
        />
        <div className="pt-3 border-t border-border">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save settings
          </button>
        </div>
      </div>
    </>
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
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}

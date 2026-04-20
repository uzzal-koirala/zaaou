import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, EyeOff, ShieldQuestion, Lock } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Question = Database["public"]["Tables"]["login_gate_questions"]["Row"];
type Audience = "admin" | "author";

export const Route = createFileRoute("/admin/login-gate")({
  head: () => ({
    meta: [{ title: "Login security - Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <LoginGatePage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const emptyForm = {
  id: "",
  audience: "admin" as Audience,
  question: "",
  answer: "",
  display_order: 0,
  is_active: true,
};

function LoginGatePage() {
  const [items, setItems] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);

  // Settings
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [count, setCount] = useState<1 | 2>(1);
  const [savingSettings, setSavingSettings] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: questions }, { data: settings }] = await Promise.all([
      supabase
        .from("login_gate_questions")
        .select("*")
        .order("audience", { ascending: true })
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("blog_settings")
        .select("id, login_gate_enabled, login_gate_question_count")
        .eq("singleton", true)
        .maybeSingle(),
    ]);
    setItems(questions ?? []);
    if (settings) {
      setSettingsId(settings.id);
      setEnabled(settings.login_gate_enabled);
      setCount((settings.login_gate_question_count === 2 ? 2 : 1) as 1 | 2);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSettings(next: { enabled?: boolean; count?: 1 | 2 }) {
    if (!settingsId) return;
    setSavingSettings(true);
    const payload: Database["public"]["Tables"]["blog_settings"]["Update"] = {};
    if (next.enabled !== undefined) payload.login_gate_enabled = next.enabled;
    if (next.count !== undefined) payload.login_gate_question_count = next.count;
    const { error } = await supabase.from("blog_settings").update(payload).eq("id", settingsId);
    setSavingSettings(false);
    if (error) return toast.error(error.message);
    if (next.enabled !== undefined) setEnabled(next.enabled);
    if (next.count !== undefined) setCount(next.count);
    toast.success("Saved");
  }

  function startNew(audience: Audience) {
    setEditing({
      ...emptyForm,
      audience,
      display_order: items.filter((i) => i.audience === audience).length + 1,
    });
  }

  function startEdit(q: Question) {
    setEditing({
      id: q.id,
      audience: q.audience as Audience,
      question: q.question,
      answer: q.answer,
      display_order: q.display_order,
      is_active: q.is_active,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this question?")) return;
    const { error } = await supabase.from("login_gate_questions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Question deleted");
    load();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      audience: editing.audience,
      question: editing.question.trim(),
      answer: editing.answer,
      display_order: Number(editing.display_order) || 0,
      is_active: editing.is_active,
    };

    if (editing.id) {
      const { error } = await supabase
        .from("login_gate_questions")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else {
      const { error } = await supabase.from("login_gate_questions").insert(payload);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    setEditing(null);
    toast.success("Question saved");
    load();
  }

  const adminQuestions = items.filter((i) => i.audience === "admin");
  const authorQuestions = items.filter((i) => i.audience === "author");

  return (
    <>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Lock className="h-3 w-3" /> Pre-login gate
        </div>
        <h1 className="font-display text-3xl font-bold">Login security questions</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Visitors must answer one of these before they can see the admin or author sign-in form.
          Answers are case-sensitive. After 5 wrong attempts the gate locks for 15 minutes.
        </p>
      </div>

      {/* Global settings */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft mb-6 grid sm:grid-cols-2 gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-sm">Enable security gate</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              When off, visitors go directly to the sign-in form.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={savingSettings || !settingsId}
            onClick={() => saveSettings({ enabled: !enabled })}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              enabled ? "bg-primary" : "bg-muted"
            } disabled:opacity-50`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div>
          <p className="font-semibold text-sm">Number of questions to ask</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">
            Picked at random from active questions for that audience.
          </p>
          <div className="inline-flex rounded-xl border border-border p-1 bg-background">
            {[1, 2].map((n) => (
              <button
                key={n}
                type="button"
                disabled={savingSettings}
                onClick={() => saveSettings({ count: n as 1 | 2 })}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  count === n ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"
                }`}
              >
                {n} question{n > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <AudienceSection
            title="Admin sign-in questions"
            description="Shown before /auth (admin login)."
            items={adminQuestions}
            onAdd={() => startNew("admin")}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
          <AudienceSection
            title="Author sign-in questions"
            description="Shown before /author/login."
            items={authorQuestions}
            onAdd={() => startNew("author")}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
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
                {editing.id ? "Edit question" : "New question"}
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
              <Field label="Audience *">
                <div className="inline-flex rounded-xl border border-border p-1 bg-background">
                  {(["admin", "author"] as Audience[]).map((a) => (
                    <button
                      type="button"
                      key={a}
                      onClick={() => setEditing({ ...editing, audience: a })}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                        editing.audience === a
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/70 hover:bg-muted"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Question *">
                <textarea
                  required
                  rows={2}
                  value={editing.question}
                  onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                  className={inputCls + " resize-none"}
                  placeholder="What is our office street name?"
                  maxLength={300}
                />
              </Field>
              <Field
                label="Correct answer *"
                hint="Case-sensitive. Whatever the user types must match this exactly."
              >
                <input
                  required
                  value={editing.answer}
                  onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                  className={inputCls}
                  placeholder="Itahari Chowk"
                  maxLength={200}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Display order" hint="Lower = higher priority">
                  <input
                    type="number"
                    value={editing.display_order}
                    onChange={(e) =>
                      setEditing({ ...editing, display_order: Number(e.target.value) })
                    }
                    className={inputCls}
                  />
                </Field>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer self-end pb-2">
                  <input
                    type="checkbox"
                    checked={editing.is_active}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  Active (include in pool)
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

function AudienceSection({
  title,
  description,
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  description: string;
  items: Question[];
  onAdd: () => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold shadow-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Add question
        </button>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <ShieldQuestion className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            No questions yet. With no questions, the gate is bypassed for this audience.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((q) => (
            <div key={q.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-sm font-medium leading-snug">{q.question}</p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Answer:{" "}
                <span className="font-mono text-foreground/80 bg-muted px-1.5 py-0.5 rounded">
                  {q.answer}
                </span>
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>#{q.display_order}</span>
                  {!q.is_active && (
                    <span className="inline-flex items-center gap-0.5 font-semibold">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(q)}
                    className="p-1.5 hover:bg-muted rounded-md text-foreground/70"
                    title="Edit"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(q.id)}
                    className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
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

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Loader2, X, EyeOff, Briefcase, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Job = Database["public"]["Tables"]["job_postings"]["Row"];

export const Route = createFileRoute("/admin/jobs")({
  head: () => ({
    meta: [{ title: "Jobs - Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <JobsAdminPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

const DEPARTMENTS = ["Operations", "Engineering", "Partnerships", "Marketing", "Customer Support", "Finance", "General"];
const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"];

const emptyForm = {
  id: "",
  title: "",
  department: "Operations",
  job_type: "Full-time",
  location: "Itahari",
  description: "",
  apply_url: "",
  display_order: 0,
  is_active: true,
};

function JobsAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("job_postings")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    setJobs(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({ ...emptyForm, display_order: jobs.length + 1 });
  }

  function startEdit(j: Job) {
    setEditing({
      id: j.id,
      title: j.title,
      department: j.department,
      job_type: j.job_type,
      location: j.location,
      description: j.description,
      apply_url: j.apply_url,
      display_order: j.display_order,
      is_active: j.is_active,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job posting?")) return;
    const { error } = await supabase.from("job_postings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Job deleted");
    load();
  }

  function validateUrl(u: string): string | null {
    const trimmed = u.trim();
    if (!trimmed) return "Apply link is required";
    // Allow http(s), mailto, tel, wa.me etc.
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
      return "Link must start with http://, https://, mailto: or tel:";
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const urlErr = validateUrl(editing.apply_url);
    if (urlErr) return toast.error(urlErr);
    if (!editing.title.trim()) return toast.error("Title is required");
    if (!editing.description.trim()) return toast.error("Description is required");

    setSaving(true);
    const payload = {
      title: editing.title.trim(),
      department: editing.department.trim() || "General",
      job_type: editing.job_type.trim() || "Full-time",
      location: editing.location.trim() || "Itahari",
      description: editing.description.trim(),
      apply_url: editing.apply_url.trim(),
      display_order: Number(editing.display_order) || 0,
      is_active: editing.is_active,
    };

    if (editing.id) {
      const { error } = await supabase.from("job_postings").update(payload).eq("id", editing.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else {
      const { error } = await supabase.from("job_postings").insert(payload);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }
    setSaving(false);
    setEditing(null);
    toast.success("Job saved");
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-1">
            Manage open roles shown on the /careers page.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-soft"
        >
          <Plus className="h-4 w-4" /> New job
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No job postings yet. Click "New job" to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                    {j.department}
                  </span>
                  <span className="text-[10px] text-muted-foreground">#{j.display_order}</span>
                  {!j.is_active && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg leading-tight">{j.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{j.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {j.location}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3 text-primary" /> {j.job_type}</span>
                  <a
                    href={j.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline truncate max-w-[260px]"
                  >
                    <ExternalLink className="h-3 w-3" /> {j.apply_url}
                  </a>
                </div>
              </div>
              <div className="flex sm:flex-col items-center gap-1">
                <button
                  onClick={() => startEdit(j)}
                  className="p-2 hover:bg-muted rounded-md text-foreground/70"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(j.id)}
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
                {editing.id ? "Edit job" : "New job"}
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
              <div className="sm:col-span-2">
                <Field label="Job title *">
                  <input
                    required
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className={inputCls}
                    placeholder="Delivery Rider"
                    maxLength={120}
                  />
                </Field>
              </div>
              <Field label="Department *">
                <select
                  value={editing.department}
                  onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                  className={inputCls}
                >
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Job type *">
                <select
                  value={editing.job_type}
                  onChange={(e) => setEditing({ ...editing, job_type: e.target.value })}
                  className={inputCls}
                >
                  {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Location *">
                  <input
                    required
                    value={editing.location}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                    className={inputCls}
                    placeholder="Itahari (On-site)"
                    maxLength={120}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description *">
                  <textarea
                    required
                    rows={4}
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className={inputCls + " resize-none"}
                    placeholder="What the role is about, responsibilities, requirements..."
                    maxLength={1500}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Apply now link *"
                  hint="Where the Apply button takes the user (https://, mailto:, or tel:)"
                >
                  <input
                    required
                    type="text"
                    value={editing.apply_url}
                    onChange={(e) => setEditing({ ...editing, apply_url: e.target.value })}
                    className={inputCls}
                    placeholder="https://forms.gle/... or mailto:careers@zaaoufoods.com"
                    maxLength={500}
                  />
                </Field>
              </div>
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
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_active}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  Active (shown on careers page)
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

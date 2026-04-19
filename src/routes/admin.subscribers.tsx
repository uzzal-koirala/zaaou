import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Mail,
  Search,
  Download,
  Trash2,
  UserMinus,
  UserCheck,
  Users,
  Inbox,
  Send,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Subscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

export const Route = createFileRoute("/admin/subscribers")({
  head: () => ({
    meta: [
      { title: "Newsletter Subscribers - Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <SubscribersPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

function SubscribersPage() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("active");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "active" && r.unsubscribed_at) return false;
      if (filter === "unsubscribed" && !r.unsubscribed_at) return false;
      if (!q) return true;
      return (
        r.email.toLowerCase().includes(q) ||
        (r.name?.toLowerCase().includes(q) ?? false) ||
        (r.source?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, query, filter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => !r.unsubscribed_at).length;
    const unsubscribed = total - active;
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const last7 = rows.filter((r) => new Date(r.created_at).getTime() >= since).length;
    return { total, active, unsubscribed, last7 };
  }, [rows]);

  async function handleUnsubscribe(row: Subscriber) {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success(`${row.email} unsubscribed`);
    load();
  }

  async function handleResubscribe(row: Subscriber) {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: null })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success(`${row.email} re-subscribed`);
    load();
  }

  async function handleDelete(row: Subscriber) {
    if (!confirm(`Permanently delete ${row.email}?`)) return;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  function exportCsv() {
    const data = filtered;
    if (!data.length) {
      toast.error("Nothing to export");
      return;
    }
    const header = ["Name", "Email", "Source", "Status", "Subscribed at", "Unsubscribed at"];
    const rowsCsv = data.map((r) => [
      r.name ?? "",
      r.email,
      r.source ?? "",
      r.unsubscribed_at ? "unsubscribed" : "active",
      r.created_at,
      r.unsubscribed_at ?? "",
    ]);
    const csv = [header, ...rowsCsv]
      .map((line) =>
        line
          .map((v) => {
            const s = String(v ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function copyAllEmails() {
    const list = filtered
      .filter((r) => !r.unsubscribed_at)
      .map((r) => r.email)
      .join(", ");
    if (!list) {
      toast.error("No active emails to copy");
      return;
    }
    navigator.clipboard.writeText(list);
    toast.success(`Copied ${filtered.filter((r) => !r.unsubscribed_at).length} emails`);
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Mail className="h-7 w-7 text-primary" /> Newsletter
          </h1>
          <p className="text-muted-foreground mt-1">
            Subscribers collected from the website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyAllEmails}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold hover:bg-muted transition-colors"
            title="Copy active emails to clipboard"
          >
            <Send className="h-4 w-4" /> Copy emails
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-soft hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} icon={Users} tone="default" />
        <StatCard label="Active" value={stats.active} icon={UserCheck} tone="primary" />
        <StatCard label="Unsubscribed" value={stats.unsubscribed} icon={UserMinus} tone="muted" />
        <StatCard label="New this week" value={stats.last7} icon={Inbox} tone="accent" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or source…"
            className="w-full h-10 rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>
        <div className="inline-flex rounded-xl bg-muted p-1 text-xs font-semibold">
          {(["active", "all", "unsubscribed"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={[
                "px-3 py-1.5 rounded-lg capitalize transition-colors",
                filter === k
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Info banner about broadcasts */}
      <div className="mb-4 rounded-xl border border-border bg-muted/40 p-3.5 flex items-start gap-2.5 text-sm">
        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-muted-foreground">
          To <strong className="text-foreground">send a broadcast email</strong> to all subscribers, set up a sender email domain first. Once that&rsquo;s ready, a &ldquo;New broadcast&rdquo; button will appear here.
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 grid place-items-center mb-3">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <p className="font-semibold">No subscribers {query ? "match your search" : "yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            They will appear here as soon as visitors sign up.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Subscriber</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Source</th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Subscribed</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-bold flex-shrink-0">
                          {(row.name?.[0] ?? row.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {row.name || (
                              <span className="text-muted-foreground italic">No name</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/70">
                        {row.source ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      {new Date(row.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {row.unsubscribed_at ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          <UserMinus className="h-3 w-3" /> Unsubscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          <UserCheck className="h-3 w-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {row.unsubscribed_at ? (
                          <button
                            onClick={() => handleResubscribe(row)}
                            className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                            title="Re-subscribe"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnsubscribe(row)}
                            className="p-1.5 hover:bg-muted rounded-md text-foreground/70 transition-colors"
                            title="Mark as unsubscribed"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  tone: "default" | "primary" | "muted" | "accent";
}) {
  const toneCls =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "accent"
        ? "bg-gradient-primary text-primary-foreground"
        : tone === "muted"
          ? "bg-muted text-muted-foreground"
          : "bg-card text-foreground border border-border";
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneCls}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

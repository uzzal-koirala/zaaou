import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Inbox,
  Mail,
  Store,
  Phone,
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  Loader2,
  Search,
  Reply,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox - Zaaou Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <InboxPage />
      </AdminLayout>
    </RoleGuard>
  ),
});

type InquiryStatus = "new" | "in_progress" | "resolved" | "archived";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  topic: string | null;
  message: string;
  status: InquiryStatus;
  admin_notes: string | null;
  created_at: string;
};

type PartnerRow = {
  id: string;
  restaurant_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string | null;
  cuisine: string | null;
  message: string | null;
  status: InquiryStatus;
  admin_notes: string | null;
  created_at: string;
};

type Tab = "contact" | "partner";

function InboxPage() {
  const [tab, setTab] = useState<Tab>("contact");
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("partner_applications")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    setContacts((c.data ?? []) as ContactRow[]);
    setPartners((p.data ?? []) as PartnerRow[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setSelectedId(null);
  }, [tab]);

  const newContacts = contacts.filter((c) => c.status === "new").length;
  const newPartners = partners.filter((p) => p.status === "new").length;

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (tab === "contact") {
      return contacts
        .filter((c) => filter === "all" || c.status === filter)
        .filter(
          (c) =>
            !q ||
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.message.toLowerCase().includes(q),
        );
    }
    return partners
      .filter((p) => filter === "all" || p.status === filter)
      .filter(
        (p) =>
          !q ||
          p.restaurant_name.toLowerCase().includes(q) ||
          p.owner_name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q),
      );
  }, [tab, contacts, partners, filter, search]);

  const selected =
    tab === "contact"
      ? contacts.find((c) => c.id === selectedId) ?? null
      : partners.find((p) => p.id === selectedId) ?? null;

  async function updateStatus(id: string, status: InquiryStatus) {
    const table = tab === "contact" ? "contact_submissions" : "partner_applications";
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) {
      toast.error("Couldn't update status");
      return;
    }
    toast.success(`Marked as ${status.replace("_", " ")}`);
    loadAll();
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry permanently?")) return;
    const table = tab === "contact" ? "contact_submissions" : "partner_applications";
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast.error("Couldn't delete");
      return;
    }
    toast.success("Deleted");
    setSelectedId(null);
    loadAll();
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            Inbox
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Customer & partner messages
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            All inquiries submitted from the public site.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <TabButton
          active={tab === "contact"}
          onClick={() => setTab("contact")}
          icon={Mail}
          label="Contact"
          count={newContacts}
        />
        <TabButton
          active={tab === "partner"}
          onClick={() => setTab("partner")}
          icon={Store}
          label="Partner applications"
          count={newPartners}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, message…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | InquiryStatus)}
          className="h-10 px-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:border-primary/40"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* List + detail */}
      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4">
          {/* List */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {list.length === 0 ? (
              <div className="py-16 text-center">
                <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No messages found</p>
              </div>
            ) : (
              <ul className="divide-y divide-border max-h-[70vh] overflow-y-auto">
                {list.map((row) => {
                  const isSel = row.id === selectedId;
                  const title =
                    tab === "contact"
                      ? (row as ContactRow).name
                      : (row as PartnerRow).restaurant_name;
                  const subtitle =
                    tab === "contact"
                      ? (row as ContactRow).topic ?? "No topic"
                      : (row as PartnerRow).owner_name;
                  const preview =
                    tab === "contact"
                      ? (row as ContactRow).message
                      : (row as PartnerRow).message ?? `${(row as PartnerRow).cuisine ?? ""}`;
                  return (
                    <li key={row.id}>
                      <button
                        onClick={() => setSelectedId(row.id)}
                        className={`w-full text-left p-4 transition-colors hover:bg-muted/50 ${
                          isSel ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm truncate">{title}</p>
                          <StatusPill status={row.status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {subtitle}
                        </p>
                        <p className="text-xs text-foreground/70 mt-1.5 line-clamp-2">
                          {preview}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2 inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(row.created_at)}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Detail */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            {!selected ? (
              <div className="grid place-items-center h-full min-h-[300px] text-center">
                <div>
                  <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Select a message to view details
                  </p>
                </div>
              </div>
            ) : tab === "contact" ? (
              <ContactDetail
                row={selected as ContactRow}
                onStatus={(s) => updateStatus(selected.id, s)}
                onDelete={() => remove(selected.id)}
              />
            ) : (
              <PartnerDetail
                row={selected as PartnerRow}
                onStatus={(s) => updateStatus(selected.id, s)}
                onDelete={() => remove(selected.id)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Mail;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-soft"
          : "bg-card border-border text-foreground/70 hover:border-primary/30"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count > 0 && (
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            active ? "bg-primary-foreground text-primary" : "bg-rose-500/15 text-rose-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function StatusPill({ status }: { status: InquiryStatus }) {
  const map: Record<InquiryStatus, string> = {
    new: "bg-rose-500/10 text-rose-600",
    in_progress: "bg-amber-500/10 text-amber-600",
    resolved: "bg-emerald-500/10 text-emerald-600",
    archived: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ${map[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function ContactDetail({
  row,
  onStatus,
  onDelete,
}: {
  row: ContactRow;
  onStatus: (s: InquiryStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {row.topic ?? "General"}
          </p>
          <h2 className="font-display text-2xl font-extrabold mt-1 truncate">{row.name}</h2>
          <a
            href={`mailto:${row.email}`}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1.5 mt-1"
          >
            <Mail className="h-3.5 w-3.5" /> {row.email}
          </a>
          <p className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {formatDateLong(row.created_at)}
          </p>
        </div>
        <StatusPill status={row.status} />
      </div>

      <div className="rounded-xl bg-muted/40 p-4 border border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Message
        </p>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{row.message}</p>
      </div>

      <Actions onStatus={onStatus} onDelete={onDelete} replyHref={`mailto:${row.email}`} />
    </div>
  );
}

function PartnerDetail({
  row,
  onStatus,
  onDelete,
}: {
  row: PartnerRow;
  onStatus: (s: InquiryStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Partner application
          </p>
          <h2 className="font-display text-2xl font-extrabold mt-1 truncate">
            {row.restaurant_name}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Owner: {row.owner_name}</p>
          <p className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {formatDateLong(row.created_at)}
          </p>
        </div>
        <StatusPill status={row.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <InfoRow icon={Mail} label="Email" value={row.email} href={`mailto:${row.email}`} />
        <InfoRow icon={Phone} label="Phone" value={row.phone} href={`tel:${row.phone}`} />
        {row.cuisine && <InfoRow icon={Store} label="Cuisine" value={row.cuisine} />}
        {row.address && <InfoRow icon={MapPin} label="Address" value={row.address} />}
      </div>

      {row.message && (
        <div className="rounded-xl bg-muted/40 p-4 border border-border">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Notes from applicant
          </p>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{row.message}</p>
        </div>
      )}

      <Actions onStatus={onStatus} onDelete={onDelete} replyHref={`mailto:${row.email}`} />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-2.5 rounded-xl border border-border bg-background p-3">
      <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="hover:opacity-80 transition-opacity">
      {inner}
    </a>
  ) : (
    inner
  );
}

function Actions({
  onStatus,
  onDelete,
  replyHref,
}: {
  onStatus: (s: InquiryStatus) => void;
  onDelete: () => void;
  replyHref: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
      <a
        href={replyHref}
        className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:shadow-glow transition-all"
      >
        <Reply className="h-4 w-4" /> Reply
      </a>
      <button
        onClick={() => onStatus("in_progress")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-amber-500/40 hover:text-amber-600 transition-colors"
      >
        In progress
      </button>
      <button
        onClick={() => onStatus("resolved")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-emerald-500/40 hover:text-emerald-600 transition-colors"
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
      </button>
      <button
        onClick={() => onStatus("archived")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors"
      >
        Archive
      </button>
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors ml-auto"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

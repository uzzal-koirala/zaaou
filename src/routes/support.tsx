import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  LifeBuoy,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Truck,
  CreditCard,
  Store,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support - Zaaou Food | Help Centre" },
      { name: "description", content: "Get help with your Zaaou Food order. Contact us by phone, email or WhatsApp - we're here to help." },
      { property: "og:title", content: "Support - Zaaou Food | Help Centre" },
      { property: "og:description", content: "Get help with your Zaaou Food order. Contact us by phone, email or WhatsApp - we're here to help." },
    ],
  }),
  component: SupportPage,
});

const topics = [
  { icon: Truck, title: "Order & delivery", desc: "Track an order, report a delivery issue or request a refund." },
  { icon: CreditCard, title: "Payments & refunds", desc: "Failed transactions, refunds and promo code questions." },
  { icon: Store, title: "Restaurant partners", desc: "For restaurant partners - menu updates, payouts and onboarding." },
  { icon: ShieldCheck, title: "Account & privacy", desc: "Password, account deletion or data privacy questions." },
];

function SupportPage() {
  const { settings } = useSiteSettings();
  const email = settings?.contact_email ?? "info@zaaoufoods.com";
  const phone1 = settings?.contact_phone_primary ?? "+977 970-5047000";
  const phone2 = settings?.contact_phone_secondary ?? "";
  const address = settings?.contact_address ?? "Itahari, Sunsari, Nepal";
  const whatsappRaw = (settings?.contact_whatsapp ?? "").replace(/[^\d+]/g, "");
  const whatsappLink = whatsappRaw ? `https://wa.me/${whatsappRaw.replace(/^\+/, "")}` : null;

  const [form, setForm] = useState({ name: "", email: "", topic: "Order & delivery", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    // Open the user's email client with a pre-filled message
    const subject = encodeURIComponent(`[Support - ${form.topic}] from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n—\nFrom: ${form.name}\nReply-to: ${form.email}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      toast.success("Thanks! Your email client should open shortly.");
    }, 600);
  }

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
            <LifeBuoy className="h-3.5 w-3.5" />
            Support centre
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            How can we help today?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Real humans, fast replies. Choose the channel that works best for you - we usually respond within minutes during working hours.
          </p>
        </div>
      </section>

      {/* Quick contact cards */}
      <section className="mx-auto max-w-6xl px-5 -mt-2 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={`tel:${phone1.replace(/\s/g, "")}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold">Call us</h3>
            <p className="mt-1 text-sm text-muted-foreground">Sun - Fri, 9 AM - 9 PM</p>
            <p className="mt-3 text-sm font-semibold text-foreground">{phone1}</p>
            {phone2 && <p className="text-sm font-semibold text-foreground">{phone2}</p>}
          </a>

          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold">WhatsApp</h3>
              <p className="mt-1 text-sm text-muted-foreground">Fastest channel - usually under 10 mins</p>
              <p className="mt-3 text-sm font-semibold text-foreground">Chat with us now →</p>
            </a>
          )}

          <a
            href={`mailto:${email}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold">Email</h3>
            <p className="mt-1 text-sm text-muted-foreground">We reply within 1 working day</p>
            <p className="mt-3 break-all text-sm font-semibold text-foreground">{email}</p>
          </a>
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Browse by topic
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a category to find answers faster.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map(({ icon: Icon, title, desc }) => (
            <Link
              key={title}
              to="/faq"
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact form + info */}
      <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-extrabold tracking-tight">
                  Send us a message
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Fill the form and we'll open your email client with the details ready to send.
                </p>
              </div>

              {sent ? (
                <div className="rounded-xl bg-emerald-500/10 p-6 text-center ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <p className="mt-3 font-display text-lg font-bold text-foreground">All set!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Check your email client - your message is ready to send.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", topic: "Order & delivery", message: "" });
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Aarav Sharma"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Topic
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    >
                      {topics.map((t) => (
                        <option key={t.title}>{t.title}</option>
                      ))}
                      <option>Something else</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={5}
                      placeholder="Tell us what's going on..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60 sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Opening email..." : "Send message"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h3 className="font-display text-lg font-extrabold">Visit us</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Office</p>
                    <p className="text-muted-foreground">{address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Working hours</p>
                    <p className="text-muted-foreground">Sun - Fri: 9 AM - 9 PM</p>
                    <p className="text-muted-foreground">Saturday: 10 AM - 6 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-br from-primary to-yellow-500 p-6 text-primary-foreground sm:p-7">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold">Quick answers</h3>
              <p className="mt-1.5 text-sm opacity-95">
                Most questions are already answered in our FAQ section.
              </p>
              <Link
                to="/faq"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary transition-all hover:-translate-y-0.5"
              >
                Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

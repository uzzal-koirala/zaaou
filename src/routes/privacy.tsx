import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Eye, FileCheck, Mail, Cookie, UserCheck, Database, Globe } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Zaaou Food" },
      { name: "description", content: "How Zaaou Food collects, uses and protects your personal data when you order food in Itahari." },
      { property: "og:title", content: "Privacy Policy - Zaaou Food" },
      { property: "og:description", content: "How Zaaou Food collects, uses and protects your personal data when you order food in Itahari." },
    ],
  }),
  component: PrivacyPage,
});

const lastUpdated = "April 2026";

const principles = [
  { icon: Lock, title: "Encrypted by default", desc: "Your data travels over TLS and sits encrypted at rest." },
  { icon: Eye, title: "No selling, ever", desc: "We never sell your personal information to third parties." },
  { icon: UserCheck, title: "You stay in control", desc: "Access, edit or delete your data anytime - just ask." },
  { icon: FileCheck, title: "Transparent practices", desc: "Plain-language policies, no hidden clauses or surprises." },
];

const sections = [
  {
    icon: Database,
    title: "Information we collect",
    body: [
      "Account details: name, phone number, email address and delivery addresses you choose to save.",
      "Order data: items ordered, restaurant, delivery time, special instructions and payment confirmation status.",
      "Device and usage: app version, device type, IP address, language and basic interaction analytics.",
      "Location: precise location only while the app is open and you've granted permission, used to match riders and estimate delivery times.",
    ],
  },
  {
    icon: Eye,
    title: "How we use your data",
    body: [
      "Process and deliver your orders, including sharing necessary details with restaurants and riders.",
      "Send order updates, receipts and important service notices via SMS, email or push notifications.",
      "Improve the Zaaou app - measure performance, fix bugs and design better features.",
      "Detect fraud, prevent abuse and keep the platform safe for customers, partners and riders.",
      "Send marketing or newsletter messages only if you've opted in. You can unsubscribe anytime.",
    ],
  },
  {
    icon: Globe,
    title: "Sharing with third parties",
    body: [
      "Restaurants: receive your name, order details and delivery address to prepare your food.",
      "Delivery riders: get your name, delivery address and contact number for the duration of the delivery.",
      "Payment processors: handle transactions securely - we never store full card details on our servers.",
      "Service providers: hosting, analytics and SMS partners under strict confidentiality agreements.",
      "Legal authorities: only when required by Nepali law or to protect rights, property and safety.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & tracking",
    body: [
      "Essential cookies keep you signed in and remember your cart - these can't be disabled.",
      "Analytics cookies help us understand which pages and features people use the most.",
      "We do not use cross-site advertising trackers. You can clear cookies in your browser anytime.",
    ],
  },
  {
    icon: UserCheck,
    title: "Your rights",
    body: [
      "Access: request a copy of the personal data we hold about you.",
      "Correction: update inaccurate or incomplete information from your account screen.",
      "Deletion: ask us to delete your account and associated data, subject to legal retention requirements.",
      "Withdraw consent: opt out of marketing messages without affecting your service.",
      "To exercise any of these rights, email us and we'll respond within 30 days.",
    ],
  },
  {
    icon: Lock,
    title: "Data retention & security",
    body: [
      "We keep order history for up to 5 years to comply with tax and consumer-protection rules.",
      "Account data is retained while your account is active and deleted on request.",
      "Industry-standard safeguards: encrypted databases, restricted staff access and regular security reviews.",
    ],
  },
];

function PrivacyPage() {
  const { settings } = useSiteSettings();
  const email = settings?.contact_email ?? "info@zaaoufoods.com";

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
            <Shield className="h-3.5 w-3.5" />
            Your privacy matters
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We're a local company that takes your trust seriously. This page explains exactly what we collect, why, and the control you have over it.
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-4xl px-5 pb-20 lg:px-8">
        <div className="space-y-6">
          {sections.map(({ icon: Icon, title, body }, idx) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-extrabold sm:text-2xl">
                  <span className="text-primary">{String(idx + 1).padStart(2, "0")}.</span> {title}
                </h2>
              </div>
              <ul className="mt-5 space-y-3 pl-1">
                {body.map((line, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* Contact */}
          <div className="rounded-2xl bg-gradient-to-br from-primary to-yellow-500 p-6 text-primary-foreground sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-extrabold sm:text-2xl">
                Questions about your privacy?
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed opacity-95 sm:text-base">
              We're happy to help. Email us and a real person from the Zaaou team will get back to you within 2 working days.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-soft transition-all hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
                {email}
              </a>
              <Link
                to="/support"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:bg-white/25"
              >
                Visit support centre
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

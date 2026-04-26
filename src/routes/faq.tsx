import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, HelpCircle, ShoppingBag, Truck, CreditCard, UserCircle2, Store, Plus, MessageCircle, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ - Zaaou Food | Frequently Asked Questions" },
      { name: "description", content: "Answers to common questions about ordering, delivery, payment and the Zaaou Food app in Itahari." },
      { property: "og:title", content: "FAQ - Zaaou Food | Frequently Asked Questions" },
      { property: "og:description", content: "Answers to common questions about ordering, delivery, payment and the Zaaou Food app in Itahari." },
    ],
  }),
  component: FaqPage,
});

type Faq = { q: string; a: string };
type Category = { id: string; label: string; icon: typeof HelpCircle; items: Faq[] };

const categories: Category[] = [
  {
    id: "ordering",
    label: "Ordering",
    icon: ShoppingBag,
    items: [
      { q: "How do I place an order on Zaaou?", a: "Open the Zaaou app or website, choose your favourite restaurant, add items to your cart and check out. You'll receive an order confirmation in seconds." },
      { q: "Is there a minimum order value?", a: "Most restaurants have no minimum, but a few set a small minimum (usually NPR 150) - it's clearly shown on the restaurant page before you order." },
      { q: "Can I schedule an order for later?", a: "Yes. Tap the clock icon at checkout and pick a delivery slot up to 24 hours in advance." },
      { q: "Can I cancel my order?", a: "You can cancel for free until the restaurant accepts it. After that, contact our support team and we'll do our best to help." },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: Truck,
    items: [
      { q: "How long does delivery take?", a: "Most orders in Itahari arrive within 25-40 minutes depending on traffic, restaurant prep time and your location." },
      { q: "Do you deliver outside Itahari?", a: "Right now we deliver across Itahari. We're expanding to nearby towns soon - subscribe to our newsletter to hear first." },
      { q: "What are the delivery fees?", a: "Delivery starts from NPR 50 and is shown at checkout before you confirm. Some restaurants offer free delivery on larger orders." },
      { q: "Can I track my order in real time?", a: "Yes. Once a rider picks up your food, you'll see their live location and ETA on the order screen." },
      { q: "What if my food arrives cold or damaged?", a: "Reach out to support within 24 hours with a photo and we'll make it right - usually a refund or a replacement." },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    items: [
      { q: "Which payment methods do you accept?", a: "We currently accept eSewa and Cash on Delivery only." },
      { q: "Is online payment secure?", a: "All payments go through PCI-compliant providers. We never store your full card details on our servers." },
      { q: "How do refunds work?", a: "Refunds for cancelled or failed orders are issued back to the original payment method within 5-7 business days." },
      { q: "Do you offer promo codes or discounts?", a: "Yes! Check the Offers tab in the app or follow us on social media for ongoing deals." },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: UserCircle2,
    items: [
      { q: "How do I create an account?", a: "Just enter your phone number in the app, verify with the OTP and you're in. No long sign-up forms." },
      { q: "Can I save multiple addresses?", a: "Yes - home, office, friend's place. You can save as many addresses as you like and switch at checkout." },
      { q: "How do I delete my account?", a: "Go to Settings > Account > Delete Account, or email us and we'll process the request within 7 days." },
      { q: "I forgot my password / can't log in.", a: "We use OTP-based login, so no passwords. If you're not getting the OTP, try a different network or contact support." },
    ],
  },
  {
    id: "partners",
    label: "Restaurants & Riders",
    icon: Store,
    items: [
      { q: "How can my restaurant join Zaaou?", a: (() => "Visit our Partner page and fill out the short form. Our team will reach out within 48 hours.")() },
      { q: "How do I become a Zaaou rider?", a: "Apply through the Careers page. We provide training, weekly payouts and a flexible schedule." },
      { q: "What commission does Zaaou charge restaurants?", a: "Our partner commissions are competitive and transparent - we'll share full details during onboarding." },
    ],
  },
];

function FaqPage() {
  const { settings } = useSiteSettings();
  const whatsapp = (settings?.contact_whatsapp ?? "").replace(/[^\d+]/g, "");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => activeCat === "all" || c.id === activeCat)
      .map((c) => ({
        ...c,
        items: q
          ? c.items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q))
          : c.items,
      }))
      .filter((c) => c.items.length > 0);
  }, [query, activeCat]);

  const totalMatches = filtered.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background pt-16 pb-10 sm:pt-24 sm:pb-14">
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
            <HelpCircle className="h-3.5 w-3.5" />
            We're here to help
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Quick answers to the most common things people ask us. Can't find what you need?{" "}
            <Link to="/support" className="font-semibold text-primary hover:underline">
              Contact support
            </Link>
            .
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-7 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-full border border-border bg-card py-3.5 pl-12 pr-5 text-sm shadow-soft outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="mx-auto max-w-5xl px-5 pt-8 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCat("all")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeCat === "all"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "border border-border bg-card text-foreground hover:border-primary/30 hover:text-primary"
            }`}
          >
            All
          </button>
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveCat(id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeCat === id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "border border-border bg-card text-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Questions */}
      <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
        {totalMatches === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">No matching questions</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Try different keywords or{" "}
              <Link to="/support" className="font-semibold text-primary hover:underline">
                contact our support team
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map(({ id, label, icon: Icon, items }) => (
              <div key={id}>
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-lg font-extrabold">{label}</h2>
                </div>
                <div className="space-y-2.5">
                  {items.map((item, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-border bg-card transition-all hover:border-primary/30"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5">
                        <span className="text-sm font-semibold text-foreground sm:text-[15px]">
                          {item.q}
                        </span>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-all group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground">
                          <Plus className="h-4 w-4" />
                        </span>
                      </summary>
                      <div className="px-4 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:text-[15px]">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Still need help */}
      <section className="mx-auto max-w-4xl px-5 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-yellow-500 p-8 text-primary-foreground sm:p-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
                Still need help?
              </h2>
              <p className="mt-2 max-w-md text-sm opacity-95 sm:text-base">
                Our support team replies within minutes during business hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/support"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-soft transition-all hover:-translate-y-0.5"
              >
                Contact support
                <ArrowRight className="h-4 w-4" />
              </Link>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/^\+/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:bg-white/25"
                >
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

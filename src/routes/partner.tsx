import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Users,
  Truck,
  BarChart3,
  CheckCircle2,
  Store,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Add Your Restaurant - Partner with Zaaou Food" },
      { name: "description", content: "List your restaurant on Zaaou Food and reach thousands of hungry customers across Itahari. Zero setup fees, simple onboarding." },
      { property: "og:title", content: "Add Your Restaurant - Partner with Zaaou Food" },
      { property: "og:description", content: "List your restaurant on Zaaou Food and reach thousands of hungry customers across Itahari. Zero setup fees, simple onboarding." },
    ],
  }),
  component: PartnerPage,
});

const benefits = [
  { icon: Users, title: "Reach 50,000+ customers", desc: "Tap into Itahari's largest hungry audience from day one." },
  { icon: TrendingUp, title: "Grow revenue 3x", desc: "Partner restaurants see an average 3x revenue boost in 90 days." },
  { icon: Truck, title: "We handle delivery", desc: "Our trained rider fleet picks up and delivers - you focus on cooking." },
  { icon: BarChart3, title: "Real-time insights", desc: "Track orders, sales and customer feedback from one simple dashboard." },
];

const steps = [
  { n: 1, title: "Apply", desc: "Fill out the form below - takes less than 2 minutes." },
  { n: 2, title: "Onboard", desc: "Our team visits, photographs your menu and sets up your store." },
  { n: 3, title: "Go live", desc: "Start receiving orders within 5 working days." },
];

function PartnerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    cuisine: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // For now, just acknowledge - wire up to backend later.
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-peach">
        <div aria-hidden className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Partner with us
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Add your restaurant to{" "}
              <span className="text-gradient-primary">Zaaou Food</span>.
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mt-4">
              Join 100+ restaurants already growing with Itahari's #1 food
              delivery app. Zero setup fees, zero risk.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-7 py-3.5 font-semibold shadow-soft hover:shadow-glow transition-all"
              >
                Apply now
              </a>
              <a
                href="tel:+9779800000000"
                className="inline-flex items-center gap-2 rounded-xl bg-card border-2 border-border hover:border-primary/40 text-foreground px-7 py-3.5 font-semibold transition-colors"
              >
                Talk to our team
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-md">
              <div>
                <p className="font-display font-extrabold text-2xl text-foreground">100+</p>
                <p className="text-xs text-muted-foreground mt-1">Partner restaurants</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl text-foreground">50K+</p>
                <p className="text-xs text-muted-foreground mt-1">Active customers</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl text-foreground">3×</p>
                <p className="text-xs text-muted-foreground mt-1">Avg revenue lift</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 m-auto h-80 w-80 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-5 rounded-2xl bg-card border border-border shadow-card"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary mb-3">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm leading-tight">{b.title}</h3>
                  <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight">
              Live on Zaaou in 3 simple steps.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="p-7 rounded-3xl bg-card border border-border shadow-card text-center"
              >
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center font-display font-extrabold text-xl mb-4">
                  {s.n}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="py-16 lg:py-24 bg-cream">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          {submitted ? (
            <div className="bg-card rounded-3xl p-10 sm:p-14 text-center border border-border shadow-card">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 grid place-items-center text-primary mb-5">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl font-extrabold mb-3">
                Application received!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Thanks {form.ownerName || "there"} - our partnerships team will reach out to {form.restaurantName || "you"} within 24 hours.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:shadow-glow transition-all"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-3xl p-7 sm:p-10 border border-border shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-extrabold leading-tight">
                    Tell us about your restaurant
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                <Field label="Restaurant name" name="restaurantName" value={form.restaurantName} onChange={handleChange} required />
                <Field label="Owner / contact name" name="ownerName" value={form.ownerName} onChange={handleChange} required />
                <Field label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+977 98XXXXXXXX" />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <Field label="Restaurant address" name="address" value={form.address} onChange={handleChange} required full />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">
                    Cuisine type
                  </label>
                  <select
                    name="cuisine"
                    value={form.cuisine}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground transition-colors"
                  >
                    <option value="">Select cuisine…</option>
                    <option>Nepali / Thakali</option>
                    <option>Momo / Tibetan</option>
                    <option>Pizza / Italian</option>
                    <option>Burger / Fast Food</option>
                    <option>Biryani / Indian</option>
                    <option>Cafe / Bakery</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">
                    Anything else? (optional)
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your menu, locations, or anything we should know…"
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground transition-colors resize-none"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-7 py-3.5 font-semibold shadow-soft hover:shadow-glow transition-all"
                  >
                    Submit application
                  </button>
                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree to be contacted by Zaaou Food.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  full,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-semibold mb-1.5 text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground transition-colors"
      />
    </div>
  );
}

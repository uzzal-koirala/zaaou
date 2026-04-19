import { Link } from "@tanstack/react-router";
import { Store, TrendingUp, Users, BadgeCheck, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Grow your sales",
    desc: "Reach thousands of hungry foodies across Itahari, every single day.",
  },
  {
    icon: Users,
    title: "New customers daily",
    desc: "Get discovered by Zaaou app users searching for their next favourite meal.",
  },
  {
    icon: BadgeCheck,
    title: "Zero setup hassle",
    desc: "We handle photos, menu setup, riders and payments — you just cook.",
  },
];

export function PartnerCTA() {
  return (
    <section id="partner" className="relative py-20 lg:py-28 bg-muted/30 overflow-hidden">
      <div aria-hidden className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-yellow-300/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="rounded-[2.5rem] bg-card border border-border shadow-card overflow-hidden">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left — copy */}
            <div className="lg:col-span-3 p-8 sm:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
                <Store className="h-3.5 w-3.5" />
                For Restaurant Owners
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.05] text-foreground">
                Add your restaurant to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 italic font-light text-primary">Zaaou Food</span>
                  <span aria-hidden className="absolute left-0 right-0 bottom-1 h-3 bg-yellow-300/50 rounded-md -z-0" />
                </span>
              </h2>

              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Join 100+ restaurants already growing with Itahari's favourite food
                delivery platform. Set up in minutes — start receiving orders today.
              </p>

              <div className="grid sm:grid-cols-3 gap-5 mt-8">
                {benefits.map((b) => (
                  <div key={b.title} className="space-y-2">
                    <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary">
                      <b.icon className="h-5 w-5" />
                    </div>
                    <p className="font-display font-extrabold text-foreground leading-tight">
                      {b.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/partner"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold hover:bg-primary/90 transition-colors shadow-glow"
                >
                  Add Your Restaurant
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+9779800000000"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-6 py-3.5 text-sm font-bold hover:bg-secondary/80 transition-colors"
                >
                  Talk to our team
                </a>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">
                Free to join · 0% setup fee · Onboarded in 48 hours
              </p>
            </div>

            {/* Right — visual stats panel */}
            <div className="lg:col-span-2 relative bg-gradient-hero text-primary-foreground p-8 sm:p-12 lg:p-12 flex flex-col justify-between overflow-hidden">
              <div aria-hidden className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div aria-hidden className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  Partner Dashboard
                </div>
                <h3 className="mt-5 font-display font-extrabold text-2xl sm:text-3xl leading-tight">
                  Restaurants on Zaaou see big results.
                </h3>
              </div>

              <div className="relative grid grid-cols-2 gap-5 mt-8">
                <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4">
                  <p className="font-display font-extrabold text-3xl">+38%</p>
                  <p className="text-xs text-white/80 uppercase tracking-wider mt-1">Avg. revenue lift</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4">
                  <p className="font-display font-extrabold text-3xl">100+</p>
                  <p className="text-xs text-white/80 uppercase tracking-wider mt-1">Active partners</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4">
                  <p className="font-display font-extrabold text-3xl">48h</p>
                  <p className="text-xs text-white/80 uppercase tracking-wider mt-1">To go live</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4">
                  <p className="font-display font-extrabold text-3xl">0%</p>
                  <p className="text-xs text-white/80 uppercase tracking-wider mt-1">Setup fee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

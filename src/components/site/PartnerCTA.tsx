import { Link } from "@tanstack/react-router";
import {
  Store,
  TrendingUp,
  Users,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import royalBiryani from "@/assets/restaurants/royal-biryani.jpg";
import bahattarCafe from "@/assets/restaurants/bahattar-cafe.jpg";
import pauroti from "@/assets/restaurants/pauroti.jpg";
import purwanchalCafe from "@/assets/restaurants/purwanchal-cafe.jpg";

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
    desc: "We handle photos, menu, riders and payments — you just cook.",
  },
];

export function PartnerCTA() {
  return (
    <section id="partner" className="relative py-20 lg:py-32 bg-background overflow-hidden">
      {/* Background ornaments */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 -right-32 h-[28rem] w-[28rem] rounded-full bg-yellow-300/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT — Copy */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              <Store className="h-3.5 w-3.5" />
              For Restaurant Owners
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-[4.25rem] font-extrabold tracking-tight leading-[1.02] text-foreground">
              Add your restaurant to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic font-light text-primary">
                  Zaaou Food
                </span>
                <span
                  aria-hidden
                  className="absolute left-0 right-0 bottom-1 h-3 bg-yellow-300/50 rounded-md -z-0"
                />
              </span>
              <span className="block text-foreground/90 mt-1">
                & feed all of Itahari.
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Join 100+ restaurants already growing with Itahari's favourite food
              delivery platform. Set up in minutes — start receiving orders today.
            </p>

            <div className="grid sm:grid-cols-3 gap-5 pt-2">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
                >
                  <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-3">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <p className="font-display font-extrabold text-foreground leading-tight">
                    {b.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to="/partner"
                className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold hover:bg-primary/90 transition-all shadow-glow hover:scale-[1.03]"
              >
                Add Your Restaurant
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+9779800000000"
                className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-6 py-3.5 text-sm font-bold hover:bg-secondary/80 transition-colors"
              >
                Talk to our team
              </a>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Free to join
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                0% setup fee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Live in 48 hours
              </span>
            </div>
          </div>

          {/* RIGHT — Visual collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Glow */}
              <div
                aria-hidden
                className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-primary/30 blur-3xl"
              />

              {/* Big card — biryani */}
              <div className="absolute top-0 left-0 w-[62%] aspect-[4/5] rounded-3xl overflow-hidden shadow-glow ring-1 ring-border rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                <img
                  src={royalBiryani}
                  alt="Royal Biryani — partnered with Zaaou Food"
                  loading="lazy"
                  width={600}
                  height={750}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent"
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="inline-flex items-center gap-1 bg-yellow-300 text-foreground rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                    <Star className="h-3 w-3 fill-current" /> Top Seller
                  </div>
                  <p className="font-display font-extrabold text-white text-lg leading-tight">
                    Royal Biryani
                  </p>
                  <p className="text-white/80 text-xs">+42% orders / month</p>
                </div>
              </div>

              {/* Mid card — bahattar */}
              <div className="absolute top-[10%] right-0 w-[52%] aspect-square rounded-3xl overflow-hidden shadow-card ring-1 ring-border rotate-[7deg] hover:rotate-0 transition-transform duration-500 z-10">
                <img
                  src={bahattarCafe}
                  alt="Bahattar Restro & Lounge — partnered with Zaaou Food"
                  loading="lazy"
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <p className="font-display font-extrabold text-white text-sm leading-tight">
                    Bahattar Restro
                  </p>
                  <p className="text-white/80 text-[10px]">Joined 2024</p>
                </div>
              </div>

              {/* Bottom card — pauroti */}
              <div className="absolute bottom-0 left-[18%] w-[48%] aspect-[4/5] rounded-3xl overflow-hidden shadow-card ring-1 ring-border rotate-[4deg] hover:rotate-0 transition-transform duration-500 z-20">
                <img
                  src={pauroti}
                  alt="Pauroti — partnered with Zaaou Food"
                  loading="lazy"
                  width={500}
                  height={625}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <p className="font-display font-extrabold text-white text-sm leading-tight">
                    Pauroti
                  </p>
                  <p className="text-white/80 text-[10px]">Bakery & Cafe</p>
                </div>
              </div>

              {/* Tiny card — purwanchal */}
              <div className="absolute bottom-[18%] right-[2%] w-[34%] aspect-square rounded-2xl overflow-hidden shadow-card ring-2 ring-background rotate-[-8deg] hover:rotate-0 transition-transform duration-500 z-30">
                <img
                  src={purwanchalCafe}
                  alt="Purwanchal Cafe — partnered with Zaaou Food"
                  loading="lazy"
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Floating "+38% revenue" pill */}
              <div className="absolute -top-3 right-2 z-40 bg-card text-foreground rounded-2xl shadow-glow px-3.5 py-2 flex items-center gap-2 border border-border">
                <div className="grid place-items-center h-8 w-8 rounded-xl bg-primary text-primary-foreground">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-base leading-none text-primary">
                    +38%
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">
                    Avg. revenue
                  </p>
                </div>
              </div>

              {/* Floating "100+ partners" pill */}
              <div className="absolute -bottom-2 -left-2 z-40 bg-foreground text-background rounded-2xl shadow-glow px-3.5 py-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <div>
                  <p className="font-display font-extrabold text-sm leading-none">
                    100+ partners
                  </p>
                  <p className="text-[9px] uppercase tracking-wider opacity-70 font-bold mt-0.5">
                    Already onboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

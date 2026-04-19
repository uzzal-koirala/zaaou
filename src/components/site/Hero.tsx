import { ArrowRight, Star, Clock, ShieldCheck, Sparkles } from "lucide-react";
import screenHome from "@/assets/app/screen-home.png";
import { WhatsAppInlineButton } from "./WhatsAppButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-peach">
      {/* Subtle background ornaments */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left copy column */}
        <div className="lg:col-span-7 space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border shadow-sm px-4 py-1.5 text-xs font-semibold text-foreground/80">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            #1 Food Delivery App in Itahari
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.25rem] font-extrabold leading-[1.02] tracking-tight text-foreground">
            Crave it.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Tap it.</span>
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-1 h-3 bg-primary/15 rounded-md -z-0"
              />
            </span>
            <br />
            <span className="text-foreground">Devour it in</span>{" "}
            <span className="text-gradient-primary">30 minutes.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            From sizzling momos to wood-fired pizzas — order from Itahari's
            best kitchens and track your rider live, all from one beautiful app.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#app"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-7 py-4 font-semibold shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all"
            >
              Download the App
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <WhatsAppInlineButton />
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl">
            <div className="flex items-start gap-2.5">
              <div className="flex items-center gap-0.5 text-primary mt-0.5">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <div>
                <p className="font-display font-extrabold text-foreground leading-none text-lg">4.9</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">12k+ orders</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-display font-extrabold text-foreground leading-none text-lg">25 min</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">Avg delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-display font-extrabold text-foreground leading-none text-lg">100+</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">Restaurants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right phone showcase */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          {/* Glow blob behind phone */}
          <div
            aria-hidden
            className="absolute inset-0 m-auto h-[28rem] w-[28rem] rounded-full bg-gradient-primary opacity-30 blur-3xl"
          />

          {/* Phone frame */}
          <div className="relative animate-float">
            <div className="relative rounded-[2.75rem] bg-foreground p-2.5 shadow-glow ring-1 ring-black/5">
              <div className="relative h-[34rem] w-[17rem] rounded-[2.25rem] overflow-hidden bg-card">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 h-5 w-24 rounded-full bg-foreground" />
                <img
                  src={screenHome}
                  alt="Zaaou Food mobile app — browse restaurants and order in seconds"
                  width={886}
                  height={1920}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>

            {/* Floating rating chip */}
            <div className="absolute -left-6 top-16 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 hidden sm:flex">
              <div className="h-9 w-9 rounded-full bg-primary/15 grid place-items-center">
                <Star className="h-4 w-4 text-primary fill-current" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Rated
                </p>
                <p className="font-bold text-sm text-foreground leading-tight">4.9 / 5.0</p>
              </div>
            </div>

            {/* Floating delivery chip */}
            <div className="absolute -right-4 bottom-20 bg-card rounded-2xl shadow-card px-4 py-3 hidden sm:block">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Delivered in
              </p>
              <p className="font-display font-extrabold text-lg text-primary leading-tight">
                22 min
              </p>
            </div>

            {/* Live order pill */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-foreground text-background rounded-full px-4 py-2 flex items-center gap-2 shadow-card whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold">2,847 orders today</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

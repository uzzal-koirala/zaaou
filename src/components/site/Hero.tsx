import { Rocket, Star } from "lucide-react";
import heroPerson from "@/assets/hero-person.png";
import floatingPizza from "@/assets/floating-pizza.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-peach">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[42rem] rounded-b-[3rem] bg-primary/90 opacity-90"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="rounded-[2.5rem] bg-card/80 backdrop-blur-sm shadow-card px-6 sm:px-10 lg:px-14 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div className="space-y-7">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground">
              Get Your <br />
              <span className="text-primary">Desire Food</span> <br />
              in 30 Minutes
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
              A meal at Zaaou is one you won't soon forget — Itahari's best kitchens, delivered hot and fresh to your door.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#app"
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-7 py-3.5 font-semibold shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all"
              >
                Order Now
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-xl bg-card border-2 border-border hover:border-primary text-foreground px-7 py-3.5 font-semibold transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative h-[420px] sm:h-[500px] lg:h-[560px]">
            {/* Orange splash background */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] w-[78%] rounded-[40%_55%_45%_60%/55%_45%_55%_45%] bg-gradient-primary opacity-95" />

            {/* Person */}
            <img
              src={heroPerson}
              alt="Happy customer enjoying Zaaou Food pizza delivery"
              width={1024}
              height={1024}
              className="absolute right-0 bottom-0 h-full w-auto object-contain object-bottom drop-shadow-2xl"
            />

            {/* Delivery card */}
            <div className="absolute top-[18%] left-0 sm:left-2 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 animate-float">
              <div className="h-10 w-10 rounded-xl bg-primary/15 grid place-items-center">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Delivery</p>
                <p className="text-xs text-primary font-semibold">In 30 Minutes</p>
              </div>
            </div>

            {/* Reviewer card */}
            <div className="absolute bottom-[18%] left-0 sm:left-4 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold text-sm">
                OF
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Omar Faruk</p>
                <div className="flex gap-0.5 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Pizza price card */}
            <div className="absolute right-2 sm:right-6 bottom-[8%] bg-card rounded-2xl shadow-card p-3 w-32">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-secondary mb-2">
                <img
                  src={floatingPizza}
                  alt="Wood-fired pizza slice"
                  width={512}
                  height={512}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="font-bold text-sm text-foreground">Pizza</p>
              <span className="inline-block mt-1 rounded-md bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5">
                Rs 450
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

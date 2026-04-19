import { Bike, Shield, Clock, HeartHandshake } from "lucide-react";
import riderHero from "@/assets/rider-hero.jpg";

const stats = [
  { icon: Bike, label: "Active Riders", value: "150+" },
  { icon: Clock, label: "Avg. Delivery", value: "28 min" },
  { icon: Shield, label: "Insured Trips", value: "100%" },
  { icon: HeartHandshake, label: "Rider Rating", value: "4.9★" },
];

export function Riders() {
  return (
    <section id="riders" className="relative py-20 lg:py-28 bg-muted/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div aria-hidden className="absolute -top-6 -left-6 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div aria-hidden className="absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

            <div className="relative rounded-[2rem] overflow-hidden shadow-glow ring-1 ring-border">
              <img
                src={riderHero}
                alt="Zaaou Food delivery rider with branded jacket and delivery box in Itahari"
                width={1280}
                height={1280}
                loading="lazy"
                className="w-full h-auto object-cover aspect-square"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-card/95 backdrop-blur rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary text-primary-foreground">
                  <Bike className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">On the way</p>
                  <p className="font-display font-extrabold text-sm leading-tight">Hot &amp; fresh, every time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              <Bike className="h-3.5 w-3.5" />
              Meet Our Riders
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              The friendly faces{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic font-light text-primary">behind</span>
                <span aria-hidden className="absolute left-0 right-0 bottom-1 h-3 bg-yellow-300/50 rounded-md -z-0" />
              </span>{" "}
              every order.
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              Our Zaaou riders know every gali of Itahari by heart. Trained,
              insured and powered by passion - they make sure your meal lands
              hot, fresh and right on time.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-3">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="font-display font-extrabold text-2xl text-foreground leading-none">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <a
                href="/careers"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold hover:bg-foreground/90 transition-colors shadow-soft"
              >
                <Bike className="h-4 w-4" />
                Become a Zaaou Rider
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

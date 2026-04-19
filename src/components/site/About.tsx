import { Heart, Utensils, Users, Award } from "lucide-react";
import dishThali from "@/assets/dish-thali.jpg";
import dishMomos from "@/assets/dish-momos.jpg";
import dishPizza from "@/assets/dish-pizza.jpg";
import logo from "@/assets/zaaou-logo.png";

const stats = [
  { icon: Users, value: "50K+", label: "Happy customers" },
  { icon: Utensils, value: "100+", label: "Partner restaurants" },
  { icon: Heart, value: "250K+", label: "Meals delivered" },
  { icon: Award, value: "4.9★", label: "Average rating" },
];

export function About() {
  return (
    <section id="about" className="relative py-20 lg:py-28 bg-gradient-warm overflow-hidden">
      <div aria-hidden className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Image collage */}
        <div className="relative">
          <div className="relative grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4 h-[28rem] sm:h-[32rem]">
            <div className="col-span-4 row-span-4 rounded-[1.75rem] overflow-hidden shadow-card ring-1 ring-border/50">
              <img
                src={dishThali}
                alt="Authentic Nepali thali plate served by a Zaaou partner restaurant"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="col-span-2 row-span-3 rounded-[1.5rem] overflow-hidden shadow-card ring-1 ring-border/50">
              <img
                src={dishMomos}
                alt="Steaming plate of momos from Itahari kitchens"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="col-span-2 row-span-3 rounded-[1.5rem] overflow-hidden shadow-card ring-1 ring-border/50">
              <img
                src={dishPizza}
                alt="Wood-fired pizza from a Zaaou partner restaurant"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="col-span-4 row-span-2 rounded-[1.5rem] bg-gradient-hero text-primary-foreground p-5 shadow-glow flex items-center gap-4">
              <img src={logo} alt="Zaaou Food" className="h-14 w-14 rounded-xl bg-white/15 p-1.5 shrink-0" />
              <div>
                <p className="font-display font-extrabold text-lg leading-tight">
                  Made with ♥ in Itahari
                </p>
                <p className="text-xs text-white/80 mt-1">
                  Built by locals, for the city we love.
                </p>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -right-2 sm:-right-6 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 ring-1 ring-border/60">
            <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold leading-none">
                Since 2023
              </p>
              <p className="font-display font-extrabold text-sm text-foreground leading-tight mt-1">
                Itahari's #1
              </p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border shadow-sm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground/80">
            <Heart className="h-3.5 w-3.5 text-primary fill-current" />
            About Zaaou Food
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.05] text-foreground">
            More than delivery —{" "}
            <span className="text-gradient-primary">a taste of Itahari</span>{" "}
            in every bite.
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Zaaou Food was born from a simple idea: the city's best kitchens
            deserve to be just a tap away. We partner with handpicked
            restaurants — from neighbourhood Thakali joints to wood-fired
            pizzerias — and connect them with hungry customers through one
            beautifully simple app.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            Every order supports a local business, every rider is from the
            community, and every meal is delivered with the care of a city
            that loves its food.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl bg-card border border-border/60 p-4 hover:border-primary/40 hover:shadow-soft transition-all"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center mb-3">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="font-display font-extrabold text-2xl text-foreground leading-none">
                  {value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-tight">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

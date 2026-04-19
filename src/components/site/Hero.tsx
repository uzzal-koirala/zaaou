import { ArrowRight, Star, Clock, MapPin } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold ring-1 ring-white/20">
            <MapPin className="h-3.5 w-3.5" />
            Now delivering across Itahari
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight">
            Crave it. <br />
            Tap it. <span className="italic font-light">Devour it.</span>
          </h1>

          <p className="text-lg text-white/85 max-w-xl leading-relaxed">
            From sizzling momos to wood-fired pizzas — Itahari's best kitchens, delivered hot to your door in minutes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#app"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-primary px-7 py-4 font-semibold shadow-glow hover:shadow-soft transition-all hover:scale-[1.02]"
            >
              Download the App
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#restaurants"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-7 py-4 font-semibold ring-1 ring-white/25 hover:bg-white/15 transition-colors"
            >
              Browse Restaurants
            </a>
          </div>

          <div className="flex items-center gap-6 pt-6">
            <div>
              <div className="flex items-center gap-1 text-yellow-300">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-white/80 mt-1">4.9 from 12k+ orders</p>
            </div>
            <div className="h-10 w-px bg-white/25" />
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <div>
                <p className="font-bold leading-tight">25 min</p>
                <p className="text-xs text-white/75">Avg delivery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -m-10 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="relative animate-float">
            <img
              src={heroFood}
              alt="Delicious food collage with momos, pizza, biryani and burger"
              width={1024}
              height={1024}
              className="rounded-3xl shadow-glow w-full max-w-md mx-auto"
            />
            <div className="absolute -bottom-6 -left-4 bg-card text-card-foreground rounded-2xl shadow-card px-5 py-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Delivered in</p>
                <p className="font-bold text-sm">22 minutes</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-2 bg-card text-card-foreground rounded-2xl shadow-card px-4 py-3">
              <p className="text-xs text-muted-foreground">Today's orders</p>
              <p className="font-bold text-lg text-primary">2,847+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

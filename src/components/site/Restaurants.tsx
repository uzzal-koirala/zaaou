import { Star, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { restaurants } from "@/data/restaurants";

export function Restaurants() {
  const featured = restaurants.slice(0, 4);
  return (
    <section id="restaurants" className="py-20 lg:py-28 bg-cream">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Featured Kitchens</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Itahari's most <span className="italic font-light">loved</span> spots.
            </h2>
          </div>
          <Link to="/restaurants" className="text-primary font-semibold hover:underline underline-offset-4">
            See all restaurants →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((r) => (
            <div
              key={r.id}
              className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all hover:-translate-y-1.5 border border-border/60"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={r.img}
                  alt={r.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-card rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-card">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {r.rating}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight">{r.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{r.tag}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {r.time}
                  </span>
                  <span className="text-xs font-bold text-primary">{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

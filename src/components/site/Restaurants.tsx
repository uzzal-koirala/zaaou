import { useEffect, useState } from "react";
import { Star, Clock, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type Featured = {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  cover_image_url: string | null;
  rating: number | null;
  delivery_time_minutes: number | null;
  price_range: string | null;
};

export function Restaurants() {
  const [items, setItems] = useState<Featured[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("restaurants")
        .select("id, name, slug, cuisine, cover_image_url, rating, delivery_time_minutes, price_range")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(4);
      setItems(data ?? []);
    })();
  }, []);

  if (items.length === 0) return null;

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
          {items.map((r) => (
            <div
              key={r.id}
              className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all hover:-translate-y-1.5 border border-border/60"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {r.cover_image_url ? (
                  <img
                    src={r.cover_image_url}
                    alt={r.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Store className="h-10 w-10 text-primary/50" />
                  </div>
                )}
                {r.rating != null && r.rating > 0 && (
                  <div className="absolute top-3 left-3 bg-card rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-card">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    {Number(r.rating).toFixed(1)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight">{r.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{r.cuisine ?? ""}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {r.delivery_time_minutes ? `${r.delivery_time_minutes} min` : "—"}
                  </span>
                  {r.price_range && <span className="text-xs font-bold text-primary">{r.price_range}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

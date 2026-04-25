import { useEffect, useRef, useState } from "react";
import { Star, Clock, Store, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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
  map_url: string | null;
};

export function Restaurants() {
  const [items, setItems] = useState<Featured[]>([]);
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [autoplay.current],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("restaurants")
        .select("id, name, slug, cuisine, cover_image_url, rating, delivery_time_minutes, price_range, map_url")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(4);
      setItems((data ?? []) as Featured[]);
    })();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (items.length === 0) return null;

  const renderCard = (r: Featured) => (
    <div
      key={r.id}
      className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all hover:-translate-y-1.5 border border-border/60 h-full"
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
        {r.map_url && (
          <a
            href={r.map_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
          >
            <MapPin className="h-3.5 w-3.5" /> Get directions
          </a>
        )}
      </div>
    </div>
  );

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

        {/* Mobile: looping carousel */}
        <div className="sm:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {items.map((r) => (
                <div key={r.id} className="shrink-0 grow-0 basis-[85%] min-w-0">
                  {renderCard(r)}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === i ? "w-6 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((r) => renderCard(r))}
        </div>
      </div>
    </section>
  );
}

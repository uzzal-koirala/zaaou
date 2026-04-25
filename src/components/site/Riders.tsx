import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Bike, Star, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Rider = Database["public"]["Tables"]["riders"]["Row"];

const AVATAR_GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-indigo-500",
  "from-fuchsia-400 to-purple-500",
];

export function Riders() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: false },
    [autoplay.current],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("riders")
        .select("*")
        .eq("is_active", true)
        .order("status", { ascending: true })
        .order("rating", { ascending: false })
        .limit(8);
      if (active) {
        setRiders(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!loading && riders.length === 0) return null;

  return (
    <section
      id="riders"
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
            <Bike className="h-3.5 w-3.5" />
            Our Riders
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            The heroes on <span className="text-gradient-primary">two wheels</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Meet the friendly faces delivering your favourite meals across Itahari.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-muted/50 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile: looping autoplay slider */}
            <div className="sm:hidden">
              <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
                <div className="flex gap-4">
                  {riders.map((r, i) => (
                    <div key={r.id} className="shrink-0 grow-0 basis-[80%]">
                      <RiderCard rider={r} index={i} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-1.5 mt-5">
                {riders.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-label={`Go to rider ${i + 1}`}
                    className={
                      "h-1.5 rounded-full transition-all " +
                      (i === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-primary/30")
                    }
                  />
                ))}
              </div>
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {riders.map((r, i) => (
                <RiderCard key={r.id} rider={r} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function RiderCard({ rider, index = 0 }: { rider: Rider; index?: number }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const isOnline = rider.status === "online";

  return (
    <div className="group relative rounded-3xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[4/5] overflow-hidden">
        {rider.avatar_url ? (
          <img
            src={rider.avatar_url}
            alt={rider.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div
            className={`absolute inset-0 grid place-items-center text-6xl font-display font-bold text-white bg-gradient-to-br ${gradient}`}
          >
            {rider.name
              .split(" ")
              .map((n) => n.charAt(0))
              .slice(0, 2)
              .join("")}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Status chip */}
        <div className="absolute top-4 left-4">
          <span
            className={
              "inline-flex items-center gap-1.5 rounded-full backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-soft " +
              (isOnline
                ? "bg-emerald-500/95 text-white"
                : "bg-background/95 text-muted-foreground")
            }
          >
            <span
              className={
                "h-1.5 w-1.5 rounded-full " +
                (isOnline ? "bg-white animate-pulse" : "bg-muted-foreground")
              }
            />
            {isOnline ? "Online" : rider.status}
          </span>
        </div>

        {/* Rating chip */}
        {rider.rating != null && Number(rider.rating) > 0 && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/95 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-foreground shadow-soft">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {Number(rider.rating).toFixed(1)}
            </span>
          </div>
        )}

        {/* Name + meta overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display font-bold text-xl text-white leading-tight drop-shadow">
            {rider.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-white/85 font-medium">
            {rider.vehicle_type && (
              <span className="inline-flex items-center gap-1">
                <Bike className="h-3 w-3" />
                {rider.vehicle_type}
              </span>
            )}
            {rider.total_deliveries > 0 && (
              <>
                <span aria-hidden>•</span>
                <span>{rider.total_deliveries}+ deliveries</span>
              </>
            )}
          </div>
          {rider.phone && (
            <a
              href={`tel:${rider.phone}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Phone className="h-3 w-3" />
              {rider.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

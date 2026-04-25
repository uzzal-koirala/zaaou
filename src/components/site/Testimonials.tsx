import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("reviews")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (!cancelled) setReviews(data ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Loved in Itahari
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            What our customers <span className="italic font-light">are saying</span>.
          </h2>
        </div>

        {/* Mobile: horizontal scroll slider */}
        <div className="md:hidden -mx-5 px-5">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {reviews.map((r) => (
              <figure
                key={r.id}
                className="bg-card rounded-3xl p-6 shadow-card border border-border/60 relative shrink-0 w-[85%] snap-center"
              >
                <Quote className="h-7 w-7 text-primary/20 mb-3" />
                <div className="flex gap-0.5 text-yellow-500 mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-foreground/85 leading-relaxed text-sm mb-5">
                  "{r.content}"
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-border">
                  {r.avatar_url ? (
                    <img
                      src={r.avatar_url}
                      alt={r.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-bold">
                      {r.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm leading-tight">{r.name}</p>
                    {r.role && <p className="text-xs text-muted-foreground">{r.role}</p>}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r) => (
            <figure
              key={r.id}
              className="bg-card rounded-3xl p-7 shadow-card border border-border/60 hover:-translate-y-1 transition-transform relative"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-3" />
              <div className="flex gap-0.5 text-yellow-500 mb-3">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-foreground/85 leading-relaxed text-sm mb-5">
                "{r.content}"
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-border">
                {r.avatar_url ? (
                  <img
                    src={r.avatar_url}
                    alt={r.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-bold">
                    {r.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm leading-tight">{r.name}</p>
                  {r.role && <p className="text-xs text-muted-foreground">{r.role}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

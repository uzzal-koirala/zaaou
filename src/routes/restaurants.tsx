import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, Clock, MapPin, SlidersHorizontal, Loader2, Store } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { supabase } from "@/integrations/supabase/client";

type DBRestaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  description: string | null;
  cover_image_url: string | null;
  address: string | null;
  rating: number | null;
  delivery_time_minutes: number | null;
  price_range: string | null;
  tags: string[];
  is_featured: boolean;
  display_order: number;
};

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [
      { title: "All Restaurants - Zaaou Food Itahari" },
      {
        name: "description",
        content:
          "Browse and search every restaurant on Zaaou Food. Filter by cuisine, rating and delivery time across Itahari.",
      },
      { property: "og:title", content: "All Restaurants - Zaaou Food Itahari" },
      {
        property: "og:description",
        content:
          "Browse and search every restaurant on Zaaou Food. Filter by cuisine, rating and delivery time across Itahari.",
      },
    ],
  }),
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const [items, setItems] = useState<DBRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [sort, setSort] = useState<"rating" | "fastest" | "name">("rating");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("restaurants")
        .select(
          "id, name, slug, cuisine, description, cover_image_url, address, rating, delivery_time_minutes, price_range, tags, is_featured, display_order",
        )
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      setItems(data ?? []);
      setLoading(false);
    })();
  }, []);

  const cuisineFilters = useMemo(() => {
    const set = new Set<string>();
    items.forEach((r) => {
      r.tags?.forEach((t) => set.add(t));
      if (r.cuisine) {
        r.cuisine.split(/[·,]/).forEach((c) => {
          const v = c.trim();
          if (v) set.add(v);
        });
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((r) => {
      const haystack = [r.name, r.cuisine ?? "", r.description ?? "", r.address ?? "", ...(r.tags ?? [])]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesCuisine =
        activeCuisine === "All" ||
        r.tags?.includes(activeCuisine) ||
        (r.cuisine ?? "").toLowerCase().includes(activeCuisine.toLowerCase());
      return matchesQuery && matchesCuisine;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "name") return a.name.localeCompare(b.name);
      return (a.delivery_time_minutes ?? 999) - (b.delivery_time_minutes ?? 999);
    });

    return list;
  }, [items, query, activeCuisine, sort]);

  return (
    <PageShell>
      <section className="relative bg-gradient-peach overflow-hidden">
        <div aria-hidden className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-14 pb-12 lg:pt-20 lg:pb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Restaurants in Itahari
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.05]">
            Discover every kitchen on{" "}
            <span className="text-gradient-primary">Zaaou Food</span>.
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mt-4">
            Search by name, cuisine or area - and filter to find exactly what you're craving today.
          </p>

          <div className="mt-8 flex flex-row gap-2 sm:gap-3 max-w-3xl">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants…"
                className="w-full h-12 sm:h-14 pl-9 sm:pl-12 pr-3 sm:pr-4 rounded-2xl bg-card border-2 border-border focus:border-primary focus:outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground transition-colors shadow-card"
              />
            </div>
            <div className="relative shrink-0 w-[110px] sm:w-auto">
              <SlidersHorizontal className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full h-12 sm:h-14 pl-7 sm:pl-12 pr-2 sm:pr-8 rounded-2xl bg-card border-2 border-border focus:border-primary focus:outline-none text-[11px] sm:text-base text-foreground font-medium shadow-card appearance-none cursor-pointer"
              >
                <option value="rating">Top rated</option>
                <option value="fastest">Fastest</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {cuisineFilters.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-none">
              {cuisineFilters.map((c) => {
                const active = activeCuisine === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCuisine(c)}
                    className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold border-2 transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "restaurant" : "restaurants"} found
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border">
              <p className="font-display text-2xl font-bold mb-2">No matches</p>
              <p className="text-muted-foreground">Try a different search or filter.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r) => (
                <article
                  key={r.id}
                  className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all hover:-translate-y-1.5 border border-border/60"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {r.cover_image_url ? (
                      <img
                        src={r.cover_image_url}
                        alt={r.name}
                        width={800}
                        height={600}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <Store className="h-12 w-12 text-primary/50" />
                      </div>
                    )}
                    {r.rating != null && r.rating > 0 && (
                      <div className="absolute top-3 left-3 bg-card rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-card">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        {Number(r.rating).toFixed(1)}
                      </div>
                    )}
                    {r.is_featured && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg leading-tight">{r.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{r.cuisine ?? ""}</p>
                    {r.address && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{r.address}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {r.delivery_time_minutes ? `${r.delivery_time_minutes} min` : "—"}
                      </span>
                      {r.price_range && (
                        <span className="text-xs font-bold text-primary">{r.price_range}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <p className="text-muted-foreground mb-4">Own a restaurant in Itahari?</p>
            <Link
              to="/partner"
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-7 py-3.5 font-semibold shadow-soft hover:shadow-glow transition-all"
            >
              Add your restaurant to Zaaou
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

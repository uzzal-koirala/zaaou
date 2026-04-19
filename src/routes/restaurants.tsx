import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, Clock, MapPin, SlidersHorizontal } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { restaurants, cuisineFilters } from "@/data/restaurants";

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [
      { title: "All Restaurants — Zaaou Food Itahari" },
      { name: "description", content: "Browse and search every restaurant on Zaaou Food. Filter by cuisine, rating and delivery time across Itahari." },
      { property: "og:title", content: "All Restaurants — Zaaou Food Itahari" },
      { property: "og:description", content: "Browse and search every restaurant on Zaaou Food. Filter by cuisine, rating and delivery time across Itahari." },
    ],
  }),
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const [query, setQuery] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [sort, setSort] = useState<"rating" | "fastest" | "name">("rating");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = restaurants.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.tag.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q)) ||
        r.area.toLowerCase().includes(q);
      const matchesCuisine =
        activeCuisine === "All" || r.cuisines.includes(activeCuisine);
      return matchesQuery && matchesCuisine;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "name") return a.name.localeCompare(b.name);
      // fastest = parse first number from time
      const parse = (t: string) => parseInt(t, 10) || 999;
      return parse(a.time) - parse(b.time);
    });

    return list;
  }, [query, activeCuisine, sort]);

  return (
    <PageShell>
      {/* Hero */}
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
            Search by name, cuisine or area — and filter to find exactly what you're craving today.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants, cuisines or areas…"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground transition-colors shadow-card"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="h-14 pl-12 pr-8 rounded-2xl bg-card border-2 border-border focus:border-primary focus:outline-none text-foreground font-medium shadow-card appearance-none cursor-pointer"
              >
                <option value="rating">Top rated</option>
                <option value="fastest">Fastest delivery</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Cuisine chips */}
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

          <div className="flex items-center justify-between mt-6 mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "restaurant" : "restaurants"} found
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border">
              <p className="font-display text-2xl font-bold mb-2">No matches</p>
              <p className="text-muted-foreground">
                Try a different search or filter.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r) => (
                <article
                  key={r.id}
                  className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all hover:-translate-y-1.5 border border-border/60"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={r.img}
                      alt={r.name}
                      width={800}
                      height={600}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-card rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-card">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {r.rating}
                      <span className="text-muted-foreground font-medium">
                        ({r.reviews})
                      </span>
                    </div>
                    {r.featured && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg leading-tight">{r.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{r.tag}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{r.area}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {r.time}
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {r.price}
                      </span>
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

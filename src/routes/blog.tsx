import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Search, Loader2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { BlogCard } from "@/components/blog/BlogCard";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

type PostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
  authors: { name: string; slug: string; avatar_url: string | null } | null;
};

export const Route = createFileRoute("/blog")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Blog — Zaaou Food" },
      { name: "description", content: "Stories, restaurant guides, recipes and updates from Zaaou Food in Itahari." },
      { property: "og:title", content: "Blog — Zaaou Food" },
      { property: "og:description", content: "Stories, restaurant guides, recipes and updates from Zaaou Food in Itahari." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { category, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q ?? "");

  useEffect(() => {
    setSearchInput(q ?? "");
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      let query = supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_image_url, category, published_at, reading_time_minutes, authors(name, slug, avatar_url)")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (category) query = query.eq("category", category);
      if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);

      const { data } = await query;
      if (!cancelled) {
        setPosts((data as PostListItem[] | null) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, q]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [posts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: (prev: { category?: string; q?: string }) => ({ ...prev, q: searchInput || undefined }) });
  }

  return (
    <PageShell>
      <section className="bg-gradient-to-b from-primary/5 via-background to-background pt-12 pb-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Zaaou Journal</p>
          <h1 className="mt-3 font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-foreground">
            The Blog
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            Restaurant guides, food stories, recipes and the latest from Zaaou Food in Itahari.
          </p>
          <form onSubmit={handleSearch} className="mt-7 mx-auto max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-border bg-background pl-11 pr-4 py-3 text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-20">
        {(categories.length > 0 || category) && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <Link
              to="/blog"
              search={{ category: undefined, q: q || undefined }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors ${
                !category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground/70 border-border hover:border-primary"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                to="/blog"
                search={{ category: c, q: q || undefined }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors ${
                  category === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground/70 border-border hover:border-primary"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              {q || category ? "No posts match your filters." : "No posts published yet — check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

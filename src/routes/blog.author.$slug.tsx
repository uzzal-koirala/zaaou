import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Author = Database["public"]["Tables"]["authors"]["Row"];

export const Route = createFileRoute("/blog/author/$slug")({
  loader: async ({ params }) => {
    const { data: author } = await supabase
      .from("authors")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle();

    if (!author) throw notFound();

    const { data: posts } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, cover_image_url, category, published_at, reading_time_minutes, authors(name, slug, avatar_url)")
      .eq("status", "published")
      .eq("author_id", author.id)
      .order("published_at", { ascending: false });

    return { author: author as Author, posts: posts ?? [] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Author not found" }] };
    const { author } = loaderData;
    return {
      meta: [
        { title: `${author.name} - Zaaou Food` },
        { name: "description", content: author.bio ?? `Articles by ${author.name} on Zaaou Food.` },
        { property: "og:title", content: `${author.name} - Zaaou Food` },
        { property: "og:description", content: author.bio ?? `Articles by ${author.name}.` },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Author not found</h1>
        <Link to="/blog" className="mt-6 inline-flex rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
          Back to blog
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    </PageShell>
  ),
  component: AuthorPage,
});

function AuthorPage() {
  const { author, posts } = Route.useLoaderData();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 lg:px-8 pt-10 pb-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        <AuthorCard author={author} />

        <h2 className="mt-12 font-display text-2xl font-bold">
          Articles by {author.name} {posts.length > 0 && <span className="text-muted-foreground">({posts.length})</span>}
        </h2>
        {posts.length === 0 ? (
          <p className="mt-6 text-muted-foreground">No articles yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p: { id: string } & React.ComponentProps<typeof BlogCard>["post"]) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

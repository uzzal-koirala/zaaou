import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Loader2, Calendar } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { ShareBar } from "@/components/blog/ShareBar";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { CommentSection } from "@/components/blog/CommentSection";
import { BlogCard } from "@/components/blog/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/blog-utils";
import type { Database } from "@/integrations/supabase/types";

type Author = Database["public"]["Tables"]["authors"]["Row"];

type PostFull = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  published_at: string | null;
  reading_time_minutes: number | null;
  seo_title: string | null;
  seo_description: string | null;
  authors: Author | null;
};

type BlogSettings = {
  comments_enabled: boolean;
  comments_auto_approve: boolean;
};

const defaultSettings: BlogSettings = {
  comments_enabled: true,
  comments_auto_approve: false,
};

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Blog Post — Zaaou Food" },
      { name: "description", content: "Read stories, restaurant guides and food updates from Zaaou Food." },
      { property: "og:title", content: "Blog Post — Zaaou Food" },
      { property: "og:description", content: "Read stories, restaurant guides and food updates from Zaaou Food." },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<PostFull | null>(null);
  const [settings, setSettings] = useState<BlogSettings>(defaultSettings);
  const [related, setRelated] = useState<Array<React.ComponentProps<typeof BlogCard>["post"]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      setLoading(true);
      setError(null);
      setPost(null);
      setRelated([]);

      const [{ data: postData, error: postError }, { data: settingsData }] = await Promise.all([
        supabase
          .from("posts")
          .select(
            "id, slug, title, excerpt, content, cover_image_url, category, tags, published_at, reading_time_minutes, seo_title, seo_description, authors(*)",
          )
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle(),
        supabase
          .from("blog_settings")
          .select("comments_enabled, comments_auto_approve")
          .eq("singleton", true)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      if (postError) {
        setError(postError.message);
        setLoading(false);
        return;
      }

      setPost((postData as PostFull | null) ?? null);
      setSettings(settingsData ?? defaultSettings);
      setLoading(false);
    }

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    const category = post?.category;
    const postId = post?.id;
    if (!category || !postId) return;

    let cancelled = false;

    async function loadRelated() {

      const { data } = await supabase
        .from("posts")
        .select(
          "id, slug, title, excerpt, cover_image_url, category, published_at, reading_time_minutes, authors(name, slug, avatar_url)",
        )
        .eq("status", "published")
        .eq("category", category as string)
        .neq("id", postId as string)
        .order("published_at", { ascending: false })
        .limit(3);

      if (!cancelled) {
        setRelated((data as Array<React.ComponentProps<typeof BlogCard>["post"]> | null) ?? []);
      }
    }

    loadRelated();

    return () => {
      cancelled = true;
    };
  }, [post?.category, post?.id]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center px-5">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Couldn't load post</h1>
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <Link
            to="/blog"
            className="mt-6 inline-flex rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
          >
            Back to blog
          </Link>
        </div>
      </PageShell>
    );
  }

  if (!post) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Post not found</h1>
          <p className="mt-3 text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="mt-6 inline-flex rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
          >
            Back to blog
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-5 lg:px-8 pt-10 pb-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        {post.category && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            {post.category}
          </p>
        )}
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
        )}

        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {post.authors && (
            <Link
              to="/blog/author/$slug"
              params={{ slug: post.authors.slug }}
              className="flex items-center gap-2 group"
            >
              {post.authors.avatar_url ? (
                <img
                  src={post.authors.avatar_url}
                  alt={post.authors.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">
                  {post.authors.name.charAt(0)}
                </div>
              )}
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {post.authors.name}
              </span>
            </Link>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
          </span>
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.reading_time_minutes} min read
            </span>
          )}
        </div>
      </article>

      {post.cover_image_url && (
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover rounded-2xl shadow-soft"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 lg:px-8 pt-12">
        <MarkdownContent content={post.content} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex items-center gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-muted text-foreground/70 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-border">
          {shareUrl && <ShareBar url={shareUrl} title={post.title} />}
        </div>

        {post.authors && (
          <div className="mt-10">
            <AuthorCard author={post.authors} />
          </div>
        )}

        <CommentSection
          postId={post.id}
          commentsEnabled={settings.comments_enabled}
          autoApprove={settings.comments_auto_approve}
        />

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold mb-6">More stories</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

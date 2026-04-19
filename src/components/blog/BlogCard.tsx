import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/blog-utils";

type Props = {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    cover_image_url: string | null;
    category: string | null;
    published_at: string | null;
    reading_time_minutes: number | null;
    authors: { name: string; slug: string; avatar_url: string | null } | null;
  };
};

export function BlogCard({ post }: Props) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-glow transition-all hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 grid place-items-center text-primary/40 font-display font-bold text-3xl">
            Zaaou
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col p-5">
        {post.category && (
          <span className="self-start text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-2">
            {post.category}
          </span>
        )}
        <h3 className="font-display font-bold text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{post.authors?.name ?? "Zaaou Food"}</span>
          <div className="flex items-center gap-3">
            {post.reading_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.reading_time_minutes} min
              </span>
            )}
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

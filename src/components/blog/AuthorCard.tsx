import { Link } from "@tanstack/react-router";
import { Globe, Linkedin, Facebook } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Author = Database["public"]["Tables"]["authors"]["Row"];

export function AuthorCard({ author }: { author: Author }) {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const socials = [
    { url: author.twitter_url, label: "X / Twitter", icon: XIcon },
    { url: author.facebook_url, label: "Facebook", icon: Facebook },
    { url: author.linkedin_url, label: "LinkedIn", icon: Linkedin },
    { url: author.instagram_url, label: "Instagram", icon: InstagramIcon },
    { url: author.website_url, label: "Website", icon: Globe },
  ].filter((s) => s.url);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft">
      <div className="flex items-start gap-4">
        {author.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={author.name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary/10 text-primary grid place-items-center font-display font-bold text-xl ring-2 ring-primary/20">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            About the author
          </p>
          <Link
            to="/blog/author/$slug"
            params={{ slug: author.slug }}
            className="block font-display text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            {author.name}
          </Link>
          {author.role && (
            <p className="text-sm text-muted-foreground">{author.role}</p>
          )}
        </div>
      </div>
      {author.bio && (
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{author.bio}</p>
      )}
      {socials.length > 0 && (
        <div className="mt-5 flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="h-9 w-9 grid place-items-center rounded-full border border-border bg-background text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <s.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

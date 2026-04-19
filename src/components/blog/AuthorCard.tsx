import { Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";
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
    { url: author.facebook_url, label: "Facebook", icon: FacebookIcon },
    { url: author.linkedin_url, label: "LinkedIn", icon: LinkedInIcon },
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

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

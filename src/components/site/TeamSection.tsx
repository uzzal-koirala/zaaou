import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </svg>
);
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.3 18.3v-8H5.7v8zM7 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11.3 9.3v-4.4c0-2.4-1.3-3.5-3-3.5-1.4 0-2 .8-2.4 1.3v-1.1H10.3c0 .7 0 8 0 8h2.6v-4.5c0-.2 0-.5.1-.7.2-.5.6-1 1.4-1 1 0 1.4.7 1.4 1.8v4.4z" />
  </svg>
);
const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(4);
      if (active) {
        setMembers(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!loading && members.length === 0) return null;

  return (
    <section id="team" className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background">
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Our Team
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            The faces behind <span className="text-gradient-primary">Zaaou Food</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A passionate crew bringing Itahari's favourite flavours to your doorstep.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-muted/50 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {members.map((m, i) => (
              <TeamCard key={m.id} member={m} index={i} />
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <Link
            to="/team"
            className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-all hover:-translate-y-0.5"
          >
            View full team
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const AVATAR_GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-indigo-500",
  "from-fuchsia-400 to-purple-500",
  "from-yellow-400 to-orange-500",
];

export function TeamCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const hasSocials =
    member.facebook_url || member.instagram_url || member.linkedin_url || member.twitter_url;

  return (
    <div className="group relative rounded-3xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2">
      {/* full photo */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div
            className={`absolute inset-0 grid place-items-center text-6xl font-display font-bold text-white bg-gradient-to-br ${gradient}`}
          >
            {member.name
              .split(" ")
              .map((n) => n.charAt(0))
              .slice(0, 2)
              .join("")}
          </div>
        )}

        {/* gradient overlay for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* role chip */}
        <div className="absolute top-4 left-4">
          <span className="inline-block rounded-full bg-background/95 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-soft">
            {member.role}
          </span>
        </div>

        {/* name + socials overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display font-bold text-xl text-white leading-tight drop-shadow">
            {member.name}
          </h3>
          {hasSocials && (
            <div className="mt-3 flex items-center gap-2 opacity-90 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
              {member.facebook_url && (
                <SocialLink href={member.facebook_url} label="Facebook">
                  <Facebook className="h-3.5 w-3.5" />
                </SocialLink>
              )}
              {member.instagram_url && (
                <SocialLink href={member.instagram_url} label="Instagram">
                  <Instagram className="h-3.5 w-3.5" />
                </SocialLink>
              )}
              {member.linkedin_url && (
                <SocialLink href={member.linkedin_url} label="LinkedIn">
                  <Linkedin className="h-3.5 w-3.5" />
                </SocialLink>
              )}
              {member.twitter_url && (
                <SocialLink href={member.twitter_url} label="Twitter">
                  <Twitter className="h-3.5 w-3.5" />
                </SocialLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center h-8 w-8 rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {children}
    </a>
  );
}

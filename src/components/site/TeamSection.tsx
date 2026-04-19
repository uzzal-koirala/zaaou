import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

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
        .limit(5);
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
    <section id="team" className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Our Team
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            The faces behind <span className="text-gradient-primary">Zaaou Food</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A passionate crew making sure Itahari gets its favourite food, on time, every time.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted/50 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {members.map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow"
          >
            View full team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/5] bg-muted overflow-hidden">
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-4xl font-bold text-primary bg-primary/10">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-foreground leading-tight">{member.name}</h3>
        <p className="mt-0.5 text-xs font-semibold text-primary uppercase tracking-wide">
          {member.role}
        </p>
        {member.bio && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{member.bio}</p>
        )}
        {(member.facebook_url ||
          member.instagram_url ||
          member.linkedin_url ||
          member.twitter_url) && (
          <div className="mt-3 flex items-center gap-2">
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
      className="grid place-items-center h-7 w-7 rounded-full bg-muted text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {children}
    </a>
  );
}

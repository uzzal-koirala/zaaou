import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { TeamCard } from "@/components/site/TeamSection";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — Zaaou Food" },
      {
        name: "description",
        content:
          "Meet the people behind Zaaou Food — the team making sure Itahari gets its favourite food on time, every time.",
      },
      { property: "og:title", content: "Our Team — Zaaou Food" },
      {
        property: "og:description",
        content:
          "Meet the people behind Zaaou Food — the team making sure Itahari gets its favourite food on time, every time.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (active) {
        setMembers(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-peach py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Our Team
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Meet the <span className="text-gradient-primary">Zaaou family</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground">
              From founders to riders, every member plays a part in delivering Itahari its
              favourite meals — fresh, fast and with a smile.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-muted-foreground py-20">
                Team members coming soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {members.map((m, i) => (
                  <TeamCard key={m.id} member={m} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

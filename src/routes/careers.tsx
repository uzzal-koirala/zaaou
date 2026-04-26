import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Heart,
  Rocket,
  GraduationCap,
  Coffee,
  Users,
  Loader2,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Job = Database["public"]["Tables"]["job_postings"]["Row"];

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers at Zaaou Food - Join the Itahari food revolution" },
      { name: "description", content: "Open roles at Zaaou Food. Join Itahari's fastest-growing food delivery team - engineering, operations, riders, marketing and more." },
      { property: "og:title", content: "Careers at Zaaou Food - Join the Itahari food revolution" },
      { property: "og:description", content: "Open roles at Zaaou Food. Join Itahari's fastest-growing food delivery team - engineering, operations, riders, marketing and more." },
    ],
  }),
  component: CareersPage,
});

const perks = [
  { icon: Heart, title: "Health Coverage", desc: "Medical insurance for you and your family." },
  { icon: Coffee, title: "Free Meals", desc: "Daily food credits on the Zaaou app." },
  { icon: GraduationCap, title: "Learning Budget", desc: "Annual stipend for courses and conferences." },
  { icon: Users, title: "Friendly Team", desc: "Flat hierarchy, transparent culture." },
  { icon: Rocket, title: "Fast Growth", desc: "Real ownership and rapid career progression." },
  { icon: Clock, title: "Flexible Hours", desc: "Hybrid schedule and reasonable working hours." },
];

export function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("job_postings")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setJobs(data ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-peach">
        <div aria-hidden className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Careers at Zaaou
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.05]">
            Help us feed{" "}
            <span className="text-gradient-primary">all of Itahari</span> - one delicious order at a time.
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mt-4">
            We're a small, ambitious team building the future of food delivery in Eastern Nepal. If you love food, technology and moving fast - you'll feel right at home.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              href="#openings"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-7 py-3.5 font-semibold shadow-soft hover:shadow-glow transition-all"
            >
              See open roles
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:careers@zaaoufoods.com"
              className="inline-flex items-center gap-2 rounded-xl bg-card border-2 border-border hover:border-primary/40 text-foreground px-7 py-3.5 font-semibold transition-colors"
            >
              Send us your CV
            </a>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Why Zaaou
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight">
              Real perks. Real growth. Real impact.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-3xl bg-card border border-border shadow-card"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary mb-4">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-1.5">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" className="py-16 lg:py-24 bg-cream">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Open Positions
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight">
              We're hiring across the team.
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl bg-card border border-dashed border-border p-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-foreground mb-2">
                No openings right now
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We don't have any open positions at the moment. Check back later — or send us your CV and we'll reach out when something opens up.
              </p>
              <a
                href="mailto:careers@zaaoufoods.com"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 mt-5 text-sm font-semibold hover:shadow-glow transition-all"
              >
                Send us your CV
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="group bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-primary/40 hover:shadow-soft transition-all flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                        {job.department}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        {job.job_type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={job.apply_url}
                    target={job.apply_url.startsWith("http") ? "_blank" : undefined}
                    rel={job.apply_url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:shadow-glow transition-all"
                  >
                    Apply now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-3xl bg-gradient-hero text-primary-foreground p-8 sm:p-10 text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold mb-2">
              Don't see your role?
            </h3>
            <p className="text-white/85 max-w-xl mx-auto mb-5">
              We're always open to meeting passionate people. Send us your CV and tell us how you can help.
            </p>
            <a
              href="mailto:careers@zaaoufoods.com"
              className="inline-flex items-center gap-2 rounded-xl bg-card text-foreground px-7 py-3.5 font-semibold hover:scale-[1.02] transition-transform"
            >
              careers@zaaoufoods.com
            </a>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

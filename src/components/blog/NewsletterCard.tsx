import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Compact newsletter signup card for the article sidebar.
 * Saves subscribers (name optional, email required) to the
 * `newsletter_subscribers` table for the admin to manage.
 */
export function NewsletterCard({ source = "blog-sidebar" }: { source?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!trimmedEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (trimmedName.length > 80) {
      toast.error("Name is too long");
      return;
    }
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({
      name: trimmedName || null,
      email: trimmedEmail,
      source,
    });
    if (error) {
      if (error.code === "23505") {
        setStatus("done");
        toast.success("You're already on the list!");
        return;
      }
      setStatus("idle");
      toast.error(error.message || "Could not subscribe");
      return;
    }
    setStatus("done");
    toast.success("You're subscribed!");
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-soft">
      <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" aria-hidden />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="grid place-items-center h-7 w-7 rounded-lg bg-primary/15 text-primary">
            <Mail className="h-3.5 w-3.5" />
          </span>
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
            Foodie newsletter
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          New restaurants, hidden gems and offers — straight to your inbox.
        </p>
        {status === "done" ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Check className="h-4 w-4" /> Subscribed — thanks!
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              maxLength={80}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={254}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-glow disabled:opacity-70 transition-shadow"
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

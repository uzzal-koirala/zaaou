import { useEffect, useState } from "react";
import { Bell, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Notif = Database["public"]["Tables"]["site_notifications"]["Row"];

const ROTATE_MS = 6000;
const FIRST_DELAY_MS = 4000;

export function SocialNotifications() {
  const [items, setItems] = useState<Notif[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Fetch settings + notifications
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: settings }, { data: notifs }] = await Promise.all([
        supabase
          .from("blog_settings")
          .select("notifications_enabled")
          .eq("singleton", true)
          .maybeSingle(),
        supabase
          .from("site_notifications")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      setEnabled(settings?.notifications_enabled ?? true);
      setItems(notifs ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initial show after delay
  useEffect(() => {
    if (!enabled || dismissed || items.length === 0) return;
    const t = setTimeout(() => setVisible(true), FIRST_DELAY_MS);
    return () => clearTimeout(t);
  }, [enabled, dismissed, items.length]);

  // Auto-rotate
  useEffect(() => {
    if (!visible || items.length <= 1) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 350);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [visible, items.length]);

  if (!enabled || dismissed || items.length === 0) return null;
  const current = items[index];
  if (!current) return null;

  return (
    <div
      className={[
        "fixed z-40 left-3 sm:left-5 bottom-3 sm:bottom-5",
        "max-w-[320px] sm:max-w-[360px]",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-card px-3 py-2.5 pr-7 relative">
        <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted grid place-items-center flex-shrink-0">
          {current.icon_url ? (
            <img
              src={current.icon_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <Bell className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-snug text-foreground line-clamp-3">
            {current.message}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {current.time_ago_label}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="absolute top-1.5 right-1.5 h-6 w-6 grid place-items-center rounded-full hover:bg-muted text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

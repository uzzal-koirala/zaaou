import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

/**
 * Shows a "we'll be right back" screen on public routes when maintenance_mode is on.
 * Admin/author routes always pass through so the team can keep working.
 */
export function MaintenanceGate({ children }: { children: ReactNode }) {
  const { settings, loading } = useSiteSettings();
  const location = useLocation();
  const path = location.pathname;

  const isPrivileged =
    path.startsWith("/admin") ||
    path.startsWith("/author") ||
    path.startsWith("/auth");

  if (loading || !settings || !settings.maintenance_mode || isPrivileged) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center">
          <Wrench className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">
          {settings.site_name} is taking a quick break
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {settings.maintenance_message}
        </p>
        <p className="mt-6 text-xs text-muted-foreground">
          Need help right now? Email{" "}
          <a className="text-primary font-semibold" href={`mailto:${settings.contact_email}`}>
            {settings.contact_email}
          </a>
        </p>
      </div>
    </div>
  );
}

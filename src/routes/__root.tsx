import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { RouteLoader } from "@/components/site/RouteLoader";
import { MaintenanceGate } from "@/components/site/MaintenanceGate";
import { NotFound } from "@/components/site/NotFound";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Zaaou Food -Food Delivery in Itahari" },
      { name: "description", content: "Order from your favourite restaurants in Itahari. Fast, fresh and on time - delivered by Zaaou Food." },
      { name: "author", content: "Zaaou Food" },
      { property: "og:title", content: "Zaaou Food -Food Delivery in Itahari" },
      { property: "og:description", content: "Order from your favourite restaurants in Itahari. Fast, fresh and on time - delivered by Zaaou Food." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Zaaou Food -Food Delivery in Itahari" },
      { name: "twitter:description", content: "Order from your favourite restaurants in Itahari. Fast, fresh and on time - delivered by Zaaou Food." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dc2741b4-ebf7-4634-9386-2d08a9023463/id-preview-a1f96e48--548acf30-8db7-4b9a-aeef-e20f2e4d95eb.lovable.app-1776576480073.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dc2741b4-ebf7-4634-9386-2d08a9023463/id-preview-a1f96e48--548acf30-8db7-4b9a-aeef-e20f2e4d95eb.lovable.app-1776576480073.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <RouteLoader />
      <MaintenanceGate>
        <Outlet />
      </MaintenanceGate>
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}

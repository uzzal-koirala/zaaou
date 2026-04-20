import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = "https://feoldndpvrvtdcbdycae.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb2xkbmRwdnJ2dGRjYmR5Y2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NzM5MTcsImV4cCI6MjA5MjE0OTkxN30.H_LYSt7hL5uOsWZigkhHijU6FSxgfh9iaJP_GoInHdU";

// Public, indexable pages only.
// Excluded on purpose: /admin/*, /author/*, /auth (private/confidential).
const STATIC_ROUTES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/restaurants", priority: 0.9, changefreq: "daily" },
  { path: "/blog", priority: 0.9, changefreq: "daily" },
  { path: "/team", priority: 0.6, changefreq: "monthly" },
  { path: "/careers", priority: 0.7, changefreq: "weekly" },
  { path: "/partner", priority: 0.7, changefreq: "monthly" },
];

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getOrigin(request: Request) {
  const url = new URL(request.url);
  // Prefer forwarded host (behind proxies) so the sitemap lists the public domain.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? url.host;
  const proto = forwardedProto ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = getOrigin(request);
        const today = new Date().toISOString().split("T")[0];

        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Pull dynamic content (RLS already restricts to published / active rows for anon).
        const [postsRes, restaurantsRes, authorsRes] = await Promise.all([
          supabase
            .from("posts")
            .select("slug, updated_at, published_at")
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(1000),
          supabase
            .from("restaurants")
            .select("slug, updated_at")
            .eq("is_active", true)
            .limit(1000),
          supabase.from("authors").select("slug, updated_at").limit(1000),
        ]);

        const urls: string[] = [];

        for (const r of STATIC_ROUTES) {
          urls.push(
            `  <url>\n    <loc>${origin}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
          );
        }

        for (const p of postsRes.data ?? []) {
          const lastmod = (p.updated_at ?? p.published_at ?? new Date().toISOString())
            .toString()
            .split("T")[0];
          urls.push(
            `  <url>\n    <loc>${origin}/blog/${escapeXml(p.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
          );
        }

        for (const a of authorsRes.data ?? []) {
          const lastmod = (a.updated_at ?? new Date().toISOString()).toString().split("T")[0];
          urls.push(
            `  <url>\n    <loc>${origin}/blog/author/${escapeXml(a.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`,
          );
        }

        // Restaurants currently render on /restaurants (no detail page yet);
        // including their slugs would 404. Skip until detail routes exist.
        void restaurantsRes;

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});

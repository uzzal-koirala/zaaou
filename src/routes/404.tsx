import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/site/NotFound";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "404 — Page Not Found | Zaaou Food" },
      { name: "description", content: "The page you're looking for doesn't exist or has been moved." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NotFound,
});

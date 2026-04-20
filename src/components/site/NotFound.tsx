import { Link } from "@tanstack/react-router";
import { Home, Search, ArrowLeft, UtensilsCrossed } from "lucide-react";
import logo from "@/assets/zaaou-logo.png";

export function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative blurred blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
        {/* Brand */}
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2.5 rounded-full bg-card/70 px-4 py-2 ring-1 ring-border backdrop-blur transition-shadow hover:shadow-soft"
        >
          <img src={logo} alt="" className="h-7 w-7 rounded-md" />
          <span className="font-display text-sm font-extrabold tracking-tight">
            Zaaou
          </span>
        </Link>

        {/* Big 404 with floating icon */}
        <div className="relative">
          <h1 className="font-display text-[8rem] font-extrabold leading-none tracking-tighter text-foreground sm:text-[12rem]">
            <span className="bg-gradient-to-br from-primary via-primary to-yellow-400 bg-clip-text text-transparent">
              4
            </span>
            <span className="relative inline-block px-2">
              <span className="bg-gradient-to-br from-primary via-primary to-yellow-400 bg-clip-text text-transparent">
                0
              </span>
              <span
                aria-hidden
                className="absolute inset-2 grid place-items-center"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-card shadow-glow ring-1 ring-border sm:h-24 sm:w-24">
                  <UtensilsCrossed className="h-7 w-7 text-primary sm:h-12 sm:w-12" />
                </span>
              </span>
            </span>
            <span className="bg-gradient-to-br from-primary via-primary to-yellow-400 bg-clip-text text-transparent">
              4
            </span>
          </h1>
        </div>

        {/* Tag */}
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Page not found
        </span>

        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Looks like this dish is{" "}
          <span className="relative inline-block">
            <span className="relative z-10 italic font-light text-primary">
              off the menu
            </span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-md bg-yellow-300/50"
            />
          </span>
        </h2>

        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you're craving doesn't exist or has been moved. Let's get you
          back to something delicious.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Search className="h-4 w-4" />
            Browse restaurants
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <Link to="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <span aria-hidden className="opacity-30">
            •
          </span>
          <Link to="/team" className="hover:text-primary transition-colors">
            Team
          </Link>
          <span aria-hidden className="opacity-30">
            •
          </span>
          <Link to="/careers" className="hover:text-primary transition-colors">
            Careers
          </Link>
          <span aria-hidden className="opacity-30">
            •
          </span>
          <Link to="/partner" className="hover:text-primary transition-colors">
            Partner with us
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Or go back to the previous page
        </button>
      </div>
    </div>
  );
}

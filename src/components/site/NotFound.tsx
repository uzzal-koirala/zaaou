import { Link } from "@tanstack/react-router";
import { Home, Search, ArrowLeft, UtensilsCrossed, Pizza, Coffee, Cookie, IceCream } from "lucide-react";
import logo from "@/assets/zaaou-logo.png";

const floatingFoods = [
  { Icon: Pizza, top: "12%", left: "8%", delay: "0s", size: 28, rotate: "-12deg" },
  { Icon: Coffee, top: "22%", right: "10%", delay: "0.4s", size: 24, rotate: "14deg" },
  { Icon: Cookie, bottom: "28%", left: "12%", delay: "0.8s", size: 26, rotate: "8deg" },
  { Icon: IceCream, bottom: "18%", right: "14%", delay: "1.2s", size: 28, rotate: "-10deg" },
  { Icon: Pizza, top: "60%", left: "4%", delay: "1.6s", size: 20, rotate: "20deg" },
  { Icon: Cookie, top: "8%", right: "30%", delay: "2s", size: 18, rotate: "-18deg" },
];

export function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative blurred blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-yellow-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating food icons */}
      {floatingFoods.map(({ Icon, size, delay, rotate, ...pos }, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute hidden text-primary/30 sm:block"
          style={{
            ...pos,
            animation: `float-404 6s ease-in-out ${delay} infinite`,
            transform: `rotate(${rotate})`,
          }}
        >
          <Icon size={size} strokeWidth={1.8} />
        </div>
      ))}

      <style>{`
        @keyframes float-404 {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-18px) rotate(var(--r, 0deg)); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4); }
          50% { box-shadow: 0 0 0 16px hsl(var(--primary) / 0); }
        }
      `}</style>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
        {/* Brand */}
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2.5 rounded-full bg-card/80 px-4 py-2 ring-1 ring-border backdrop-blur-md transition-all hover:shadow-soft hover:ring-primary/30"
        >
          <img src={logo} alt="" className="h-7 w-7 rounded-md" />
          <span className="font-display text-sm font-extrabold tracking-tight">
            Zaaou
          </span>
        </Link>

        {/* Big 404 with floating icon */}
        <div className="relative">
          <h1 className="font-display text-[8rem] font-extrabold leading-none tracking-tighter sm:text-[13rem]">
            <span className="bg-gradient-to-br from-primary via-primary to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_4px_30px_hsl(var(--primary)/0.4)]">
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
                <span
                  className="grid h-16 w-16 place-items-center rounded-full bg-card shadow-glow ring-1 ring-border sm:h-24 sm:w-24"
                  style={{ animation: "pulse-ring 2.5s ease-out infinite" }}
                >
                  <UtensilsCrossed className="h-7 w-7 text-primary sm:h-12 sm:w-12" />
                </span>
              </span>
            </span>
            <span className="bg-gradient-to-br from-primary via-primary to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_4px_30px_hsl(var(--primary)/0.4)]">
              4
            </span>
          </h1>
        </div>

        {/* Tag */}
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Page not found
        </span>

        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Looks like this dish is{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10 font-light italic text-primary">
              off the menu
            </span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-md bg-yellow-300/60"
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
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
            Back to home
          </Link>
          <Link
            to="/restaurants"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-bold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-soft"
          >
            <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
            Browse restaurants
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
          <Link to="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
          <span aria-hidden className="opacity-30">•</span>
          <Link to="/team" className="transition-colors hover:text-primary">
            Team
          </Link>
          <span aria-hidden className="opacity-30">•</span>
          <Link to="/careers" className="transition-colors hover:text-primary">
            Careers
          </Link>
          <span aria-hidden className="opacity-30">•</span>
          <Link to="/partner" className="transition-colors hover:text-primary">
            Partner with us
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Or go back to the previous page
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Home, Store, Newspaper, PlusCircle, Briefcase, LifeBuoy } from "lucide-react";
import logo from "@/assets/zaaou-logo.png";

type NavLink = {
  label: string;
  to: "/restaurants" | "/careers" | "/partner" | "/blog" | "/support";
  icon: typeof Home;
};

const links: NavLink[] = [
  { to: "/restaurants", label: "Restaurants", icon: Store },
  { to: "/blog", label: "Blog", icon: Newspaper },
  { to: "/partner", label: "Add Restaurant", icon: PlusCircle },
  { to: "/careers", label: "Careers", icon: Briefcase },
  { to: "/support", label: "Contact", icon: LifeBuoy },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-18 flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Zaaou Food" className="h-11 w-11 rounded-xl shadow-soft" />
          <div className="leading-tight">
            <span className="block font-display font-extrabold text-xl tracking-tight text-foreground">
              Zaaou
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Food Delivery
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
            className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
          >
            Home
          </Link>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a
          href="/#app"
          className="hidden md:inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow"
        >
          Order Now
        </a>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted active:scale-95 transition-all"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile backdrop */}
      <div
        className={[
          "md:hidden fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-md transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Mobile side drawer (slides from left → right, half width) */}
      <aside
        className={[
          "md:hidden fixed top-0 left-0 z-[70] h-[100dvh] w-[68%] max-w-[320px]",
          "bg-card shadow-2xl shadow-foreground/20 rounded-r-2xl border-r border-border/60",
          "flex flex-col",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        {/* Drawer header */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 min-w-0"
          >
            <img src={logo} alt="" className="h-9 w-9 rounded-lg shadow-soft flex-shrink-0" />
            <div className="leading-tight min-w-0">
              <span className="block font-display font-extrabold text-base truncate">
                Zaaou
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Food Delivery
              </span>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted active:scale-95 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
            Menu
          </p>
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{
                  className: "bg-primary/10 text-primary font-semibold border-primary/30",
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground border border-transparent transition-colors"
              >
                <Home className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="truncate">Home</span>
              </Link>
            </li>
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeProps={{
                      className:
                        "bg-primary/10 text-primary font-semibold border-primary/30",
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground border border-transparent transition-colors"
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <span className="truncate">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer footer CTA */}
        <div className="p-4 border-t border-border bg-muted/40">
          <a
            href="/#app"
            onClick={() => setOpen(false)}
            className="block text-center rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow"
          >
            Order Now
          </a>
        </div>
      </aside>
    </header>
  );
}

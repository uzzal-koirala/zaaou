import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logo from "@/assets/zaaou-logo.png";

type NavLink = { label: string } & (
  | { kind: "hash"; href: string }
  | { kind: "route"; to: "/restaurants" | "/careers" | "/partner" | "/blog" }
);

const links: NavLink[] = [
  { kind: "route", to: "/restaurants", label: "Restaurants" },
  { kind: "route", to: "/blog", label: "Blog" },
  { kind: "hash", href: "/#how", label: "How it works" },
  { kind: "route", to: "/partner", label: "Add Restaurant" },
  { kind: "route", to: "/careers", label: "Careers" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

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
          {links.map((l) =>
            l.kind === "route" ? (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-primary" }}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        <a
          href="/#app"
          className="hidden md:inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow"
        >
          Order Now
        </a>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-5 py-4 flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-foreground/80"
            >
              Home
            </Link>
            {links.map((l) =>
              l.kind === "route" ? (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium text-foreground/80"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium text-foreground/80"
                >
                  {l.label}
                </a>
              ),
            )}
            <a
              href="/#app"
              onClick={() => setOpen(false)}
              className="mt-2 text-center rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

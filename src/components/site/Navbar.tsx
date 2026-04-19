import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/zaaou-logo.png";

const links = [
  { href: "#restaurants", label: "Restaurants" },
  { href: "#how", label: "How it works" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#app", label: "Get the App" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-18 flex items-center justify-between py-3">
        <a href="#" className="flex items-center gap-2.5">
          <img src={logo} alt="Zaaou Food" className="h-11 w-11 rounded-xl shadow-soft" />
          <div className="leading-tight">
            <span className="block font-display font-extrabold text-xl tracking-tight text-foreground">
              Zaaou
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Food Delivery
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-semibold text-primary">Home</a>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#app"
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
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-foreground/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#app"
              onClick={() => setOpen(false)}
              className="mt-2 text-center rounded-full bg-gradient-primary text-primary-foreground px-5 py-3 text-sm font-semibold"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

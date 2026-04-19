import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Home, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function ProfileMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const initials = user?.email?.[0]?.toUpperCase() ?? "A";
  const name = user?.email?.split("@")[0] ?? "Admin";

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-card border border-border pl-1 pr-3 py-1 hover:bg-muted hover:border-primary/40 transition-all shadow-sm"
      >
        <span className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-soft">
          {initials}
        </span>
        <span className="hidden sm:flex flex-col leading-tight items-start">
          <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
            {name}
          </span>
          <span className="text-[10px] text-muted-foreground">Admin</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-card border border-border shadow-card overflow-hidden animate-fade-in z-50"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-muted/40">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-base font-bold shadow-soft flex-shrink-0">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link
              to="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Home className="h-4 w-4 text-muted-foreground" />
              Visit site
            </Link>
            <button
              role="menuitem"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

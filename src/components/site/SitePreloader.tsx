import { useEffect, useState } from "react";

/**
 * Full-screen branded preloader shown until ALL <img> elements
 * currently in the DOM have finished loading (or errored).
 * Used on the home page to avoid showing a half-loaded hero / sections.
 */
export function SitePreloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const waitForImages = () => {
      const imgs = Array.from(document.images);
      const total = imgs.length;

      if (total === 0) {
        setProgress(100);
        setDone(true);
        return;
      }

      let loaded = 0;
      const tick = () => {
        loaded += 1;
        if (cancelled) return;
        const pct = Math.round((loaded / total) * 100);
        setProgress(pct);
        if (loaded >= total) setDone(true);
      };

      imgs.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          tick();
        } else {
          img.addEventListener("load", tick, { once: true });
          img.addEventListener("error", tick, { once: true });
        }
      });
    };

    // Wait for window.load OR a short delay so newly-mounted <img> tags exist
    if (document.readyState === "complete") {
      waitForImages();
    } else {
      const onLoad = () => waitForImages();
      window.addEventListener("load", onLoad, { once: true });
      // Safety: also try after a tick in case images render after window load
      const t = setTimeout(waitForImages, 800);
      return () => {
        cancelled = true;
        window.removeEventListener("load", onLoad);
        clearTimeout(t);
      };
    }

    // Hard cap: never block the page longer than 8s
    const failsafe = setTimeout(() => {
      if (cancelled) return;
      setProgress(100);
      setDone(true);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    // Allow fade-out animation to play, then unmount
    const t = setTimeout(() => setHidden(true), 600);
    return () => clearTimeout(t);
  }, [done]);

  // Lock scroll while loading
  useEffect(() => {
    if (hidden) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      role="status"
      aria-label="Loading Zaaou Food"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Soft brand glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-6">
        {/* Bouncing food + spinner */}
        <div className="relative h-24 w-24">
          <span
            className="absolute inset-0 flex items-center justify-center text-5xl"
            style={{ animation: "food-bounce 1s ease-in-out infinite" }}
          >
            🍔
          </span>
          <span
            className="absolute inset-0 rounded-full border-4 border-primary/15 border-t-primary"
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>

        {/* Brand */}
        <div className="text-center">
          <p className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Zaaou <span className="text-primary">Food</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Serving up something tasty…
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 max-w-[80vw]">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full bg-gradient-primary transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs font-medium text-muted-foreground tabular-nums">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import logo from "@/assets/zaaou-logo.png";

/**
 * Fast, branded preloader.
 *
 * Strategy (optimized for speed):
 * - Wait only for above-the-fold images (within ~1.5x viewport height).
 * - Lazy-loaded / offscreen images do NOT block the preloader.
 * - Hard cap: 2.5s — never block the page longer than that.
 * - Minimum show time: 350ms so the bar doesn't flash awkwardly.
 */
export function SitePreloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const startRef = useRef<number>(typeof performance !== "undefined" ? performance.now() : Date.now());

  useEffect(() => {
    let cancelled = false;
    const MIN_SHOW_MS = 350;
    const HARD_CAP_MS = 2500;

    const finish = () => {
      if (cancelled) return;
      const elapsed = (typeof performance !== "undefined" ? performance.now() : Date.now()) - startRef.current;
      const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
      setProgress(100);
      if (remaining === 0) {
        setDone(true);
      } else {
        setTimeout(() => {
          if (!cancelled) setDone(true);
        }, remaining);
      }
    };

    const collectCriticalImages = (): HTMLImageElement[] => {
      const all = Array.from(document.images);
      const viewportH = window.innerHeight || 800;
      const threshold = viewportH * 1.5;
      return all.filter((img) => {
        if (img.loading === "lazy") return false;
        const rect = img.getBoundingClientRect();
        // Image is critical if it intersects (or is above) the threshold zone
        return rect.top < threshold;
      });
    };

    const waitForImages = () => {
      const imgs = collectCriticalImages();
      const total = imgs.length;

      if (total === 0) {
        finish();
        return;
      }

      let loaded = 0;
      const tick = () => {
        loaded += 1;
        if (cancelled) return;
        const pct = Math.round((loaded / total) * 95); // cap at 95 until finish
        setProgress((p) => Math.max(p, pct));
        if (loaded >= total) finish();
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

    // Run immediately on next microtask — don't wait for window.load
    const startTimer = setTimeout(waitForImages, 0);

    // Hard cap
    const failsafe = setTimeout(finish, HARD_CAP_MS);

    // Smooth visual progress trickle so the bar is never frozen
    const trickle = setInterval(() => {
      if (cancelled) return;
      setProgress((p) => (p < 90 ? p + Math.max(1, Math.round((90 - p) * 0.08)) : p));
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      clearTimeout(failsafe);
      clearInterval(trickle);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setHidden(true), 350);
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
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-300 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-6">
        <div className="relative h-24 w-24">
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: "food-bounce 1s ease-in-out infinite" }}
          >
            <img
              src={logo}
              alt="Zaaou Food"
              className="h-14 w-14 rounded-2xl shadow-soft"
              fetchPriority="high"
            />
          </span>
          <span
            className="absolute inset-0 rounded-full border-4 border-primary/15 border-t-primary"
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>

        <div className="text-center">
          <p className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Zaaou <span className="text-primary">Food</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Serving up something tasty…
          </p>
        </div>

        <div className="w-64 max-w-[80vw]">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full bg-gradient-primary transition-[width] duration-200 ease-out"
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

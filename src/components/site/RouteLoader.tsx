import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Global navigation indicator.
 * - Shows a thin gradient progress bar at the top after a brief delay
 * - Shows a centered food-themed spinner overlay if navigation takes >250ms
 */
export function RouteLoader() {
  const status = useRouterState({ select: (s) => s.status });
  const isLoading = status === "pending";
  const [showBar, setShowBar] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowBar(false);
      setShowOverlay(false);
      return;
    }
    // Delay showing so it doesn't flash on initial hydration / fast nav.
    const barTimer = setTimeout(() => setShowBar(true), 120);
    const overlayTimer = setTimeout(() => setShowOverlay(true), 250);
    return () => {
      clearTimeout(barTimer);
      clearTimeout(overlayTimer);
    };
  }, [isLoading]);

  return (
    <>
      {/* Top progress bar */}
      <div
        aria-hidden
        className={`fixed left-0 right-0 top-0 z-[100] h-[3px] overflow-hidden pointer-events-none transition-opacity duration-200 ${
          showBar ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full bg-gradient-primary"
          style={{
            width: showBar ? "90%" : "0%",
            transition: showBar
              ? "width 8s cubic-bezier(0.1, 0.9, 0.2, 1)"
              : "width 0.3s ease-out",
          }}
        />
      </div>

      {/* Food-themed overlay spinner */}
      {showOverlay && (
        <div
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[99] flex items-center justify-center bg-background/70 backdrop-blur-sm animate-fade-in"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <span
                className="absolute inset-0 flex items-center justify-center text-4xl"
                style={{ animation: "food-bounce 1s ease-in-out infinite" }}
              >
                🍔
              </span>
              <span
                className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
                style={{ animation: "spin 1s linear infinite" }}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Serving up something tasty…
            </p>
          </div>
        </div>
      )}
    </>
  );
}

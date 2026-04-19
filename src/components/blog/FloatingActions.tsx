import { useEffect, useState } from "react";
import { ArrowUp, Bookmark, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Vertical floating action rail anchored to the left of the article on
 * large screens. Provides quick access to save, copy link, share and
 * back-to-top. Hidden below lg.
 */
export function FloatingActions({ url, title }: { url: string; title: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Persist bookmark state in localStorage per URL
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("zaaou:bookmarks") ?? "[]") as string[];
      setBookmarked(saved.includes(url));
    } catch {
      // ignore
    }
  }, [url]);

  function toggleBookmark() {
    try {
      const saved = JSON.parse(localStorage.getItem("zaaou:bookmarks") ?? "[]") as string[];
      const next = saved.includes(url) ? saved.filter((u) => u !== url) : [...saved, url];
      localStorage.setItem("zaaou:bookmarks", JSON.stringify(next));
      setBookmarked(next.includes(url));
      toast.success(next.includes(url) ? "Saved for later" : "Removed from saved");
    } catch {
      toast.error("Couldn't save bookmark");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  }

  return (
    <div
      className={`hidden lg:flex no-print fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 rounded-full border border-border bg-card/90 backdrop-blur p-2 shadow-soft transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={toggleBookmark}
        aria-label={bookmarked ? "Remove bookmark" : "Save for later"}
        className={`h-10 w-10 grid place-items-center rounded-full transition-colors ${
          bookmarked
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      </button>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="h-10 w-10 grid place-items-center rounded-full text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
      >
        <Link2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={nativeShare}
        aria-label="Share article"
        className="h-10 w-10 grid place-items-center rounded-full text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
      >
        <Share2 className="h-4 w-4" />
      </button>
      <div className="h-px bg-border my-1" />
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="h-10 w-10 grid place-items-center rounded-full text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}

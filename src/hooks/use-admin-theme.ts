import { useEffect, useState } from "react";

const KEY = "zaaou-admin-theme";
type Theme = "light" | "dark";

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useAdminTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    try {
      const v = (localStorage.getItem(KEY) as Theme | null) ?? "light";
      setThemeState(v);
      apply(v);
    } catch {
      /* ignore */
    }
    return () => {
      // Reset to light when leaving admin so public site isn't affected
      apply("light");
    };
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }

  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return { theme, setTheme, toggle };
}

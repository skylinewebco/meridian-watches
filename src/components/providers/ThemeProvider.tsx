"use client";

import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";

type Theme = "dark" | "light";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);

export const THEME_INIT = `(function(){try{var t=localStorage.getItem('meridian-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var e=document.documentElement;if(t==='light'){e.classList.add('light');}e.style.colorScheme=t;}catch(e){}})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const fadeTimer = useRef<number | null>(null);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setThemeState(isLight ? "light" : "dark");
    return () => {
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    };
  }, []);

  const apply = useCallback((t: Theme) => {
    const el = document.documentElement;

    // Enable the site-wide cross-fade only for the duration of the switch,
    // and never for users who prefer reduced motion.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      el.classList.add("theme-transition");
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
      fadeTimer.current = window.setTimeout(() => {
        el.classList.remove("theme-transition");
        fadeTimer.current = null;
      }, 700);
    }

    el.classList.toggle("light", t === "light");
    el.style.colorScheme = t;
    try {
      localStorage.setItem("meridian-theme", t);
    } catch {}
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => {
    apply(document.documentElement.classList.contains("light") ? "dark" : "light");
  }, [apply]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: apply }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

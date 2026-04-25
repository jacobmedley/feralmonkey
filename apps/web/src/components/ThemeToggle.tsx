"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-toggle",
});

const THEME_KEY = "fmds-theme";
type Theme = "default" | "theme1" | "theme2" | "theme3";

const THEMES: { value: Theme; label: string }[] = [
  { value: "theme1", label: "Theme 1" },
  { value: "theme2", label: "Theme 2" },
  { value: "theme3", label: "Theme 3" },
  { value: "default", label: "Default" },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const validThemes: Theme[] = ["theme1", "theme2", "theme3"];
    if (stored && !validThemes.includes(stored)) {
      localStorage.removeItem(THEME_KEY);
      document.documentElement.removeAttribute("data-theme");
    } else if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  function applyTheme(next: Theme) {
    setTheme(next);
    if (next === "default") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem(THEME_KEY);
    } else {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    }
  }

  return (
    <div className={inter.variable} style={{ fontFamily: "var(--font-toggle)" }}>
    <div className="fixed top-4 right-4 z-50 flex gap-1 rounded-lg border border-border bg-muted p-1">
      {THEMES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => applyTheme(value)}
          aria-pressed={theme === value}
          className={[
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            theme === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card hover:text-foreground",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-toggle",
});

const THEME_KEY = "fmds-theme";
type Theme = "default" | "fsa" | "hsa" | "patiently";

const THEMES: { value: Theme; label: string }[] = [
  { value: "default",   label: "Wireframe" },
  { value: "fsa",       label: "FSA Store" },
  { value: "hsa",       label: "HSA Store" },
  { value: "patiently", label: "Patiently" },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const valid: Theme[] = ["default", "fsa", "hsa", "patiently"];
    const active = stored && valid.includes(stored) ? stored : "default";
    setTheme(active);
    document.documentElement.setAttribute("data-theme", active);
  }, []);

  function applyTheme(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
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

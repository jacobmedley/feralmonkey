"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "fmds-theme";
const THEME_VALUE = "jacobmedley";

export function ThemeToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(localStorage.getItem(THEME_KEY) === THEME_VALUE);
  }, []);

  function toggle() {
    const next = !active;
    setActive(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", THEME_VALUE);
      localStorage.setItem(THEME_KEY, THEME_VALUE);
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem(THEME_KEY);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={active}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {active ? "Default theme" : "jacobmedley"}
    </button>
  );
}

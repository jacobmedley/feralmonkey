import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Overview" },
  { href: "/components", label: "Components" },
  { href: "/components/button", label: "Button" },
  { href: "/components/input", label: "Input" },
  { href: "/components/card", label: "Card" },
  { href: "/tokens", label: "Tokens" },
  { href: "/themes", label: "Themes" },
];

export function DocsSidebar() {
  return (
    <aside className="border-b border-border px-6 py-6 lg:min-h-screen lg:border-b-0 lg:border-r">
      <nav aria-label="Docs navigation" className="lg:sticky lg:top-6">
        <p className="mb-3 text-sm font-semibold text-foreground">FMDS Docs</p>
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}

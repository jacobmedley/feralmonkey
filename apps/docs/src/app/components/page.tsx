import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@fmds/ui";

const componentLinks = [
  {
    href: "/components/button",
    title: "Button",
    description: "Trigger actions with token-aware variants and sizes.",
  },
  {
    href: "/components/input",
    title: "Input",
    description: "Collect text values with accessible native input props.",
  },
  {
    href: "/components/card",
    title: "Card",
    description: "Group related content with header, content, and footer slots.",
  },
];

export default function ComponentsPage() {
  return (
    <article className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Components</p>
        <h1 className="text-4xl font-semibold">FMDS components</h1>
        <p className="text-muted-foreground">
          Shared primitives live in the reusable UI package and consume semantic FMDS tokens.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {componentLinks.map((component) => (
          <Link key={component.href} href={component.href}>
            <Card className="h-full transition-colors hover:bg-secondary">
              <CardHeader>
                <CardTitle>{component.title}</CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </article>
  );
}

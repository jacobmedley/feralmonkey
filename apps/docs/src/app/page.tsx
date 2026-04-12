import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@fmds/ui";

export default function DocsHomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              FMDS · Feral Monkey Design System
            </div>

            <h1 className="text-5xl font-semibold tracking-tight">
              Portable design system for Figma and code
            </h1>

            <p className="text-lg text-muted-foreground">
              FMDS is an open-source design system built for parity between tokens,
              themes, components, and documentation across Figma and code.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button>Get Started</Button>
              <Button variant="outline">View Components</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Token-driven</CardTitle>
              <CardDescription>
                Semantic tokens power themes, components, and documentation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Figma parity</CardTitle>
              <CardDescription>
                Built to align design variables and code tokens with minimal drift.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open source</CardTitle>
              <CardDescription>
                Public docs, reusable components, and copy-paste examples.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-semibold">Component preview</h2>
          <p className="text-muted-foreground">
            First working FMDS primitives rendered from the shared UI package.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-8 pt-6">
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <div className="flex max-w-sm flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="name@example.com" />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
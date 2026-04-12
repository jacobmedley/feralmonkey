import { Button } from "@fmds/ui";
import { CodeBlock } from "@/components/docs/code-block";

const buttonExample = `import { Button } from "@fmds/ui";

export function SaveAction() {
  return <Button>Save changes</Button>;
}`;

export default function ButtonDocsPage() {
  return (
    <article className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Components</p>
        <h1 className="text-4xl font-semibold">Button</h1>
        <p className="text-muted-foreground">
          Use buttons for primary actions, secondary choices, destructive flows, and quiet actions.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <p className="text-muted-foreground">
          Import the shared Button from the UI package and choose a variant or size when the
          default action style does not fit the interaction.
        </p>
        <CodeBlock code={buttonExample} />
      </section>
    </article>
  );
}

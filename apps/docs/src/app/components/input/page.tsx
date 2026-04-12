import { Input } from "@fmds/ui";
import { CodeBlock } from "@/components/docs/code-block";

const inputExample = `import { Input } from "@fmds/ui";

export function EmailField() {
  return <Input type="email" placeholder="name@example.com" />;
}`;

export default function InputDocsPage() {
  return (
    <article className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Components</p>
        <h1 className="text-4xl font-semibold">Input</h1>
        <p className="text-muted-foreground">
          Use inputs for short text entry while keeping native input behavior and attributes.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="default-input">
            Default
          </label>
          <Input id="default-input" placeholder="Feral Monkey" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email-input">
            Email
          </label>
          <Input id="email-input" type="email" placeholder="name@example.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="disabled-input">
            Disabled
          </label>
          <Input id="disabled-input" placeholder="Not editable" disabled />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <p className="text-muted-foreground">
          Import Input from the UI package and pass native input props like type, placeholder,
          disabled, and id.
        </p>
        <CodeBlock code={inputExample} />
      </section>
    </article>
  );
}

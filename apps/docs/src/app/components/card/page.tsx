import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fmds/ui";
import { CodeBlock } from "@/components/docs/code-block";

const cardExample = `import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fmds/ui";

export function ReleaseCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Release notes</CardTitle>
        <CardDescription>Token and component updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Button, Input, and Card are available from @fmds/ui.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Read more</Button>
      </CardFooter>
    </Card>
  );
}`;

export default function CardDocsPage() {
  return (
    <article className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Components</p>
        <h1 className="text-4xl font-semibold">Card</h1>
        <p className="text-muted-foreground">
          Use cards to group related content and actions with consistent token-aware surfaces.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card anatomy</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">CardHeader</span> groups the title and
            description.
          </li>
          <li>
            <span className="font-medium text-foreground">CardContent</span> contains the main
            body.
          </li>
          <li>
            <span className="font-medium text-foreground">CardFooter</span> holds supporting
            actions.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Example card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Release notes</CardTitle>
            <CardDescription>Token and component updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Button, Input, and Card are available from the shared UI package.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Read more</Button>
          </CardFooter>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock code={cardExample} />
      </section>
    </article>
  );
}

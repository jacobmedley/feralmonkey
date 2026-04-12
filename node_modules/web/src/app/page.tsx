import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@fmds/ui";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>FMDS Foundation Test</CardTitle>
            <CardDescription>
              Button, Input, and Card are now rendering from the shared UI package.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>

            <div className="max-w-md space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="name@example.com" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
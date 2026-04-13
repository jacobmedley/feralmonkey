import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
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
              <Button variant="pill">Pill</Button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
              <Button size="bfb">Big Flipping Button</Button>
            </div>

            <div className="max-w-md space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="name@example.com" />
            </div>

            <Accordion type="single" collapsible className="w-full max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it token-driven?</AccordionTrigger>
                <AccordionContent>
                  Yes. All colors use semantic tokens — toggle the theme to see it respond.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can it be styled per theme?</AccordionTrigger>
                <AccordionContent>
                  Yes. Switch to the jacobmedley theme using the button in the top-right corner.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert</CardTitle>
            <CardDescription>
              All 5 variants × 3 sizes. Icon slot shown on the default variant.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* All variants — default size */}
            <div className="space-y-3">
              <Alert variant="default" icon={<span>ℹ</span>}>
                <AlertTitle>Default alert</AlertTitle>
                <AlertDescription>This is a default alert with an icon slot.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Destructive alert</AlertTitle>
                <AlertDescription>Something went wrong. Please try again.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <AlertTitle>Success alert</AlertTitle>
                <AlertDescription>Your changes have been saved successfully.</AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTitle>Warning alert</AlertTitle>
                <AlertDescription>This action cannot be undone.</AlertDescription>
              </Alert>
              <Alert variant="info">
                <AlertTitle>Info alert</AlertTitle>
                <AlertDescription>Here is some helpful information.</AlertDescription>
              </Alert>
            </div>

            {/* Size variants — success variant */}
            <div className="space-y-3">
              <Alert variant="success" size="sm">
                <AlertTitle>Small success</AlertTitle>
                <AlertDescription>Size sm — text-xs py-2 px-3.</AlertDescription>
              </Alert>
              <Alert variant="success" size="default">
                <AlertTitle>Default success</AlertTitle>
                <AlertDescription>Size default — text-sm py-3 px-4.</AlertDescription>
              </Alert>
              <Alert variant="success" size="lg">
                <AlertTitle>Large success</AlertTitle>
                <AlertDescription>Size lg — text-base py-4 px-5.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
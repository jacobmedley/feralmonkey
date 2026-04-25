import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@fmds/ui";

function SectionDivider() {
  return <hr className="border-border" />;
}

function UsageBlock({ code }: { code: string }) {
  return (
    <details className="mt-8">
      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors select-none w-fit">
        View usage
      </summary>
      <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-muted p-4 text-xs leading-relaxed font-mono text-foreground">
        <code>{code}</code>
      </pre>
    </details>
  );
}

function SectionHeading({
  title,
  tokens,
}: {
  title: string;
  tokens: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        uses: {tokens}
      </p>
    </div>
  );
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="mx-auto max-w-5xl px-6 space-y-16">

        {/* Page header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            FMDS Component Demo
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Switch themes above to see the system respond. Every color,
            surface, and typographic decision is token-driven.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">4 Themes</Badge>
            <Badge variant="secondary">14 Semantic Tokens</Badge>
            <Badge variant="outline">Token-Driven</Badge>
          </div>
        </div>

        <SectionDivider />

        {/* ── SECTION 1: Buttons ─────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Button"
            tokens="primary, primary.foreground, secondary, secondary.foreground, destructive, destructive.foreground, muted, border, ring"
          />

          {/* Variants */}
          <div className="space-y-2 mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Variants
            </p>
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-col items-center gap-2">
                <Button variant="default">Add to Cart</Button>
                <span className="text-xs text-muted-foreground">default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button variant="secondary">Learn More</Button>
                <span className="text-xs text-muted-foreground">secondary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button variant="outline">View Details</Button>
                <span className="text-xs text-muted-foreground">outline</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button variant="ghost">Dismiss</Button>
                <span className="text-xs text-muted-foreground">ghost</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button variant="destructive">Remove Item</Button>
                <span className="text-xs text-muted-foreground">destructive</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button variant="pill" size="bfb">Shop Now</Button>
                <span className="text-xs text-muted-foreground">BFB (pill)</span>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Sizes — default variant
            </p>
            <div className="flex flex-col items-start gap-5">
              <div className="flex items-center gap-4">
                <Button size="sm">Shop FSA</Button>
                <span className="text-xs text-muted-foreground">sm</span>
              </div>
              <div className="flex items-center gap-4">
                <Button size="default">Shop FSA</Button>
                <span className="text-xs text-muted-foreground">default</span>
              </div>
              <div className="flex items-center gap-4">
                <Button size="lg">Shop FSA</Button>
                <span className="text-xs text-muted-foreground">lg</span>
              </div>
              <div className="flex items-center gap-4">
                <Button size="bfb">Shop FSA — Big Flipping Button</Button>
                <span className="text-xs text-muted-foreground">BFB</span>
              </div>
            </div>
          </div>

          <UsageBlock code={`import { Button } from '@fmds/ui'

<Button variant="default">Add to Cart</Button>
<Button variant="secondary">Learn More</Button>
<Button variant="outline">View Details</Button>
<Button variant="ghost">Dismiss</Button>
<Button variant="destructive">Remove Item</Button>
<Button variant="pill" size="bfb">Shop Now</Button>

{/* sizes */}
<Button size="sm">Label</Button>
<Button size="default">Label</Button>
<Button size="lg">Label</Button>
<Button size="bfb">Label</Button>`} />
        </section>

        <SectionDivider />

        {/* ── SECTION 2: Form Inputs ─────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Input"
            tokens="background, foreground, border, input, muted.foreground, ring, destructive"
          />

          <div className="grid gap-8 max-w-lg">
            {/* Default */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                FSA Card Number
              </label>
              <Input placeholder="Enter your FSA card number" />
              <span className="text-xs text-muted-foreground">default</span>
            </div>

            {/* Error */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                defaultValue="not-an-email"
                className="border-destructive focus-visible:ring-destructive"
                aria-invalid="true"
              />
              <p className="text-xs text-destructive">
                Enter a valid email address.
              </p>
              <span className="text-xs text-muted-foreground">error state</span>
            </div>

            {/* Disabled */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Account ID
              </label>
              <Input defaultValue="FSA-2024-00491" disabled />
              <span className="text-xs text-muted-foreground">disabled</span>
            </div>

            {/* Composed form */}
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <p className="text-sm font-semibold text-card-foreground">
                Contact Health-E Commerce
              </p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input placeholder="Your full name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="name@example.com" />
              </div>
              <Button type="submit">Submit</Button>
              <span className="block text-xs text-muted-foreground">
                composed form
              </span>
            </div>
          </div>

          <UsageBlock code={`import { Input } from '@fmds/ui'

{/* default */}
<Input placeholder="Enter value" />

{/* error state */}
<Input
  className="border-destructive focus-visible:ring-destructive"
  aria-invalid="true"
/>

{/* disabled */}
<Input defaultValue="Read only" disabled />`} />
        </section>

        <SectionDivider />

        {/* ── SECTION 3: Cards ───────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Card"
            tokens="card, card.foreground, border, muted.foreground"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Simple card */}
            <Card>
              <CardHeader>
                <CardTitle>FSA Eligibility</CardTitle>
                <CardDescription>
                  Over 4,000 FSA-eligible products in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  From sunscreen to blood pressure monitors — if it is
                  FSA-eligible, we carry it.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Browse products
                </Button>
              </CardFooter>
            </Card>

            {/* Stat card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl font-bold tabular-nums">
                  $3,200
                </CardTitle>
                <CardDescription>2024 FSA contribution limit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">
                  The IRS increased the annual limit by $150 over last year.
                </p>
                <Badge variant="success">+$150 vs 2023</Badge>
              </CardContent>
            </Card>

            {/* CTA card */}
            <Card>
              <CardHeader>
                <CardTitle>Deadline approaching</CardTitle>
                <CardDescription>
                  Use-it-or-lose-it funds expire at year end.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  Spend your remaining FSA balance before December 31.
                  Thousands of items ship same day.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="default">Shop now</Button>
              </CardFooter>
            </Card>
          </div>

          <UsageBlock code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@fmds/ui'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Supporting text</CardDescription>
  </CardHeader>
  <CardContent>Body content</CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">Action</Button>
  </CardFooter>
</Card>`} />
        </section>

        <SectionDivider />

        {/* ── SECTION 4: Alerts ──────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Alert"
            tokens="card, foreground, border, success, warning, destructive, info, muted.foreground"
          />

          <div className="space-y-3 max-w-2xl">
            <Alert variant="default">
              <AlertTitle>Token build complete</AlertTitle>
              <AlertDescription>
                CSS variables written to all app targets.
              </AlertDescription>
            </Alert>
            <Alert variant="success">
              <AlertTitle>FSA balance applied</AlertTitle>
              <AlertDescription>
                $142.00 has been deducted from your FSA card.
              </AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Balance expires soon</AlertTitle>
              <AlertDescription>
                You have $318 remaining. FSA funds do not roll over.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Card declined</AlertTitle>
              <AlertDescription>
                Your FSA card could not be charged. Verify the card details.
              </AlertDescription>
            </Alert>
            <Alert variant="info">
              <AlertTitle>HSA rollover available</AlertTitle>
              <AlertDescription>
                Unlike FSA, your HSA balance rolls over year to year with no
                limit.
              </AlertDescription>
            </Alert>
          </div>

          <UsageBlock code={`import { Alert, AlertTitle, AlertDescription } from '@fmds/ui'

{/* variants: default | success | warning | destructive | info */}
<Alert variant="success">
  <AlertTitle>FSA balance applied</AlertTitle>
  <AlertDescription>$142.00 deducted from your FSA card.</AlertDescription>
</Alert>`} />
        </section>

        <SectionDivider />

        {/* ── SECTION 5: Badges ──────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Badge"
            tokens="primary, primary.foreground, secondary, secondary.foreground, foreground, border, success, warning, destructive"
          />

          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <Badge variant="default">FSA Eligible</Badge>
              <span className="text-xs text-muted-foreground">default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="secondary">HSA Eligible</Badge>
              <span className="text-xs text-muted-foreground">secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="outline">New Arrival</Badge>
              <span className="text-xs text-muted-foreground">outline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="success">In Stock</Badge>
              <span className="text-xs text-muted-foreground">success</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="warning">Expiring Soon</Badge>
              <span className="text-xs text-muted-foreground">warning</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="destructive">Out of Stock</Badge>
              <span className="text-xs text-muted-foreground">destructive</span>
            </div>
          </div>

          <UsageBlock code={`import { Badge } from '@fmds/ui'

{/* variants: default | secondary | outline | success | warning | destructive */}
<Badge variant="default">FSA Eligible</Badge>
<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Expiring Soon</Badge>
<Badge variant="destructive">Out of Stock</Badge>`} />
        </section>

        <SectionDivider />

        {/* ── SECTION 6: Accordion ───────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Accordion"
            tokens="foreground, border, muted.foreground, ring"
          />

          <Accordion type="single" collapsible className="max-w-2xl">
            <AccordionItem value="tokens">
              <AccordionTrigger>What are semantic tokens?</AccordionTrigger>
              <AccordionContent>
                Semantic tokens are named CSS variables that describe intent,
                not appearance —{" "}
                <code className="font-mono text-xs bg-muted px-1 rounded">
                  primary
                </code>{" "}
                instead of a hex value. Each theme maps its own values to the
                same names, so components never change between brands.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="themes">
              <AccordionTrigger>
                How does theming work across FSA Store and HSA Store?
              </AccordionTrigger>
              <AccordionContent>
                Each brand ships a theme file that overrides semantic token
                values. Switching the{" "}
                <code className="font-mono text-xs bg-muted px-1 rounded">
                  data-theme
                </code>{" "}
                attribute on the root element applies the brand in full — same
                components, zero code changes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="figma">
              <AccordionTrigger>How is Figma parity maintained?</AccordionTrigger>
              <AccordionContent>
                Token names in Figma variable collections match token names in
                code exactly. A designer changing{" "}
                <code className="font-mono text-xs bg-muted px-1 rounded">
                  primary
                </code>{" "}
                exports the same value that ships to production. No translation
                layer, no drift.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="scope">
              <AccordionTrigger>What is out of scope for FMDS?</AccordionTrigger>
              <AccordionContent>
                FMDS does not own page layouts, routing, business logic, or
                data fetching. It owns tokens, shared UI components, and the
                documentation that keeps Figma and code in sync across
                Health-E Commerce brands.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <UsageBlock code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@fmds/ui'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question</AccordionTrigger>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Question</AccordionTrigger>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
</Accordion>`} />
        </section>

        <SectionDivider />

        {/* ── SECTION 7: Theme Comparison ───────────────────────────────── */}
        <section>
          <SectionHeading
            title="Theme Comparison"
            tokens="card, card.foreground, primary, border, muted.foreground, success"
          />

          <div className="grid grid-cols-2 gap-6 max-w-2xl">
            {(["theme1", "theme2"] as const).map((theme) => (
              <div key={theme} className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {theme === "theme1" ? "Theme 1" : "Theme 2"}
                </p>
                <div data-theme={theme}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-4xl font-bold tabular-nums">
                        $3,200
                      </CardTitle>
                      <CardDescription>2024 FSA contribution limit</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-foreground">
                        The IRS increased the annual limit by $150 over last year.
                      </p>
                      <Badge variant="success">+$150 vs 2023</Badge>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm">Shop now</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Same component. Props unchanged. Tokens do the work.
          </p>
        </section>

        <SectionDivider />

        {/* ── SECTION 8: Active Theme Tokens ────────────────────────────── */}
        <section>
          <SectionHeading
            title="Active Theme Tokens"
            tokens="all semantic tokens"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { token: "background",        var: "--background",        role: "Page background" },
              { token: "foreground",        var: "--foreground",        role: "Body text" },
              { token: "primary",           var: "--primary",           role: "Brand primary" },
              { token: "primary.foreground",var: "--primary-foreground",role: "On primary" },
              { token: "secondary",         var: "--secondary",         role: "Secondary action" },
              { token: "accent",            var: "--accent",            role: "Accent / highlight" },
              { token: "muted",             var: "--muted",             role: "Muted surface" },
              { token: "muted.foreground",  var: "--muted-foreground",  role: "Supporting text" },
              { token: "card",              var: "--card",              role: "Card surface" },
              { token: "border",            var: "--border",            role: "Borders" },
              { token: "destructive",       var: "--destructive",       role: "Error / danger" },
              { token: "success",           var: "--success",           role: "Success" },
              { token: "warning",           var: "--warning",           role: "Warning" },
              { token: "info",              var: "--info",              role: "Information" },
            ].map(({ token, var: cssVar, role }) => (
              <div key={token} className="flex flex-col gap-1.5">
                <div
                  className="h-20 w-full rounded-md border border-border"
                  style={{ background: `hsl(var(${cssVar}))` }}
                />
                <span className="font-mono text-xs text-foreground leading-tight">
                  {token}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {role}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

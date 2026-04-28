"use client";

import { useEffect, useState } from "react";
import {
  // Controls
  Button,
  Input,
  // Pre-existing
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Alert, AlertDescription, AlertTitle,
  Badge,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  // Shadcn
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
  Avatar, AvatarFallback, AvatarImage,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
  Checkbox,
  Collapsible, CollapsibleContent, CollapsibleTrigger,
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  HoverCard, HoverCardContent, HoverCardTrigger,
  Label,
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
  Popover, PopoverContent, PopoverTrigger,
  Progress,
  RadioGroup, RadioGroupItem,
  ScrollArea,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator,
  Sheet, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
  Skeleton,
  Slider,
  Switch,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Textarea,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@fmds/ui";

const BRAND_HUES: Record<string, string[]> = {
  patiently: ["navy", "lime", "iris", "mint", "cream", "sand", "stone", "ash"],
  fsa:       ["navy", "crimson", "blush", "sky", "mist", "slate"],
  hsa:       ["navy", "violet", "teal", "lilac", "gray", "silver", "forest", "straw", "lavender"],
};

const RAMP_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

const SEMANTIC_TOKENS = [
  { label: "background",           cssVar: "--background" },
  { label: "foreground",           cssVar: "--foreground" },
  { label: "muted",                cssVar: "--muted" },
  { label: "muted-foreground",     cssVar: "--muted-foreground" },
  { label: "card",                 cssVar: "--card" },
  { label: "card-foreground",      cssVar: "--card-foreground" },
  { label: "primary",              cssVar: "--primary" },
  { label: "primary-foreground",   cssVar: "--primary-foreground" },
  { label: "secondary",            cssVar: "--secondary" },
  { label: "secondary-foreground", cssVar: "--secondary-foreground" },
  { label: "accent",               cssVar: "--accent" },
  { label: "accent-foreground",    cssVar: "--accent-foreground" },
  { label: "border",               cssVar: "--border" },
  { label: "input",                cssVar: "--input" },
  { label: "ring",                 cssVar: "--ring" },
  { label: "destructive",          cssVar: "--destructive" },
  { label: "destructive-fg",       cssVar: "--destructive-foreground" },
  { label: "success",              cssVar: "--success" },
  { label: "warning",              cssVar: "--warning" },
  { label: "info",                 cssVar: "--info" },
];

function SectionDivider() {
  return <hr className="border-border" />;
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

function ComponentLabel({ label }: { label: string }) {
  return <span className="text-xs text-muted-foreground mt-1">{label}</span>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-start gap-6">{children}</div>;
}

function Col({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-start gap-1">{children}</div>;
}

export default function DemoPage() {
  const [sliderValue, setSliderValue] = useState([40]);
  const [progress] = useState(62);
  const [switchOn, setSwitchOn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>("default");

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setActiveTheme(el.getAttribute("data-theme") || "default");
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background text-foreground py-12">
        <div className="mx-auto max-w-5xl px-6 space-y-16">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">FMDS Component Demo</h1>
            <p className="max-w-2xl text-muted-foreground">
              Use the theme switcher above to toggle between Wireframe, FSA Store, HSA Store, and Patiently.
              Every visual decision is driven by semantic tokens — same components, zero code changes.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Wireframe</Badge>
              <Badge variant="secondary">FSA Store</Badge>
              <Badge variant="outline">HSA Store</Badge>
              <Badge variant="success">Patiently</Badge>
            </div>
          </div>

          <SectionDivider />

          {/* ── Brand Palette ─────────────────────────────────────────────── */}
          <section>
            <SectionHeading
              title="Brand Palette"
              description="OKLab 10-step ramps. Step 500 is the locked brand base. Steps 50–400 are lighter; 600–900 darker."
            />
            {BRAND_HUES[activeTheme] ? (
              <div className="space-y-3">
                {BRAND_HUES[activeTheme].map((hue) => (
                  <div key={hue} className="flex items-start gap-3">
                    <span className="w-20 shrink-0 pt-3 font-mono text-xs text-muted-foreground capitalize">
                      {hue}
                    </span>
                    <div className="flex flex-1 gap-px">
                      {RAMP_STEPS.map((step) => (
                        <div key={step} className="flex flex-1 flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-sm ${step === "500" ? "h-12 ring-2 ring-offset-2 ring-foreground/25" : "h-10"}`}
                            style={{ background: `hsl(var(--brand-${hue}-${step}))` }}
                            title={`--brand-${hue}-${step}`}
                          />
                          <span className={`tabular-nums font-mono text-[10px] ${step === "500" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Wireframe theme aliases into{" "}
                <code className="rounded bg-muted px-1 font-mono text-xs">color.slate.*</code> — no per-theme brand palette.
              </p>
            )}
          </section>

          <SectionDivider />

          {/* ── Semantic Tokens ───────────────────────────────────────────── */}
          <section>
            <SectionHeading
              title="Semantic Tokens"
              description="Active theme CSS variables. Every component consumes these — never raw hex."
            />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {SEMANTIC_TOKENS.map(({ label, cssVar }) => (
                <div key={label} className="space-y-1.5">
                  <div
                    className="h-14 w-full rounded-md border border-border/50"
                    style={{ background: `hsl(var(${cssVar}))` }}
                    title={cssVar}
                  />
                  <span className="block font-mono text-[11px] leading-tight text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="mb-2 text-xs text-muted-foreground">Chart colors — shared primitives, identical across all themes</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex flex-col items-center gap-1">
                    <div className="h-10 w-16 rounded-md" style={{ background: `hsl(var(--chart-${n}))` }} />
                    <span className="font-mono text-[10px] text-muted-foreground">chart-{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ── Side-by-side Theme Comparison ───────────────────────────── */}
          <section>
            <SectionHeading title="Theme Comparison" description="Same card component, four themes. Tokens do the work." />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(["default", "fsa", "hsa", "patiently"] as const).map((t) => (
                <div key={t} data-theme={t} className="rounded-lg">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">$3,200</CardTitle>
                      <CardDescription>2024 FSA limit</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="success">+$150 vs 2023</Badge>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm">Shop now</Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Wireframe · FSA Store · HSA Store · Patiently</p>
          </section>

          <SectionDivider />

          {/* ── Button ──────────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Button" />
            <div className="space-y-6">
              <Row>
                {(["default","secondary","outline","ghost","destructive","accent"] as const).map((v) => (
                  <Col key={v}>
                    <Button variant={v as any}>{v}</Button>
                    <ComponentLabel label={v} />
                  </Col>
                ))}
                <Col>
                  <Button variant="pill" size="bfb">Shop Now</Button>
                  <ComponentLabel label="pill / bfb" />
                </Col>
              </Row>
              <Row>
                {(["sm","default","lg","xl","bfb"] as const).map((s) => (
                  <Col key={s}>
                    <Button size={s as any}>Button</Button>
                    <ComponentLabel label={`size: ${s}`} />
                  </Col>
                ))}
                <Col>
                  <Button disabled>Disabled</Button>
                  <ComponentLabel label="disabled" />
                </Col>
              </Row>
            </div>
          </section>

          <SectionDivider />

          {/* ── Input + Label ───────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Input + Label" />
            <div className="grid gap-5 max-w-md">
              <div className="space-y-1.5">
                <Label htmlFor="card-num">FSA Card Number</Label>
                <Input id="card-num" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email-err">Email</Label>
                <Input id="email-err" defaultValue="bad-email" className="border-destructive focus-visible:ring-destructive" aria-invalid="true" />
                <p className="text-xs text-destructive">Enter a valid email address.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Account ID</Label>
                <Input defaultValue="FSA-2024-00491" disabled />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" placeholder="How can we help?" rows={3} />
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ── Badge ───────────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Badge" />
            <Row>
              {(["default","secondary","outline","success","warning","destructive"] as const).map((v) => (
                <Col key={v}>
                  <Badge variant={v as any}>{v}</Badge>
                  <ComponentLabel label={v} />
                </Col>
              ))}
            </Row>
          </section>

          <SectionDivider />

          {/* ── Alert ───────────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Alert" />
            <div className="space-y-3 max-w-2xl">
              <Alert><AlertTitle>Token build complete</AlertTitle><AlertDescription>CSS variables written to all targets.</AlertDescription></Alert>
              <Alert variant="success"><AlertTitle>FSA balance applied</AlertTitle><AlertDescription>$142.00 deducted from your FSA card.</AlertDescription></Alert>
              <Alert variant="warning"><AlertTitle>Balance expires soon</AlertTitle><AlertDescription>$318 remaining — FSA funds do not roll over.</AlertDescription></Alert>
              <Alert variant="destructive"><AlertTitle>Card declined</AlertTitle><AlertDescription>Verify your FSA card details.</AlertDescription></Alert>
              <Alert variant="info"><AlertTitle>HSA rollover available</AlertTitle><AlertDescription>HSA balances roll over year to year with no limit.</AlertDescription></Alert>
            </div>
          </section>

          <SectionDivider />

          {/* ── Card ────────────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Card" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle>FSA Eligibility</CardTitle><CardDescription>4,000+ eligible products.</CardDescription></CardHeader>
                <CardContent><p className="text-sm text-foreground">From sunscreen to blood pressure monitors.</p></CardContent>
                <CardFooter><Button variant="outline" size="sm">Browse</Button></CardFooter>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-3xl font-bold tabular-nums">$3,200</CardTitle><CardDescription>2024 FSA contribution limit</CardDescription></CardHeader>
                <CardContent><Badge variant="success">+$150 vs 2023</Badge></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Deadline approaching</CardTitle><CardDescription>Funds expire Dec 31.</CardDescription></CardHeader>
                <CardContent><p className="text-sm text-foreground">Spend your remaining FSA balance before year end.</p></CardContent>
                <CardFooter><Button size="sm">Shop now</Button></CardFooter>
              </Card>
            </div>
          </section>

          <SectionDivider />

          {/* ── Accordion ───────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Accordion" />
            <Accordion type="single" collapsible className="max-w-2xl">
              <AccordionItem value="q1"><AccordionTrigger>What are semantic tokens?</AccordionTrigger><AccordionContent>Named CSS variables that describe intent, not appearance — <code className="font-mono text-xs bg-muted px-1 rounded">primary</code> instead of a hex value.</AccordionContent></AccordionItem>
              <AccordionItem value="q2"><AccordionTrigger>How does theming work across FSA and HSA Store?</AccordionTrigger><AccordionContent>Each brand ships a theme file that overrides token values. Switching <code className="font-mono text-xs bg-muted px-1 rounded">data-theme</code> on the root applies the brand — same components, zero code changes.</AccordionContent></AccordionItem>
              <AccordionItem value="q3"><AccordionTrigger>What is out of scope for FMDS?</AccordionTrigger><AccordionContent>Page layouts, routing, business logic, and data fetching. FMDS owns tokens, UI components, and Figma parity.</AccordionContent></AccordionItem>
            </Accordion>
          </section>

          <SectionDivider />

          {/* ── Tabs ────────────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Tabs" />
            <Tabs defaultValue="fsa" className="max-w-2xl">
              <TabsList>
                <TabsTrigger value="fsa">FSA</TabsTrigger>
                <TabsTrigger value="hsa">HSA</TabsTrigger>
                <TabsTrigger value="lpfsa">LP-FSA</TabsTrigger>
              </TabsList>
              <TabsContent value="fsa" className="space-y-2 pt-4">
                <p className="text-sm text-foreground">Flexible Spending Accounts let you set aside pre-tax dollars for eligible health expenses.</p>
                <Badge variant="warning">Use-it-or-lose-it by Dec 31</Badge>
              </TabsContent>
              <TabsContent value="hsa" className="space-y-2 pt-4">
                <p className="text-sm text-foreground">Health Savings Accounts roll over year to year and can be invested for long-term growth.</p>
                <Badge variant="success">Rolls over annually</Badge>
              </TabsContent>
              <TabsContent value="lpfsa" className="space-y-2 pt-4">
                <p className="text-sm text-foreground">Limited Purpose FSAs cover only dental and vision — designed to pair with an HSA.</p>
                <Badge variant="secondary">Dental &amp; vision only</Badge>
              </TabsContent>
            </Tabs>
          </section>

          <SectionDivider />

          {/* ── Table ───────────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Table" />
            <div className="rounded-md border border-border overflow-hidden max-w-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Eligible</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Blood Pressure Monitor", cat: "Diagnostics", eligible: "FSA + HSA", price: "$49.99" },
                    { name: "Prenatal Vitamins", cat: "Supplements", eligible: "FSA + HSA", price: "$24.99" },
                    { name: "Sunscreen SPF 50", cat: "Skin Care", eligible: "FSA + HSA", price: "$14.99" },
                    { name: "Reading Glasses", cat: "Vision", eligible: "LP-FSA + HSA", price: "$29.99" },
                  ].map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.cat}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{row.eligible}</Badge></TableCell>
                      <TableCell className="text-right">{row.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <SectionDivider />

          {/* ── Form Controls ───────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Form Controls" description="Checkbox, Switch, Radio, Slider, Progress, Select" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl">

              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Checkbox</p>
                {["Email me FSA tips", "SMS order updates", "Expiry reminders"].map((lbl, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Checkbox id={`chk-${i}`} defaultChecked={i === 0} />
                    <Label htmlFor={`chk-${i}`} className="cursor-pointer">{lbl}</Label>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Switch</p>
                <div className="flex items-center gap-3">
                  <Switch id="notify" checked={switchOn} onCheckedChange={setSwitchOn} />
                  <Label htmlFor="notify">{switchOn ? "Notifications on" : "Notifications off"}</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="auto-pay" defaultChecked />
                  <Label htmlFor="auto-pay">Auto-pay enabled</Label>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Radio Group</p>
                <RadioGroup defaultValue="fsa">
                  <div className="flex items-center gap-2"><RadioGroupItem value="fsa" id="r-fsa" /><Label htmlFor="r-fsa">FSA</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="hsa" id="r-hsa" /><Label htmlFor="r-hsa">HSA</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="lpfsa" id="r-lpfsa" /><Label htmlFor="r-lpfsa">LP-FSA</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Select</p>
                <Select defaultValue="fsa">
                  <SelectTrigger><SelectValue placeholder="Account type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fsa">FSA</SelectItem>
                    <SelectItem value="hsa">HSA</SelectItem>
                    <SelectItem value="lpfsa">LP-FSA</SelectItem>
                    <SelectItem value="dcfsa">DC-FSA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Slider — FSA balance used</p>
                <Slider value={sliderValue} onValueChange={setSliderValue} max={3200} step={50} />
                <p className="text-xs text-muted-foreground">${sliderValue[0]} of $3,200 spent</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Progress — claim processing</p>
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">{progress}% complete</p>
              </div>

            </div>
          </section>

          <SectionDivider />

          {/* ── Avatar + Skeleton ───────────────────────────────────────── */}
          <section>
            <SectionHeading title="Avatar + Skeleton" />
            <Row>
              <Col>
                <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="User" /><AvatarFallback>JM</AvatarFallback></Avatar>
                <ComponentLabel label="with image" />
              </Col>
              <Col>
                <Avatar><AvatarFallback>FS</AvatarFallback></Avatar>
                <ComponentLabel label="initials" />
              </Col>
              <Col>
                <Avatar><AvatarFallback className="bg-primary text-primary-foreground">HC</AvatarFallback></Avatar>
                <ComponentLabel label="branded" />
              </Col>
              <div className="flex flex-col gap-2 ml-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-20 w-64 rounded-md" />
                <ComponentLabel label="Skeleton loading state" />
              </div>
            </Row>
          </section>

          <SectionDivider />

          {/* ── Breadcrumb + Separator + Pagination ─────────────────────── */}
          <section>
            <SectionHeading title="Navigation" description="Breadcrumb, Separator, Pagination" />
            <div className="space-y-8">
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href="#">FSA Store</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href="#">Health Care</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Blood Pressure Monitor</BreadcrumbPage></BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Products</span><Separator orientation="vertical" className="h-4" />
                <span>Categories</span><Separator orientation="vertical" className="h-4" />
                <span>Brands</span>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                  <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationEllipsis /></PaginationItem>
                  <PaginationItem><PaginationLink href="#">12</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </section>

          <SectionDivider />

          {/* ── Scroll Area ─────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Scroll Area" />
            <ScrollArea className="h-48 w-72 rounded-md border border-border p-4">
              <div className="space-y-3">
                {["Allergy medication","Bandages","Blood pressure monitor","Cold medicine","Contact lens solution","Crutches","Eye drops","First aid kit","Glucose meter","Hand sanitizer","Heating pad","Inhaler","Insulin","Nasal spray","Pain reliever","Prenatal vitamins","Sunscreen","Thermometer"].map((item) => (
                  <div key={item} className="text-sm text-foreground border-b border-border pb-2 last:border-0">{item}</div>
                ))}
              </div>
            </ScrollArea>
          </section>

          <SectionDivider />

          {/* ── Tooltip + HoverCard ─────────────────────────────────────── */}
          <section>
            <SectionHeading title="Tooltip + HoverCard" />
            <Row>
              <Col>
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
                  <TooltipContent><p>FSA-eligible item</p></TooltipContent>
                </Tooltip>
                <ComponentLabel label="Tooltip" />
              </Col>
              <Col>
                <HoverCard>
                  <HoverCardTrigger asChild><Button variant="ghost">@fsastore</Button></HoverCardTrigger>
                  <HoverCardContent className="w-72">
                    <div className="flex gap-3">
                      <Avatar><AvatarFallback>FS</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-semibold">FSA Store</p>
                        <p className="text-xs text-muted-foreground mt-1">Your one-stop shop for FSA and HSA eligible products since 2010.</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <ComponentLabel label="HoverCard" />
              </Col>
            </Row>
          </section>

          <SectionDivider />

          {/* ── Popover + Collapsible ───────────────────────────────────── */}
          <section>
            <SectionHeading title="Popover + Collapsible" />
            <Row>
              <Col>
                <Popover>
                  <PopoverTrigger asChild><Button variant="outline">Filter by account</Button></PopoverTrigger>
                  <PopoverContent className="w-56 space-y-2">
                    <p className="text-sm font-medium text-foreground">Account type</p>
                    {["FSA","HSA","LP-FSA"].map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <Checkbox id={`pop-${t}`} /><Label htmlFor={`pop-${t}`}>{t}</Label>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
                <ComponentLabel label="Popover" />
              </Col>
              <Col>
                <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="w-56">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      Eligible categories
                      <span className="text-xs">{collapsibleOpen ? "▲" : "▼"}</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pt-1">
                    {["Medical","Dental","Vision","Rx"].map((c) => (
                      <p key={c} className="text-sm text-muted-foreground px-2 py-1">{c}</p>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <ComponentLabel label="Collapsible" />
              </Col>
            </Row>
          </section>

          <SectionDivider />

          {/* ── Dialog + Sheet + AlertDialog ────────────────────────────── */}
          <section>
            <SectionHeading title="Dialog + Sheet + AlertDialog" />
            <Row>
              <Col>
                <Dialog>
                  <DialogTrigger asChild><Button>Add to FSA</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm FSA purchase</DialogTitle>
                      <DialogDescription>Blood Pressure Monitor — $49.99 will be charged to your FSA card ending in 4242.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <ComponentLabel label="Dialog" />
              </Col>
              <Col>
                <Sheet>
                  <SheetTrigger asChild><Button variant="outline">Open cart</Button></SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Your FSA Cart</SheetTitle>
                      <SheetDescription>3 items · $84.97 · FSA eligible</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-3">
                      {["Blood Pressure Monitor — $49.99","Sunscreen SPF 50 — $14.99","Prenatal Vitamins — $19.99"].map((item) => (
                        <p key={item} className="text-sm text-foreground border-b border-border pb-2">{item}</p>
                      ))}
                    </div>
                    <SheetFooter className="mt-6">
                      <Button className="w-full">Checkout with FSA</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <ComponentLabel label="Sheet" />
              </Col>
              <Col>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive">Remove item</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
                      <AlertDialogDescription>This will remove Blood Pressure Monitor from your cart. You can add it back anytime.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep item</AlertDialogCancel>
                      <AlertDialogAction>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <ComponentLabel label="AlertDialog" />
              </Col>
            </Row>
          </section>

          <SectionDivider />

          {/* ── DropdownMenu ─────────────────────────────────────────────── */}
          <section>
            <SectionHeading title="Dropdown Menu" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline">My Account ▾</Button></DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Health-E Commerce</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>FSA Balance: $318</DropdownMenuItem>
                <DropdownMenuItem>HSA Balance: $1,240</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Order history</DropdownMenuItem>
                <DropdownMenuItem>Manage account</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>

          <SectionDivider />

        </div>
      </main>
    </TooltipProvider>
  );
}

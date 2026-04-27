import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-[var(--radius)] p-4 flex items-start gap-3",
  {
    variants: {
      variant: {
        default:  "",
        info:     "",
        success:  "",
        warning:  "",
        error:    "",
      },
      alertStyle: {
        subtle:         "",
        solid:          "",
        outline:        "",
        "accent-border": "",
      },
    },
    compoundVariants: [
      // default
      { variant: "default", alertStyle: "subtle",        className: "bg-card text-card-foreground border border-border" },
      { variant: "default", alertStyle: "solid",         className: "bg-card text-card-foreground border border-transparent" },
      { variant: "default", alertStyle: "outline",       className: "bg-transparent text-card-foreground border-2 border-border" },
      { variant: "default", alertStyle: "accent-border", className: "bg-card text-card-foreground border border-border border-l-4 border-l-border" },
      // info
      { variant: "info", alertStyle: "subtle",        className: "bg-status-info text-status-info-fg border border-status-info-border" },
      { variant: "info", alertStyle: "solid",         className: "bg-status-info-solid text-status-info-solid-fg border border-transparent" },
      { variant: "info", alertStyle: "outline",       className: "bg-transparent text-status-info-fg border-2 border-status-info-border" },
      { variant: "info", alertStyle: "accent-border", className: "bg-status-info text-status-info-fg border border-status-info-border border-l-4 border-l-status-info-solid" },
      // success
      { variant: "success", alertStyle: "subtle",        className: "bg-status-success text-status-success-fg border border-status-success-border" },
      { variant: "success", alertStyle: "solid",         className: "bg-status-success-solid text-status-success-solid-fg border border-transparent" },
      { variant: "success", alertStyle: "outline",       className: "bg-transparent text-status-success-fg border-2 border-status-success-border" },
      { variant: "success", alertStyle: "accent-border", className: "bg-status-success text-status-success-fg border border-status-success-border border-l-4 border-l-status-success-solid" },
      // warning
      { variant: "warning", alertStyle: "subtle",        className: "bg-status-warning text-status-warning-fg border border-status-warning-border" },
      { variant: "warning", alertStyle: "solid",         className: "bg-status-warning-solid text-status-warning-solid-fg border border-transparent" },
      { variant: "warning", alertStyle: "outline",       className: "bg-transparent text-status-warning-fg border-2 border-status-warning-border" },
      { variant: "warning", alertStyle: "accent-border", className: "bg-status-warning text-status-warning-fg border border-status-warning-border border-l-4 border-l-status-warning-solid" },
      // error
      { variant: "error", alertStyle: "subtle",        className: "bg-status-error text-status-error-fg border border-status-error-border" },
      { variant: "error", alertStyle: "solid",         className: "bg-status-error-solid text-status-error-solid-fg border border-transparent" },
      { variant: "error", alertStyle: "outline",       className: "bg-transparent text-status-error-fg border-2 border-status-error-border" },
      { variant: "error", alertStyle: "accent-border", className: "bg-status-error text-status-error-fg border border-status-error-border border-l-4 border-l-status-error-solid" },
    ],
    defaultVariants: {
      variant: "default",
      alertStyle: "subtle",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, alertStyle, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, alertStyle }), className)}
      {...props}
    >
      {children}
    </div>
  )
)
Alert.displayName = "Alert"

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 mt-0.5 [&>svg]:h-5 [&>svg]:w-5", className)}
    {...props}
  />
))
AlertIcon.displayName = "AlertIcon"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("text-sm font-semibold leading-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm opacity-90 mt-0.5", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row gap-2 mt-3", className)}
    {...props}
  />
))
AlertActions.displayName = "AlertActions"

const AlertDismiss = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    aria-label="Dismiss"
    className={cn(
      "absolute top-2 right-2 rounded-[calc(var(--radius)-2px)] p-1 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
))
AlertDismiss.displayName = "AlertDismiss"

export { Alert, AlertIcon, AlertTitle, AlertDescription, AlertActions, AlertDismiss }

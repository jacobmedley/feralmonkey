import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-medium border",
  {
    variants: {
      variant: {
        default:  "",
        info:     "",
        success:  "",
        warning:  "",
        error:    "",
        outline:  "bg-transparent text-foreground border-border",
      },
      badgeStyle: {
        subtle: "",
        solid:  "",
      },
      size: {
        sm:      "text-xs px-2 py-0.5 rounded-[calc(var(--radius)-2px)]",
        default: "text-xs px-2.5 py-0.5 rounded-[var(--radius)]",
        lg:      "text-sm px-3 py-1 rounded-[var(--radius)]",
      },
    },
    compoundVariants: [
      // default — same for both styles
      { variant: "default", badgeStyle: "subtle", className: "bg-primary text-primary-foreground border-transparent" },
      { variant: "default", badgeStyle: "solid",  className: "bg-primary text-primary-foreground border-transparent" },
      // info
      { variant: "info", badgeStyle: "subtle", className: "bg-status-info text-status-info-fg border-status-info-border" },
      { variant: "info", badgeStyle: "solid",  className: "bg-status-info-solid text-status-info-solid-fg border-transparent" },
      // success
      { variant: "success", badgeStyle: "subtle", className: "bg-status-success text-status-success-fg border-status-success-border" },
      { variant: "success", badgeStyle: "solid",  className: "bg-status-success-solid text-status-success-solid-fg border-transparent" },
      // warning
      { variant: "warning", badgeStyle: "subtle", className: "bg-status-warning text-status-warning-fg border-status-warning-border" },
      { variant: "warning", badgeStyle: "solid",  className: "bg-status-warning-solid text-status-warning-solid-fg border-transparent" },
      // error
      { variant: "error", badgeStyle: "subtle", className: "bg-status-error text-status-error-fg border-status-error-border" },
      { variant: "error", badgeStyle: "solid",  className: "bg-status-error-solid text-status-error-solid-fg border-transparent" },
    ],
    defaultVariants: {
      variant: "default",
      badgeStyle: "subtle",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({ className, variant, badgeStyle, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, badgeStyle, size }), className)} {...props}>
      {dot && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70 mr-1.5 shrink-0"
        />
      )}
      {children}
    </span>
  )
}

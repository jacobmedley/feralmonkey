import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        accent:      "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline:     "border border-input bg-background text-foreground hover:bg-muted hover:text-foreground active:bg-muted/70",
        ghost:       "bg-transparent text-foreground hover:bg-muted hover:text-foreground active:bg-muted/70",
        pill:        "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 rounded-full"
      },
      size: {
        sm:      "h-8  px-3  text-xs",
        default: "h-10 px-4  text-sm",
        lg:      "h-12 px-6  text-base",
        xl:      "h-14 px-8  text-lg",
        bfb:     "h-16 px-10 text-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants>
>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border",
  {
    variants: {
      variant: {
        default:     "bg-card border-border text-foreground",
        destructive: "bg-destructive/10 border-destructive/20 text-destructive",
        success:     "bg-success/10 border-success/20 text-success",
        warning:     "bg-warning/10 border-warning/20 text-warning",
        info:        "bg-info/10 border-info/20 text-info",
      },
      size: {
        sm:      "text-xs py-2 px-3",
        default: "text-sm py-3 px-4",
        lg:      "text-base py-4 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    >
      {icon ? (
        <div className="flex gap-3">
          <span className="mt-0.5 shrink-0">{icon}</span>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium leading-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("opacity-80 mt-1", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

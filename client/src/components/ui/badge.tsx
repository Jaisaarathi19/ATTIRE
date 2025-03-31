import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary border-transparent text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        new: "bg-primary-500 text-white",
        sale: "bg-secondary-500 text-white",
        trending: "bg-amber-500 text-white",
        bestseller: "bg-amber-500 text-white",
        limited: "bg-violet-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: ReactNode;
}

function Badge({ className, variant, children }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface CategoryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function CategoryButton({ active, children, className, ...props }: CategoryButtonProps) {
  return (
    <button
      className={cn(
        "category-btn whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors border-b-2 border-transparent",
        active && "text-primary-600 border-primary-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

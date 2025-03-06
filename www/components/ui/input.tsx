import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative mt-1">
          {icon && <span className="absolute inset-y-0 left-3 flex items-center">{icon}</span>}
          <input
            type={type}
            className={cn(
              `flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors
              file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground
              placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
              disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
              ${icon ? "pl-10" : "pl-3"}`, // Adjust padding if icon exists
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

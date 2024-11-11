import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactElement;
  iconPlacement?: "start" | "end";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPlacement = "end", ...props }, ref) => {
    if (!!icon) {
      const cloneIcon = React.cloneElement(icon, {
        className: "w-5 h-5 text-gray-900",
      });

      icon = cloneIcon;
    }
    return (
      <label className="flex bg-background rounded-lg items-center">
        {iconPlacement === "start" && !!icon && (
          <div className="p-1.5">{icon}</div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {iconPlacement === "end" && !!icon && (
          <div className="p-1.5">{icon}</div>
        )}
      </label>
    );
  }
);
Input.displayName = "Input";

export { Input };

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "h-10 rounded-lg w-full py-2 pl-3 pr-5 bg-transparent text-sm border autofill:!bg-background file:border-0 file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-within:placeholder:text-white",
  {
    variants: {
      color: {
        primary: "border-primary focus-visible:ring-primary text-text",
        primaryForeground: "border-gray-200 focus-visible:ring-gray-200 text-textForefround",
        danger: "border-danger focus-visible:ring-danger",
        secondary: "border-secondary focus-visible:ring-secondary",
      },
      disabled: {
        true: "cursor-not-allowed opacity-30 border-gray-300 focus-visible:ring-0",
      },
    },
    defaultVariants: {
      color: "primary",
      disabled: false,
    },
  }
);

const addonVariants = cva("absolute top-0 w-12 h-10 flex items-center", {
  variants: {
    color: {
      primary: "text-primary",
      primaryForeground: "text-textForefround",
      danger: "text-danger",
      secondary: "text-secondary",
    },
    disabled: {
      true: "cursor-not-allowed opacity-30 text-gray-300",
    },
    addonFilled: {
      true: "border-0",
    },
    icon: {
      true: "border-0",
    },
    place: {
      start: "rounded-s-lg pl-3",
      end: "rounded-e-lg right-0 pl-2.5",
    },
  },
  compoundVariants: [
    {
      color: "primary",
      addonFilled: true,
      className: "bg-primary text-white",
    },
    {
      color: "danger",
      addonFilled: true,
      className: "bg-danger text-white",
    },
    {
      color: "secondary",
      addonFilled: true,
      className: "bg-secondary text-white",
    },
    {
      color: "primary",
      addonFilled: false,
      icon: false,
      place: "start",
      className: "border-r border-r-primary bg-transparent",
    },
    {
      color: "danger",
      addonFilled: false,
      icon: false,
      place: "start",
      className: "border-r border-r-danger bg-transparent",
    },
    {
      color: "secondary",
      addonFilled: false,
      icon: false,
      place: "start",
      className: "border-r border-r-secondary bg-transparent",
    },
    {
      color: "primary",
      addonFilled: false,
      icon: false,
      place: "end",
      className: "border-l border-l-primary bg-transparent",
    },
    {
      color: "danger",
      addonFilled: false,
      icon: false,
      place: "end",
      className: "border-l border-l-danger bg-transparent",
    },
    {
      color: "secondary",
      addonFilled: false,
      icon: false,
      place: "end",
      className: "border-l border-l-secondary bg-transparent",
    },
    {
      disabled: true,
      addonFilled: false,
      icon: false,
      place: "end",
      className: "border-l border-l-gray-300 bg-transparent text-gray-300",
    },
    {
      disabled: true,
      addonFilled: false,
      icon: false,
      place: "start",
      className: "border-r border-r-gray-300 bg-transparent",
    },
    {
      disabled: true,
      addonFilled: true,
      className: "bg-gray-300 text-gray-700",
    },
  ],
  defaultVariants: {
    color: "primary",
    disabled: false,
    addonFilled: false,
    icon: false,
  },
});

type InputHTMLUIAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "color"
>;

export interface InputProps
  extends InputHTMLUIAttributes,
    VariantProps<typeof inputVariants> {
  label?: string;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  icon?: React.ReactElement;
  iconPlacement?: "start" | "end";
  addonFilled?: boolean;
  disabled?: boolean;
  full?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      disabled = false,
      addonBefore,
      addonAfter,
      label = "",
      icon,
      iconPlacement = "start",
      addonFilled = false,
      color = "primary",
      full = true,
      ...props
    },
    ref
  ) => {
    if (!!icon) {
      const cloneIcon = React.cloneElement(icon, {
        className: "w-5 h-5",
      });

      icon = cloneIcon;
    }

    return (
      <label
        className={cn(
          full ? "w-full" : "w-fit",
          "flex flex-col gap-1.5 text-text !h-auto"
        )}
      >
        {label && <span>{label}</span>}
        <div className={cn("relative", className)}>
          {addonBefore && (
            <Addon
              place="start"
              disabled={disabled}
              addonFilled={addonFilled}
              color={color}
            >
              {addonBefore}
            </Addon>
          )}

          {icon && iconPlacement === "start" && !addonBefore && (
            <Addon place="start" disabled={disabled} icon color={color}>
              {icon}
            </Addon>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ color, disabled }),
              !!addonBefore
                ? "pl-14"
                : icon && iconPlacement === "start"
                ? "pl-10"
                : "pl-3",
              !!addonAfter
                ? "pr-14"
                : icon && iconPlacement === "end"
                ? "pr-10"
                : "pr-3",
              props?.readOnly ? "text-gray-400" : ""
            )}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {addonAfter && (
            <Addon
              place="end"
              disabled={disabled}
              addonFilled={addonFilled}
              color={color}
            >
              {addonAfter}
            </Addon>
          )}
          {icon && iconPlacement === "end" && !addonAfter && (
            <Addon place="end" disabled={disabled} icon color={color}>
              {icon}
            </Addon>
          )}
        </div>
      </label>
    );
  }
);
Input.displayName = "Input";

export { Input };

interface AddonProps extends VariantProps<typeof addonVariants> {
  classes?: string;
  children: React.ReactNode;
}

const Addon = ({
  place,
  addonFilled,
  color,
  disabled,
  icon,
  classes,
  children,
}: AddonProps) => {
  return (
    <span
      className={cn(
        addonVariants({ disabled, color, addonFilled, place, icon }),
        classes
      )}
    >
      {children}
    </span>
  );
};

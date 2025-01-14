import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-lg whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      color: {
        primary:
          "bg-primary text-textForefround hover:bg-primary/90 ring-primary border-primary",
        danger:
          "bg-danger text-textForefround hover:bg-danger/90 border-danger",
        success:
          "bg-success text-textForefround hover:bg-success/90 border-success",
        warning:
          "bg-warning text-textForefround hover:bg-warning/90 border-warning",
        secondary:
          "bg-secondary text-textForefround hover:bg-secondary/90 border-secondary",
      },
      variant: {
        solid: "border-0",
        outline: "border bg-transparent",
        dashed: "border border-dashed bg-transparent",
        link: "bg-transparent hover:underline underline-offset-4 hover:bg-transparent !px-0",
      },
      //IF U CHANGE SIZE MUST CHANGE ICON SIZE BELOW
      size: {
        default: "h-9 lg:h-12 px-5 lg:px-7 text-sm lg:text-base",
        sm: "h-5 lg:h-7 px-2.5 lg:px-4 text-xs lg:text-sm",
        lg: "h-8 lg:h-11 px-8 lg:px-10 text-sm lg:text-lg",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
      },
      full: {
        true: "w-full",
      },
      iconPlacement: {
        start: "flex-row-reverse",
        end: "flex-row",
      },
    },
    compoundVariants: [
      {
        color: "primary",
        variant: ["outline", "dashed"],
        className: "text-primary hover:text-textForefround",
      },
      {
        color: "secondary",
        variant: ["outline", "dashed"],
        className: "text-secondary hover:text-textForefround",
      },
      {
        color: "danger",
        variant: ["outline", "dashed"],
        className: "text-danger hover:text-textForefround",
      },
      {
        color: "success",
        variant: ["outline", "dashed"],
        className: "text-success hover:text-textForefround",
      },
      {
        color: "warning",
        variant: ["outline", "dashed"],
        className: "text-warning hover:text-textForefround",
      },
      {
        color: "primary",
        variant: "link",
        className: "text-primary border-0",
      },
      {
        color: "secondary",
        variant: "link",
        className: "text-secondary border-0",
      },
      {
        color: "danger",
        variant: "link",
        className: "text-danger border-0",
      },
      {
        color: "success",
        variant: "link",
        className: "text-success border-0",
      },
      {
        color: "warning",
        variant: "link",
        className: "text-warning border-0",
      },
    ],
    defaultVariants: {
      color: "primary",
      variant: "solid",
      size: "default",
      disabled: false,
      full: false,
      iconPlacement: "start",
    },
  }
);

//IF U CHANGE ICON SIZE MUST CHANGE SIZE ABOVE
const iconVariant = cva("border-0", {
  variants: {
    size: {
      default: "h-4 w-4 lg:h-5 lg:w-5",
      sm: "h-3 w-3 lg:h-4 lg:w-4",
      lg: "h-5 w-5 lg:h-6 lg:w-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type ButtonHTMLUiAttributes = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color" | "disabled"
>;

export interface ButtonProps
  extends ButtonHTMLUiAttributes,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactElement;
  loading?: boolean;
  iconPlacement?: "start" | "end";
}

const LoadingIcon = () => (
  <div role="status">
    <svg
      className="w-4 h-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      color,
      variant,
      size,
      disabled,
      loading = false,
      asChild = false,
      icon,
      full,
      iconPlacement,
      type = "button",
      ...props
    },
    ref
  ) => {
    if (loading) {
      disabled = true;
      icon = <LoadingIcon />;
    }
    const Comp = asChild ? Slot : "button";

    if (icon) {
      const clonedIcon = React.cloneElement(icon, {
        key: "buttonIcon",
        className: iconVariant({ size }),
      });
      const childrenArray = React.Children.toArray(props.children);
      const childrenWithIcon = [...childrenArray, clonedIcon];
      props.children = childrenWithIcon;
    }

    if (
      asChild &&
      icon &&
      React.Children.toArray(props.children).length === 2
    ) {
      const childrenArray = React.Children.toArray(props.children);
      //@ts-ignore
      props.children = React.createElement(childrenArray[0]?.type, {}, [
        //@ts-ignore
        childrenArray[0].props.children,
        childrenArray[1],
      ]);
    }

    return (
      <Comp
        className={cn(
          buttonVariants({
            color,
            variant,
            size,
            className,
            disabled,
            full,
            iconPlacement,
          })
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

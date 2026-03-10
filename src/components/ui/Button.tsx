import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: "primary" | "outline" | "ghost" | "icon";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-neutral-900 text-white hover:bg-neutral-900/90": variant === "primary",
                        "border border-neutral-200 bg-white hover:bg-neutral-100": variant === "outline",
                        "hover:bg-neutral-100 hover:text-neutral-900": variant === "ghost",
                        "h-10 px-6 py-2": size === "default",
                        "h-9 px-4": size === "sm",
                        "h-11 px-8": size === "lg",
                        "h-10 w-10 p-0 text-neutral-900 bg-neutral-100 hover:bg-neutral-200": size === "icon" || variant === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };

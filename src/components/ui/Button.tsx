"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800",
        secondary:
          "bg-secondary-600 text-white hover:bg-secondary-700 dark:bg-secondary-700 dark:hover:bg-secondary-800",
        outline:
          "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900",
        ghost:
          "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50",
        glass:
          "glass dark:glass-dark glass-hover dark:glass-hover-dark text-gray-900 dark:text-white",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
      roundedness: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      isLoading: {
        true: "relative !text-transparent hover:!text-transparent",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      roundedness: "md",
      isLoading: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  animate?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      roundedness,
      isLoading,
      animate = false,
      children,
      ...props
    },
    ref
  ) => {
    const ButtonComponent = (
      animate ? motion.button : "button"
    ) as React.ElementType;

    const animationProps = animate
      ? {
          whileHover: { scale: 1.03 },
          whileTap: { scale: 0.97 },
        }
      : {};

    return (
      <ButtonComponent
        ref={ref}
        {...(animate
          ? {
              className: buttonVariants({
                variant,
                size,
                roundedness,
                isLoading,
                className,
              }),
              ...animationProps,
              ...props,
            }
          : {
              className: buttonVariants({
                variant,
                size,
                roundedness,
                isLoading,
                className,
              }),
              ...props,
            })}
      >
        {children}
        {isLoading && (
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-current"
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
          </span>
        )}
      </ButtonComponent>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

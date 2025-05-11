// src/components/Button.tsx
import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...rest
}) => {
  const baseStyles =
    "py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer";
  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 cursor-pointer",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 cursor-pointer",
    danger:
      "bg-red-600 hover:bg-red-700 text-white border border-red-600 cursor-pointer",
  };
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${
    variantStyles[variant] || variantStyles.primary
  } ${widthStyles} ${className || ""}`;

  return (
    <button className={combinedClassName} {...rest}>
      {children}
    </button>
  );
};

export default Button;

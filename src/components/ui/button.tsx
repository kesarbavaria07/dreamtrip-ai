"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 backdrop-blur-md";
    
    const variants = {
      primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105",
      secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      outline: "border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400/10",
      ghost: "text-white/80 hover:text-white hover:bg-white/10"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
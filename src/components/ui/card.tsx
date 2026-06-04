"use client";

import { forwardRef, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "interactive";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles = "relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden";
    
    const variants = {
      default: "shadow-lg shadow-black/5",
      hover: "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-purple-500/10 hover:border-white/30 transition-all duration-300",
      interactive: "shadow-lg shadow-black/5 cursor-pointer active:scale-95 transition-all duration-200"
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
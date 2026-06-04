"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: {
    text: string;
    href?: string;
  };
  links?: NavLink[];
  actions?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
}

const defaultLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Plan Trip", href: "/plan" },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" }
];

export default function Navbar({
  logo = { text: "DreamTrip AI", href: "/" },
  links = defaultLinks,
  actions,
  sticky = true,
  transparent = false
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSticky = sticky && !transparent;
  const showBackground = !transparent || isScrolled;

  return (
    <nav
      className={`
        ${isSticky && isScrolled ? "fixed top-0 left-0 right-0 z-50" : ""}
        w-full transition-all duration-300
        ${showBackground
          ? "py-3 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg"
          : "py-5 bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={logo.href || "/"}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {logo.text}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Actions / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {actions || (
              <>
                <button className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Sign In
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all">
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300
            ${isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}
          `}
        >
          <div className="pb-4 border-t border-white/10 pt-4">
            {/* Mobile Links */}
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              {actions ? (
                actions
              ) : (
                <>
                  <button className="w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                    Sign In
                  </button>
                  <button className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/30">
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
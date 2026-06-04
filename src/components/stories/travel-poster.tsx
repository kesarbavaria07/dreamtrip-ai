"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";

// ================================
// Types
// ================================

export interface TravelPosterProps {
  destination: string;
  tagline?: string;
  imageUrl?: string;
  onDownload?: () => void;
}

interface PosterTheme {
  gradient: string;
  accent: string;
  textColor: string;
  overlay: string;
}

// ================================
// Theme Presets
// ================================

const THEMES: Record<string, PosterTheme> = {
  tropical: {
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
    accent: "#06b6d4",
    textColor: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.3)",
  },
  sunset: {
    gradient: "from-orange-400 via-pink-500 to-purple-600",
    accent: "#f97316",
    textColor: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.25)",
  },
  forest: {
    gradient: "from-green-500 via-emerald-600 to-teal-700",
    accent: "#22c55e",
    textColor: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.35)",
  },
  arctic: {
    gradient: "from-slate-300 via-blue-300 to-indigo-500",
    accent: "#60a5fa",
    textColor: "#1e293b",
    overlay: "rgba(255, 255, 255, 0.2)",
  },
  desert: {
    gradient: "from-amber-400 via-orange-500 to-red-600",
    accent: "#f59e0b",
    textColor: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.3)",
  },
  night: {
    gradient: "from-slate-900 via-purple-900 to-slate-900",
    accent: "#a855f7",
    textColor: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.5)",
  },
};

// ================================
// Helper Functions
// ================================

function getThemeForDestination(destination: string): PosterTheme {
  const lower = destination.toLowerCase();
  
  if (lower.includes("beach") || lower.includes("maldives") || lower.includes("hawaii") || lower.includes("bali")) {
    return THEMES.tropical;
  }
  if (lower.includes("sunset") || lower.includes("santorini") || lower.includes("costa")) {
    return THEMES.sunset;
  }
  if (lower.includes("forest") || lower.includes("switzerland") || lower.includes("norway") || lower.includes("canada")) {
    return THEMES.forest;
  }
  if (lower.includes("iceland") || lower.includes("arctic") || lower.includes("alaska") || lower.includes("finland")) {
    return THEMES.arctic;
  }
  if (lower.includes("desert") || lower.includes("dubai") || lower.includes("morocco") || lower.includes("vegas")) {
    return THEMES.desert;
  }
  if (lower.includes("night") || lower.includes("tokyo") || lower.includes("paris") || lower.includes("london")) {
    return THEMES.night;
  }
  
  // Default theme
  return THEMES.tropical;
}

function getDestinationEmoji(destination: string): string {
  const lower = destination.toLowerCase();
  
  if (lower.includes("japan") || lower.includes("tokyo")) return "🏯";
  if (lower.includes("france") || lower.includes("paris")) return "🗼";
  if (lower.includes("italy") || lower.includes("rome")) return "🏛️";
  if (lower.includes("usa") || lower.includes("new york")) return "🗽";
  if (lower.includes("beach") || lower.includes("hawaii")) return "🏝️";
  if (lower.includes("mountain") || lower.includes("swiss")) return "🏔️";
  if (lower.includes("city") || lower.includes("london")) return "🌆";
  if (lower.includes("tropical") || lower.includes("bali")) return "🌴";
  if (lower.includes("desert") || lower.includes("dubai")) return "🏜️";
  if (lower.includes("island") || lower.includes("maldives")) return "🏖️";
  
  return "✈️";
}

function generateDecorativeElements(): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const positions = [
    { top: "10%", left: "5%", size: 20, opacity: 20 },
    { top: "20%", right: "8%", size: 12, opacity: 15 },
    { top: "70%", left: "10%", size: 16, opacity: 18 },
    { top: "85%", right: "15%", size: 24, opacity: 12 },
    { top: "40%", left: "3%", size: 8, opacity: 25 },
    { top: "60%", right: "5%", size: 14, opacity: 20 },
  ];
  
  positions.forEach((pos, i) => {
    const style: React.CSSProperties = {
      position: "absolute",
      top: pos.top,
      left: pos.left,
      right: pos.right,
      width: pos.size,
      height: pos.size,
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.3)",
      filter: "blur(1px)",
    };
    elements.push(<div key={i} style={style} />);
  });
  
  return elements;
}

// ================================
// Component
// ================================

export default function TravelPoster({
  destination,
  tagline = "Where dreams become destinations",
  imageUrl,
  onDownload,
}: TravelPosterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [themeName] = useState(() => {
    // Determine theme based on destination
    const lower = destination.toLowerCase();
    if (lower.includes("beach") || lower.includes("tropical") || lower.includes("hawaii") || lower.includes("maldives")) return "tropical";
    if (lower.includes("sunset") || lower.includes("santorini")) return "sunset";
    if (lower.includes("forest") || lower.includes("swiss") || lower.includes("norway")) return "forest";
    if (lower.includes("iceland") || lower.includes("arctic") || lower.includes("alaska")) return "arctic";
    if (lower.includes("desert") || lower.includes("dubai") || lower.includes("vegas")) return "desert";
    if (lower.includes("tokyo") || lower.includes("night")) return "night";
    return "tropical";
  });
  
  const theme = THEMES[themeName];
  const emoji = getDestinationEmoji(destination);
  const decorativeElements = generateDecorativeElements();

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onDownload?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Poster Container */}
      <div
        className="relative w-full aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      >
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
        />
        
        {/* Image Overlay (if provided) */}
        {imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={destination}
              fill
              className="object-cover"
              style={{ filter: "brightness(0.6)" }}
            />
          </div>
        )}
        
        {/* Color Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: theme.overlay }}
        />
        
        {/* Decorative Elements */}
        {decorativeElements}
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Emoji Badge */}
          <div className="text-6xl mb-6 animate-bounce">
            {emoji}
          </div>
          
          {/* Destination Name */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            {destination.toUpperCase()}
          </h1>
          
          {/* Divider */}
          <div className="w-24 h-1 bg-white/50 rounded-full mb-6" />
          
          {/* Tagline */}
          <p
            className="text-xl md:text-2xl italic text-white/90 drop-shadow-md max-w-xs"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "{tagline}"
          </p>
          
          {/* Bottom Badge */}
          <div className="absolute bottom-8 flex flex-col items-center gap-2">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-sm text-white/80">DreamTrip AI</span>
            </div>
            <span className="text-xs text-white/50">
              Create your dream trip ✨
            </span>
          </div>
        </div>
        
        {/* Decorative Corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-lg" />
      </div>
      
      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Poster</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ================================
// Portable Version (No Hooks)
// ================================

export function TravelPosterSimple({
  destination,
  tagline = "Where dreams become destinations",
  imageUrl,
  theme = "tropical",
}: {
  destination: string;
  tagline?: string;
  imageUrl?: string;
  theme?: "tropical" | "sunset" | "forest" | "arctic" | "desert" | "night";
}) {
  const currentTheme = THEMES[theme];
  const emoji = getDestinationEmoji(destination);
  const decorativeElements = generateDecorativeElements();

  return (
    <div
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient}`}
      />
      
      {/* Image Overlay */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={destination}
            fill
            className="object-cover"
            style={{ filter: "brightness(0.6)" }}
          />
        </div>
      )}
      
      {/* Color Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: currentTheme.overlay }}
      />
      
      {/* Decorative Elements */}
      {decorativeElements}
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
        {/* Emoji Badge */}
        <div className="text-6xl mb-6">
          {emoji}
        </div>
        
        {/* Destination Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          {destination.toUpperCase()}
        </h1>
        
        {/* Divider */}
        <div className="w-24 h-1 bg-white/50 rounded-full mb-6" />
        
        {/* Tagline */}
        <p
          className="text-xl md:text-2xl italic text-white/90 drop-shadow-md max-w-xs"
          style={{ fontFamily: "Georgia, serif" }}
        >
          "{tagline}"
        </p>
        
        {/* Bottom Badge */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-sm text-white/80">DreamTrip AI</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-lg" />
    </div>
  );
}
"use client";

import { useState } from "react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  onSearch?: (data: SearchData) => void;
}

interface SearchData {
  destination: string;
  budget: string;
  travelStyle: string;
}

const travelStyles = [
  { value: "adventure", label: "Adventure & Exploration" },
  { value: "relaxation", label: "Relaxation & Wellness" },
  { value: "cultural", label: "Cultural & Historical" },
  { value: "culinary", label: "Culinary & Food" },
  { value: "romantic", label: "Romantic Getaway" },
  { value: "family", label: "Family Friendly" },
  { value: "luxury", label: "Luxury Travel" },
  { value: "budget", label: "Budget Friendly" }
];

export default function Hero({
  title = "DreamTrip AI",
  subtitle = "Turn travel dreams into intelligent journeys.",
  onSearch
}: HeroProps) {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ destination, budget, travelStyle });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 -right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute -bottom-1/4 left-1/3 w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Header Content */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Destination Input */}
            <div className="relative">
              <label className="block text-xs text-white/40 mb-2 ml-1 uppercase tracking-wider">
                Destination
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Budget Input */}
            <div className="relative">
              <label className="block text-xs text-white/40 mb-2 ml-1 uppercase tracking-wider">
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-medium">
                  $
                </span>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all [&>option]:bg-gray-900"
                >
                  <option value="" disabled className="text-white/30">Select budget</option>
                  <option value="budget" className="text-white">Budget ($500-$1,500)</option>
                  <option value="moderate" className="text-white">Moderate ($1,500-$3,000)</option>
                  <option value="premium" className="text-white">Premium ($3,000-$5,000)</option>
                  <option value="luxury" className="text-white">Luxury ($5,000+)</option>
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Travel Style Dropdown */}
            <div className="relative">
              <label className="block text-xs text-white/40 mb-2 ml-1 uppercase tracking-wider">
                Travel Style
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all [&>option]:bg-gray-900"
                >
                  <option value="" disabled className="text-white/30">Select style</option>
                  {travelStyles.map((style) => (
                    <option key={style.value} value={style.value} className="text-white">
                      {style.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-12 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Generate My Trip
          </button>
        </form>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-10 text-white/40">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">10k+ Travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">50+ Countries</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">5min Avg Plan</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
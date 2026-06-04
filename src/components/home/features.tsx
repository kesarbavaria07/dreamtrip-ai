"use client";

import GlassCard from "@/components/ui/card";

const features = [
  {
    title: "AI-Powered Itineraries",
    description: "Advanced LLM technology creates detailed, personalized travel plans based on your preferences and travel style.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "indigo"
  },
  {
    title: "Smart Budget Planning",
    description: "Real-time cost estimation with expense tracking, category breakdowns, and money-saving recommendations.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "emerald"
  },
  {
    title: "Travel Preferences",
    description: "Remember your travel style, dietary needs, mobility requirements, and favorite activities for every trip.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "violet"
  },
  {
    title: "Share Travel Stories",
    description: "Document your journey with rich text editor, photo galleries, and interactive maps. Create lasting memories.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    color: "rose"
  },
  {
    title: "Beautiful Posters",
    description: "Generate stunning travel posters with AI-crafted designs. Share your adventures in style.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "amber"
  },
  {
    title: "Multi-Destination Support",
    description: "Plan complex multi-city trips with interconnected itineraries and optimized travel routes.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "cyan"
  }
];

const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
  indigo: { bg: "from-indigo-500/20 to-indigo-500/10", border: "border-indigo-500/30", icon: "text-indigo-400 bg-indigo-500/10" },
  emerald: { bg: "from-emerald-500/20 to-emerald-500/10", border: "border-emerald-500/30", icon: "text-emerald-400 bg-emerald-500/10" },
  violet: { bg: "from-violet-500/20 to-violet-500/10", border: "border-violet-500/30", icon: "text-violet-400 bg-violet-500/10" },
  rose: { bg: "from-rose-500/20 to-rose-500/10", border: "border-rose-500/30", icon: "text-rose-400 bg-rose-500/10" },
  amber: { bg: "from-amber-500/20 to-amber-500/10", border: "border-amber-500/30", icon: "text-amber-400 bg-amber-500/10" },
  cyan: { bg: "from-cyan-500/20 to-cyan-500/10", border: "border-cyan-500/30", icon: "text-cyan-400 bg-cyan-500/10" }
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30">
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            A complete suite of AI-powered tools to transform how you plan and experience travel.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const colors = colorClasses[feature.color];
            return (
              <GlassCard
                key={feature.title}
                variant="hover"
                className={`p-6 bg-gradient-to-br ${colors.bg} ${colors.border}`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
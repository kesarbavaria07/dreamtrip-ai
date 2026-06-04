"use client";

import React, { useState } from "react";
import type { ItineraryDay, Activity } from "@/types/travel";

// -----------------------------
// Props
// -----------------------------

export interface ItineraryProps {
  itinerary: ItineraryDay[];
  className?: string;
}

// -----------------------------
// Activity Icon Mapping
// -----------------------------

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  sightseeing: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  dining: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m13-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  shopping: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  adventure: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  nightlife: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  wellness: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  transport: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
};

// -----------------------------
// Activity Card Component
// -----------------------------

function ActivityCard({ activity }: { activity: Activity }) {
  const icon = ACTIVITY_ICONS[activity.activity?.type || "sightseeing"];

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="font-medium text-white truncate">
            {activity.activity?.name || "Activity"}
          </h4>
          <span className="text-xs text-white/40 flex-shrink-0">
            {activity.time?.start} - {activity.time?.end}
          </span>
        </div>
        
        <p className="text-sm text-white/50 line-clamp-2 mb-2">
          {activity.activity?.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-white/40">
          {/* Duration */}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {activity.time?.duration || 120} min
          </span>

          {/* Price */}
          {activity.activity?.price?.min ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ${activity.activity.price.min}
            </span>
          ) : null}

          {/* Rating */}
          {activity.activity?.rating ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {activity.activity.rating}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Day Card Component
// -----------------------------

function DayCard({ day }: { day: ItineraryDay }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20">
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left flex items-start gap-4"
      >
        {/* Day Badge */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex flex-col items-center justify-center">
          <span className="text-xs text-indigo-300 font-medium">Day</span>
          <span className="text-2xl font-bold text-white">{day.day}</span>
        </div>

        {/* Day Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-white">{day.title}</h3>
            <span className="text-sm text-white/40 flex-shrink-0">{formattedDate}</span>
          </div>
          <p className="text-white/50 text-sm mt-1 line-clamp-2">{day.summary}</p>
        </div>

        {/* Expand Icon */}
        <svg
          className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Activities List */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 space-y-3">
          {/* Highlights */}
          {day.highlights && day.highlights.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {day.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Activities ({day.activities?.length || 0})
          </h4>
          <div className="space-y-2">
            {day.activities?.map((activity, index) => (
              <ActivityCard key={activity.id || index} activity={activity} />
            ))}
          </div>

          {/* Tips */}
          {day.tips && day.tips.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-amber-400 mb-1">Pro Tips</h4>
                  <ul className="space-y-1">
                    {day.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-white/60">• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Main Itinerary Component
// -----------------------------

export default function Itinerary({ itinerary, className = "" }: ItineraryProps) {
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-white/40">No itinerary planned yet</p>
        <p className="text-white/30 text-sm mt-1">Start planning to see your trip schedule</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Itinerary</h2>
          <p className="text-white/50 text-sm">
            {itinerary.length} day{itinerary.length !== 1 ? "s" : ""} of adventures
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {itinerary.length} days
        </div>
      </div>

      {/* Day Cards */}
      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <DayCard key={day.day || index} day={day} />
        ))}
      </div>
    </div>
  );
}
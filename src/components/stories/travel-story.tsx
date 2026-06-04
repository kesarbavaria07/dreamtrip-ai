"use client";

import { useState } from "react";

// -----------------------------
// Props
// -----------------------------

export interface TravelStoryProps {
  story: string;
  title?: string;
  author?: string;
  location?: string;
  date?: string;
  coverImage?: string;
  className?: string;
}

// -----------------------------
// Parse Story into Sections
// -----------------------------

interface StorySection {
  type: "paragraph" | "heading" | "quote";
  content: string;
}

function parseStory(story: string): StorySection[] {
  const lines = story.split("\n");
  const sections: StorySection[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) continue;

    // Check for headings (## or #)
    if (trimmed.startsWith("## ")) {
      sections.push({ type: "heading", content: trimmed.replace("## ", "") });
    } else if (trimmed.startsWith("# ")) {
      sections.push({ type: "heading", content: trimmed.replace("# ", "") });
    }
    // Check for quotes (lines starting with > or ")
    else if (trimmed.startsWith(">") || trimmed.startsWith('"')) {
      sections.push({ type: "quote", content: trimmed.replace(/^[>"]\s*/, "").replace(/[>"]$/, "") });
    }
    // Regular paragraph
    else {
      sections.push({ type: "paragraph", content: trimmed });
    }
  }

  return sections;
}

// -----------------------------
// Section Renderer
// -----------------------------

function StorySection({ section }: { section: StorySection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 first:mt-0">
          {section.content}
        </h2>
      );

    case "quote":
      return (
        <blockquote className="relative my-8 py-8 px-6 md:px-10">
          {/* Decorative Quote Mark */}
          <span className="absolute top-4 left-4 md:left-6 text-6xl font-serif text-indigo-500/30 leading-none">
            &ldquo;
          </span>
          
          <p className="text-xl md:text-2xl italic text-white/90 leading-relaxed relative z-10">
            {section.content}
          </p>
          
          {/* Bottom Line */}
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-indigo-500 to-purple-500" />
        </blockquote>
      );

    case "paragraph":
    default:
      return (
        <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6">
          {section.content}
        </p>
      );
  }
}

// -----------------------------
// Reading Progress Bar
// -----------------------------

function ReadingProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// -----------------------------
// Main Component
// -----------------------------

export default function TravelStory({
  story,
  title,
  author = "Anonymous Traveler",
  location,
  date,
  coverImage,
  className = "",
}: TravelStoryProps) {
  const [progress, setProgress] = useState(0);

  // Handle scroll for reading progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight - element.clientHeight;
    const newProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setProgress(newProgress);
  };

  const sections = parseStory(story);

  if (!story || story.trim().length === 0) {
    return (
      <div className={`text-center py-16 px-4 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Story Yet</h3>
          <p className="text-white/40">
            Your travel story will appear here once generated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Reading Progress */}
      <ReadingProgress progress={progress} />

      {/* Header Image */}
      {coverImage && (
        <div className="relative h-64 md:h-80 lg:h-96 -mx-4 md:-mx-6 lg:-mx-8 mb-8 overflow-hidden">
          <img
            src={coverImage}
            alt={title || "Travel story cover"}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Title Overlay */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                {location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                  </span>
                )}
                <span>•</span>
                <span>{author}</span>
                {date && (
                  <>
                    <span>•</span>
                    <span>{date}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Story Content */}
      <div
        className="max-w-3xl mx-auto overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2"
        onScroll={handleScroll}
      >
        {/* Story Without Cover Image - Show Header */}
        {!coverImage && title && (
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/40 text-sm">
              {location && <span>{location}</span>}
              <span>•</span>
              <span>{author}</span>
              {date && (
                <>
                  <span>•</span>
                  <span>{date}</span>
                </>
              )}
            </div>
            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-16 h-px bg-white/20" />
              <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="w-16 h-px bg-white/20" />
            </div>
          </div>
        )}

        {/* Story Body */}
        <article className="prose prose-lg">
          {sections.map((section, index) => (
            <StorySection key={index} section={section} />
          ))}
        </article>

        {/* End Marker */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-6">
            <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-white/30 text-sm">The End</p>
        </div>
      </div>

      {/* Share Actions */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-sm">Share this story</p>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
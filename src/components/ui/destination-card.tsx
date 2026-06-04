"use client";

import React, { useState } from "react";
import Image from "next/image";

// -----------------------------
// Props
// -----------------------------

export interface DestinationCardProps {
  name: string;
  image: string;
  description?: string;
  country?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

// -----------------------------
// Star Rating
// -----------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// -----------------------------
// Default Variant
// -----------------------------

function DefaultCard({
  name,
  image,
  description,
  country,
  rating,
  reviewCount,
  priceRange,
  onClick,
  className = "",
}: DestinationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative overflow-hidden rounded-2xl cursor-pointer
        bg-white/5 border border-white/10 backdrop-blur-sm
        transition-all duration-300
        ${onClick ? "hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10" : ""}
        ${isHovered ? "transform scale-[1.02]" : ""}
        ${className}
      `}
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Location Badge */}
        {country && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-white/10">
            <span className="text-xs font-medium text-white/80">{country}</span>
          </div>
        )}

        {/* Rating Badge */}
        {rating !== undefined && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-white">{rating}</span>
          </div>
        )}

        {/* Hover Overlay with Quick View */}
        <div className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}>
          <span className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium backdrop-blur-md">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
            {name}
          </h3>
          {priceRange && (
            <span className="text-sm text-white/50 whitespace-nowrap">
              {priceRange}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-white/50 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {reviewCount !== undefined && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {reviewCount.toLocaleString()} reviews
          </div>
        )}
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}

// -----------------------------
// Compact Variant
// -----------------------------

function CompactCard({
  name,
  image,
  country,
  onClick,
  className = "",
}: DestinationCardProps) {
  return (
    <article
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl cursor-pointer
        bg-white/5 border border-white/10 backdrop-blur-sm
        transition-all duration-300 hover:border-white/20
        ${className}
      `}
    >
      <div className="relative h-32 md:h-40">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
          {country && (
            <p className="text-xs text-white/60 truncate">{country}</p>
          )}
        </div>
      </div>
    </article>
  );
}

// -----------------------------
// Featured Variant
// -----------------------------

function FeaturedCard({
  name,
  image,
  description,
  country,
  rating,
  reviewCount,
  priceRange,
  onClick,
  className = "",
}: DestinationCardProps) {
  return (
    <article
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-3xl cursor-pointer
        bg-white/5 border border-white/10 backdrop-blur-sm
        transition-all duration-300
        ${onClick ? "hover:border-white/30" : ""}
        ${className}
      `}
    >
      {/* Large Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Featured Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
          <span className="text-xs font-semibold text-white">Featured</span>
        </div>

        {/* Rating */}
        {rating !== undefined && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-white">{rating}</span>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {country && (
            <p className="text-sm text-indigo-300 font-medium mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {country}
            </p>
          )}
          
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
            {name}
          </h3>
          
          {description && (
            <p className="text-white/70 text-sm line-clamp-2 mb-4">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {priceRange && (
              <span className="text-lg font-semibold text-white">{priceRange}</span>
            )}
            
            {reviewCount !== undefined && (
              <span className="text-sm text-white/50">
                {reviewCount.toLocaleString()} reviews
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// -----------------------------
// Main Component
// -----------------------------

export default function DestinationCard(props: DestinationCardProps) {
  const { variant = "default" } = props;

  switch (variant) {
    case "compact":
      return <CompactCard {...props} />;
    case "featured":
      return <FeaturedCard {...props} />;
    default:
      return <DefaultCard {...props} />;
  }
}
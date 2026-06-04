/**
 * Travel Recommendation Engine
 * 
 * Provides destination recommendations based on user preferences.
 * Matches destinations against budget, travel style, and duration.
 * 
 * Usage:
 * ```typescript
 * import { getDestinationRecommendations } from "@/lib/recommendations";
 * 
 * const recommendations = getDestinationRecommendations(
 *   {
 *     budget: "moderate",
 *     travelStyle: "cultural",
 *     duration: 7,
 *     preferredDestinations: ["Japan", "Korea"],
 *   },
 *   destinations
 * );
 * 
 * // Get top 5 destinations
 * const top5 = recommendations.recommendations.slice(0, 5);
 * ```
 */

import type {
  BudgetLevel,
  TravelStyle,
  Destination,
  CostLevel,
} from "@/types/travel";

// ================================
// Input / Output Types
// ================================

export interface RecommendationInput {
  budget: BudgetLevel;
  travelStyle: TravelStyle;
  duration: number; // days
  preferredDestinations?: string[];
  excludeDestinations?: string[];
  season?: "spring" | "summer" | "fall" | "winter";
  groupSize?: number;
  accessibilityNeeds?: string[];
}

export interface DestinationRecommendation {
  destination: Destination;
  score: number; // 0-100 match score
  matchReasons: string[];
  estimatedCost: number;
  highlights: string[];
  warnings?: string[];
  bestTimeToVisit: string;
}

export interface RecommendationOutput {
  recommendations: DestinationRecommendation[];
  totalMatches: number;
  searchParams: RecommendationInput;
}

// ================================
// Scoring Weights
// ================================

const SCORING = {
  BUDGET_MATCH: 35,
  STYLE_MATCH: 30,
  DURATION_MATCH: 20,
  PREFERENCE_BOOST: 10,
  SEASON_MATCH: 5,
} as const;

// Budget ranges (daily cost in USD)
const BUDGET_RANGES: Record<BudgetLevel, { min: number; max: number }> = {
  budget: { min: 30, max: 100 },
  moderate: { min: 100, max: 250 },
  premium: { min: 250, max: 500 },
  luxury: { min: 500, max: 2000 },
};

// Travel style to activity preferences
const STYLE_PREFERENCES: Record<TravelStyle, string[]> = {
  adventure: ["mountain", "beach", "hiking", "diving", "safari"],
  relaxation: ["beach", "spa", "resort", "island", "retreat"],
  cultural: ["museum", "historic", "temple", "architecture", "art"],
  culinary: ["food", "market", "restaurant", "cooking", "wine"],
  romantic: ["beach", "sunset", "viewpoint", "coastal", "luxury"],
  family: ["theme park", "zoo", "beach", "museum", "nature"],
  luxury: ["resort", "spa", "fine dining", "exclusive", "premium"],
};

// Duration preferences by style
const DURATION_PREFERENCES: Record<TravelStyle, { min: number; ideal: number; max: number }> = {
  adventure: { min: 5, ideal: 10, max: 21 },
  relaxation: { min: 3, ideal: 7, max: 14 },
  cultural: { min: 5, ideal: 10, max: 30 },
  culinary: { min: 3, ideal: 7, max: 21 },
  romantic: { min: 3, ideal: 7, max: 14 },
  family: { min: 5, ideal: 10, max: 21 },
  luxury: { min: 3, ideal: 7, max: 21 },
};

// ================================
// Recommendation Engine
// ================================

export function getDestinationRecommendations(
  input: RecommendationInput,
  availableDestinations: Destination[]
): RecommendationOutput {
  const {
    budget,
    travelStyle,
    duration,
    preferredDestinations = [],
    excludeDestinations = [],
    season,
    groupSize = 1,
    accessibilityNeeds = [],
  } = input;

  // Filter out excluded destinations
  let candidates = availableDestinations.filter(
    (d) => !excludeDestinations.includes(d.name)
  );

  // Score each destination
  const scored = candidates.map((destination) => {
    return scoreDestination(destination, {
      budget,
      travelStyle,
      duration,
      preferredDestinations,
      season,
      groupSize,
      accessibilityNeeds,
    });
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Format output
  const recommendations = scored.map((s) => s.recommendation);
  const topMatches = recommendations.slice(0, 10);

  return {
    recommendations: topMatches,
    totalMatches: scored.length,
    searchParams: input,
  };
}

function scoreDestination(
  destination: Destination,
  params: Omit<RecommendationInput, "excludeDestinations">
): { recommendation: DestinationRecommendation; score: number } {
  const { budget, travelStyle, duration, preferredDestinations = [], season, groupSize = 1, accessibilityNeeds = [] } = params;

  let totalScore = 0;
  const matchReasons: string[] = [];
  const warnings: string[] = [];
  const highlights: string[] = [];

  // ================================
  // Budget Match (35 points max)
  // ================================
  const budgetScore = calculateBudgetScore(destination, budget);
  totalScore += budgetScore;

  if (budgetScore >= 30) {
    matchReasons.push(`Excellent value for ${budget} budget`);
  } else if (budgetScore >= 20) {
    matchReasons.push(`Good fit for ${budget} budget`);
  }

  // Check costOfLiving instead of costLevel
  if (budgetScore < 15 && destination.costOfLiving === "high") {
    warnings.push("Destination may exceed budget");
  }

  // ================================
  // Travel Style Match (30 points max)
  // ================================
  const styleScore = calculateStyleMatchScore(destination, travelStyle);
  totalScore += styleScore;

  if (styleScore >= 25) {
    matchReasons.push(`Perfect for ${travelStyle}-style travel`);
    highlights.push(`Known for ${travelStyle} experiences`);
  } else if (styleScore >= 15) {
    matchReasons.push(`Suitable for ${travelStyle} travelers`);
  }

  // ================================
  // Duration Match (20 points max)
  // ================================
  const durationScore = calculateDurationScore(destination, duration, travelStyle);
  totalScore += durationScore;

  if (durationScore >= 15) {
    matchReasons.push(`${duration}-day trip is ideal for this destination`);
  } else if (durationScore < 10) {
    const idealDuration = DURATION_PREFERENCES[travelStyle].ideal;
    warnings.push(`Consider staying ${idealDuration}+ days for best experience`);
  }

  // ================================
  // Preference Boost (10 points max)
  // ================================
  if (preferredDestinations.includes(destination.name)) {
    totalScore += SCORING.PREFERENCE_BOOST;
    matchReasons.push("Matches your preferred destinations");
  }

  // Check country/region preference
  const prefCountries = preferredDestinations.filter((p) =>
    destination.country.toLowerCase().includes(p.toLowerCase())
  );
  if (prefCountries.length > 0) {
    totalScore += SCORING.PREFERENCE_BOOST / 2;
    matchReasons.push(`In your preferred region: ${destination.country}`);
  }

  // ================================
  // Season Match (5 points max)
  // ================================
  if (season) {
    const seasonScore = calculateSeasonScore(destination, season);
    totalScore += seasonScore;

    if (seasonScore >= 4) {
      matchReasons.push(`Best time to visit: ${destination.bestTimeToVisit}`);
    }
  }

  // ================================
  // Group Size Consideration
  // ================================
  const effectiveGroupSize = groupSize ?? 1;
  
  if (effectiveGroupSize > 3) {
    const hasFamilyActivities = destination.attractions?.some(
      (a) => a.tags?.includes("family")
    );
    if (hasFamilyActivities) {
      totalScore += 5;
      highlights.push("Great for larger groups");
    }
  }

  // ================================
  // Accessibility
  // ================================
  const effectiveAccessibility = accessibilityNeeds ?? [];
  
  if (effectiveAccessibility.length > 0) {
    const hasAccessibleOptions = destination.attractions?.some(
      (a) => a.tags?.includes("accessible")
    );
    if (!hasAccessibleOptions) {
      warnings.push("Limited accessibility information available");
    }
  }

  // ================================
  // Calculate Estimated Cost
  // ================================
  const estimatedCost = calculateEstimatedCost(destination, duration, effectiveGroupSize);

  // ================================
  // Normalize Score (0-100)
  // ================================
  const maxPossibleScore = 100;
  const normalizedScore = Math.min(Math.round(totalScore), maxPossibleScore);

  // Format best time to visit
  const bestTimeStr = destination.bestTimeToVisit.length > 0 
    ? destination.bestTimeToVisit.map(b => b.month).join(", ") 
    : "Year-round";

  return {
    recommendation: {
      destination,
      score: normalizedScore,
      matchReasons: Array.from(new Set(matchReasons)),
      estimatedCost,
      highlights: Array.from(new Set(highlights)),
      warnings: warnings.length > 0 ? warnings : undefined,
      bestTimeToVisit: bestTimeStr,
    },
    score: normalizedScore,
  };
}

// ================================
// Scoring Helpers
// ================================

function calculateBudgetScore(destination: Destination, budget: BudgetLevel): number {
  const range = BUDGET_RANGES[budget];
  
  // Estimate daily cost based on costOfLiving
  const costMultiplier: Record<CostLevel, number> = {
    low: 0.7,
    medium: 1.0,
    high: 1.5,
  };
  const destDailyCost = 100 * costMultiplier[destination.costOfLiving];

  // Perfect match
  if (destDailyCost >= range.min && destDailyCost <= range.max) {
    return SCORING.BUDGET_MATCH;
  }

  // Slightly over budget
  if (destDailyCost > range.max && destDailyCost <= range.max * 1.3) {
    return SCORING.BUDGET_MATCH * 0.7;
  }

  // Over budget
  if (destDailyCost > range.max * 1.3) {
    return SCORING.BUDGET_MATCH * 0.3;
  }

  // Way under budget (could be better value elsewhere)
  if (destDailyCost < range.min * 0.5) {
    return SCORING.BUDGET_MATCH * 0.6;
  }

  // Under budget
  return SCORING.BUDGET_MATCH * 0.85;
}

function calculateStyleMatchScore(destination: Destination, style: TravelStyle): number {
  const preferences = STYLE_PREFERENCES[style];
  
  // Check destination keywords
  const destKeywords = [
    destination.name.toLowerCase(),
    destination.country.toLowerCase(),
    ...(destination.attractions?.map((a) => a.name.toLowerCase()) || []),
  ];

  let matchCount = 0;
  for (const pref of preferences) {
    if (destKeywords.some((kw) => kw.includes(pref))) {
      matchCount++;
    }
  }

  // Score based on matches (max 3 matches count)
  const normalizedMatches = Math.min(matchCount, 3);
  const score = (normalizedMatches / 3) * SCORING.STYLE_MATCH;

  return Math.round(score);
}

function calculateDurationScore(
  destination: Destination,
  duration: number,
  style: TravelStyle
): number {
  const prefs = DURATION_PREFERENCES[style];

  // Perfect duration
  if (duration >= prefs.ideal * 0.8 && duration <= prefs.ideal * 1.2) {
    return SCORING.DURATION_MATCH;
  }

  // Acceptable duration
  if (duration >= prefs.min && duration <= prefs.max) {
    return SCORING.DURATION_MATCH * 0.7;
  }

  // Too short
  if (duration < prefs.min) {
    const ratio = duration / prefs.min;
    return SCORING.DURATION_MATCH * ratio * 0.5;
  }

  // Too long
  if (duration > prefs.max) {
    return SCORING.DURATION_MATCH * 0.6;
  }

  return 0;
}

function calculateSeasonScore(
  destination: Destination,
  season: "spring" | "summer" | "fall" | "winter"
): number {
  // Check if destination bestTimeToVisit includes the season
  const bestMonths = destination.bestTimeToVisit.map(b => b.month.toLowerCase());
  
  const seasonMonths: Record<string, string[]> = {
    spring: ["march", "april", "may"],
    summer: ["june", "july", "august"],
    fall: ["september", "october", "november"],
    winter: ["december", "january", "february"],
  };

  const hasSeason = seasonMonths[season].some(month => 
    bestMonths.some(bm => bm.includes(month))
  );

  if (hasSeason) {
    return SCORING.SEASON_MATCH;
  }

  // Check if "year-round" is in bestTimeToVisit
  if (bestMonths.some(bm => bm.includes("year") || bm.includes("any"))) {
    return SCORING.SEASON_MATCH * 0.8;
  }

  // Off-season
  return SCORING.SEASON_MATCH * 0.3;
}

function calculateEstimatedCost(
  destination: Destination,
  duration: number,
  groupSize: number
): number {
  // Estimate based on costOfLiving
  const costMultiplier: Record<CostLevel, number> = {
    low: 80,
    medium: 150,
    high: 300,
  };
  const dailyCost = costMultiplier[destination.costOfLiving];
  
  // Estimate flight cost based on region (simplified)
  const flightEstimate = destination.country ? 600 : 800;

  // Total = flights + (daily * days * groupSize)
  return Math.round(flightEstimate + dailyCost * duration * groupSize);
}

// ================================
// Additional Utilities
// ================================

export function getTopDestinations(
  recommendations: RecommendationOutput,
  limit = 5
): Destination[] {
  return recommendations.recommendations.slice(0, limit).map((r) => r.destination);
}

export function filterByRegion(
  recommendations: RecommendationOutput,
  region: string
): DestinationRecommendation[] {
  return recommendations.recommendations.filter(
    (r) => r.destination.country?.toLowerCase() === region.toLowerCase()
  );
}

export function getRecommendationsSummary(
  recommendations: RecommendationOutput
): {
  topDestination: string;
  avgScore: number;
  totalCost: number;
  styleMatch: string;
} {
  const top = recommendations.recommendations[0];
  const avgScore = Math.round(
    recommendations.recommendations.reduce((sum, r) => sum + r.score, 0) /
      recommendations.recommendations.length
  );

  return {
    topDestination: top?.destination.name || "None",
    avgScore,
    totalCost: top?.estimatedCost || 0,
    styleMatch: recommendations.searchParams.travelStyle,
  };
}

// ================================
// Quick API Function
// ================================

export async function fetchRecommendations(
  input: RecommendationInput,
  destinations: Destination[]
): Promise<RecommendationOutput> {
  // Simulate API delay (remove in production)
  await new Promise((resolve) => setTimeout(resolve, 100));

  return getDestinationRecommendations(input, destinations);
}
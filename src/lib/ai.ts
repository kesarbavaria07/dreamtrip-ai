/**
 * DreamTrip AI - AI Service Layer
 * 
 * This module provides AI-powered trip planning functionality.
 * Currently uses mock data; API integration planned for future release.
 */

import type {
  TripPlan,
  TripBudget,
  ItineraryDay,
  Activity,
  ActivityType,
  BudgetLevel,
  TravelStyle,
  TravelerCount,
  PriceRange,
  Destination,
  HotelReservation,
  ActivityDetails,
} from "@/types/travel";

// -----------------------------
// Types
// -----------------------------

export interface GenerateTripPlanInput {
  destination: string;
  budget: BudgetLevel;
  duration: number;
  travelStyle: TravelStyle;
  travelerCount: TravelerCount;
}

export interface GenerateTripPlanOutput {
  tripPlan: TripPlan;
  generationTime: number;
  suggestions: string[];
}

// -----------------------------
// Budget Mapping (Ranges)
// -----------------------------

const BUDGET_RANGES: Record<BudgetLevel, { min: number; max: number }> = {
  budget: { min: 500, max: 1500 },
  moderate: { min: 1500, max: 3000 },
  premium: { min: 3000, max: 5000 },
  luxury: { min: 5000, max: 10000 },
};

const BUDGET_CURRENCY = "USD";

// Helper function to get random budget within range
function getRandomBudgetInRange(budget: BudgetLevel): number {
  const range = BUDGET_RANGES[budget];
  return Math.round(Math.random() * (range.max - range.min) + range.min);
}

// -----------------------------
// Mock Destinations
// -----------------------------

const MOCK_DESTINATIONS: Record<string, Destination> = {
  tokyo: {
    id: "dest-tokyo-001",
    name: "Tokyo",
    country: "Japan",
    city: "Tokyo",
    description: "A vibrant metropolis blending ultramodern and traditional.",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    timezone: "JST",
    avgTemperature: { spring: 15, summer: 25, fall: 18, winter: 8 },
    bestTimeToVisit: [
      { month: "March-May", description: "Cherry blossom season", crowdLevel: "high" },
      { month: "September-November", description: "Autumn foliage", crowdLevel: "medium" },
    ],
    attractions: [
      { id: "attr-001", name: "Senso-ji Temple", description: "Ancient Buddhist temple", imageUrl: "", category: "temple", rating: 4.8, reviewCount: 45000, price: { min: 0, max: 0, currency: "USD" }, duration: "2h", tags: ["culture", "history"] },
      { id: "attr-002", name: "Shibuya Crossing", description: "World's busiest intersection", imageUrl: "", category: "landmark", rating: 4.7, reviewCount: 32000, price: { min: 0, max: 0, currency: "USD" }, duration: "1h", tags: ["sightseeing", "photo"] },
      { id: "attr-003", name: "Tokyo Skytree", description: "Tallest tower in Japan", imageUrl: "", category: "observation", rating: 4.6, reviewCount: 28000, price: { min: 15, max: 30, currency: "USD" }, duration: "2h", tags: ["views", "architecture"] },
    ],
    localCuisine: ["Sushi", "Ramen", "Tempura", "Wagyu"],
    safetyLevel: "safe",
    costOfLiving: "high",
    机场: [{ code: "NRT", name: "Narita International", distanceFromCity: "60km" }],
    language: "Japanese",
    currency: "JPY",
  },
  paris: {
    id: "dest-paris-001",
    name: "Paris",
    country: "France",
    city: "Paris",
    description: "The City of Light, known for art, fashion, and culture.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    timezone: "CET",
    avgTemperature: { spring: 12, summer: 20, fall: 14, winter: 5 },
    bestTimeToVisit: [
      { month: "April-June", description: "Pleasant weather", crowdLevel: "medium" },
      { month: "September-November", description: "Fall colors", crowdLevel: "medium" },
    ],
    attractions: [
      { id: "attr-101", name: "Eiffel Tower", description: "Iconic iron lattice tower", imageUrl: "", category: "landmark", rating: 4.7, reviewCount: 65000, price: { min: 15, max: 30, currency: "EUR" }, duration: "3h", tags: ["iconic", "views"] },
      { id: "attr-102", name: "Louvre Museum", description: "World's largest art museum", imageUrl: "", category: "museum", rating: 4.9, reviewCount: 55000, price: { min: 17, max: 25, currency: "EUR" }, duration: "4h", tags: ["art", "history"] },
      { id: "attr-103", name: "Notre-Dame Cathedral", description: "Medieval Catholic cathedral", imageUrl: "", category: "church", rating: 4.8, reviewCount: 42000, price: { min: 0, max: 0, currency: "EUR" }, duration: "2h", tags: ["architecture", "history"] },
    ],
    localCuisine: ["Croissant", "Escargot", "Coq au Vin", "Macarons"],
    safetyLevel: "safe",
    costOfLiving: "high",
    机场: [{ code: "CDG", name: "Charles de Gaulle", distanceFromCity: "25km" }],
    language: "French",
    currency: "EUR",
  },
  "new york": {
    id: "dest-nyc-001",
    name: "New York City",
    country: "United States",
    city: "New York",
    description: "The city that never sleeps, a global hub of culture and commerce.",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    timezone: "EST",
    avgTemperature: { spring: 14, summer: 26, fall: 16, winter: 2 },
    bestTimeToVisit: [
      { month: "April-June", description: "Spring weather", crowdLevel: "high" },
      { month: "September-November", description: "Fall foliage", crowdLevel: "medium" },
    ],
    attractions: [
      { id: "attr-201", name: "Statue of Liberty", description: "Iconic copper statue", imageUrl: "", category: "monument", rating: 4.8, reviewCount: 48000, price: { min: 24, max: 30, currency: "USD" }, duration: "4h", tags: ["iconic", "history"] },
      { id: "attr-202", name: "Central Park", description: "Urban oasis in Manhattan", imageUrl: "", category: "park", rating: 4.9, reviewCount: 52000, price: { min: 0, max: 0, currency: "USD" }, duration: "3h", tags: ["nature", "relaxation"] },
      { id: "attr-203", name: "Times Square", description: "Bright lights and Broadway", imageUrl: "", category: "entertainment", rating: 4.5, reviewCount: 38000, price: { min: 0, max: 0, currency: "USD" }, duration: "1h", tags: ["entertainment", "shopping"] },
    ],
    localCuisine: ["Pizza", "Hot Dogs", "Cheesecake", "Bagels"],
    safetyLevel: "moderate",
    costOfLiving: "high",
    机场: [{ code: "JFK", name: "John F. Kennedy", distanceFromCity: "20km" }],
    language: "English",
    currency: "USD",
  },
};

// -----------------------------
// Activity Templates
// -----------------------------

const ACTIVITY_TEMPLATES: Record<ActivityType, Partial<Activity>[]> = {
  sightseeing: [
    { activity: { name: "Morning City Tour", type: "sightseeing", description: "Guided walking tour of historic landmarks", location: "City Center", address: "Main Square", coordinates: { latitude: 0, longitude: 0 }, provider: "Local Tours", price: { min: 30, max: 50, currency: "USD" }, rating: 4.6, reviewCount: 1200, tags: ["guided", "culture"], tips: ["Wear comfortable shoes", "Bring water"] } },
    { activity: { name: "Museum Visit", type: "sightseeing", description: "Explore world-class art and history", location: "National Museum", address: "Museum Ave", coordinates: { latitude: 0, longitude: 0 }, provider: "State Museum", price: { min: 15, max: 25, currency: "USD" }, rating: 4.7, reviewCount: 890, tags: ["art", "history"], tips: ["Arrive early to avoid crowds"] } },
  ],
  dining: [
    { activity: { name: "Local Food Tour", type: "dining", description: "Sample authentic local cuisine", location: "Food District", address: "Market Street", coordinates: { latitude: 0, longitude: 0 }, provider: "Foodie Tours", price: { min: 50, max: 80, currency: "USD" }, rating: 4.8, reviewCount: 650, tags: ["food", "culture"], tips: ["Come hungry", "Try everything"] } },
    { activity: { name: "Fine Dining Experience", type: "dining", description: "Michelin-star restaurant dinner", location: "Fine Dining District", address: "Gourmet Lane", coordinates: { latitude: 0, longitude: 0 }, provider: "Le Bernardin", price: { min: 100, max: 200, currency: "USD" }, rating: 4.9, reviewCount: 420, tags: ["luxury", "romantic"], tips: ["Make reservations in advance"] } },
  ],
  adventure: [
    { activity: { name: "Hiking Adventure", type: "adventure", description: "Explore scenic trails and viewpoints", location: "Nature Reserve", address: "Mountain Trail", coordinates: { latitude: 0, longitude: 0 }, provider: "Adventure Co", price: { min: 40, max: 60, currency: "USD" }, rating: 4.7, reviewCount: 380, tags: ["nature", "active"], tips: ["Bring hiking boots", "Check weather"] } },
  ],
  shopping: [
    { activity: { name: "Local Market Visit", type: "shopping", description: "Browse local crafts and souvenirs", location: "Traditional Market", address: "Market Square", coordinates: { latitude: 0, longitude: 0 }, provider: "City Markets", price: { min: 0, max: 100, currency: "USD" }, rating: 4.5, reviewCount: 560, tags: ["shopping", "culture"], tips: ["Bargaining expected", "Bring cash"] } },
  ],
  nightlife: [
    { activity: { name: "Rooftop Bar Hopping", type: "nightlife", description: "Experience the city's nightlife", location: "Entertainment District", address: "Night Street", coordinates: { latitude: 0, longitude: 0 }, provider: "Night Tours", price: { min: 20, max: 50, currency: "USD" }, rating: 4.6, reviewCount: 290, tags: ["nightlife", "drinks"], tips: ["Dress smart casual", "ID required"] } },
  ],
  wellness: [
    { activity: { name: "Spa & Wellness Center", type: "wellness", description: "Relax and rejuvenate", location: "Wellness Retreat", address: "Calm Avenue", coordinates: { latitude: 0, longitude: 0 }, provider: "Zen Spa", price: { min: 60, max: 120, currency: "USD" }, rating: 4.8, reviewCount: 410, tags: ["relaxation", "spa"], tips: ["Book treatments in advance"] } },
  ],
  transport: [
    { activity: { name: "City Metro Pass", type: "transport", description: "Unlimited metro travel for the day", location: "Metro Station", address: "Central Station", coordinates: { latitude: 0, longitude: 0 }, provider: "City Transit", price: { min: 10, max: 15, currency: "USD" }, rating: 4.4, reviewCount: 780, tags: ["transport", "convenient"], tips: ["Get a day pass for savings"] } },
  ],
};

// -----------------------------
// Core Function
// -----------------------------

/**
 * Generate a complete trip plan based on user preferences
 */
export async function generateTripPlan(
  input: GenerateTripPlanInput
): Promise<GenerateTripPlanOutput> {
  const startTime = Date.now();

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const destination = getDestination(input.destination);
  const itinerary = generateItinerary(input.duration, input.travelStyle);
  const budget = calculateBudget(input.budget, input.duration);
  const activities = extractActivities(itinerary);

  const tripPlan: TripPlan = {
    id: generateId("trip"),
    travelerId: "user-demo",
    destination,
    title: `${destination.name} ${input.travelStyle.charAt(0).toUpperCase() + input.travelStyle.slice(1)} Adventure`,
    description: `A ${input.duration}-day ${input.travelStyle} trip to ${destination.name} tailored for ${input.travelerCount.total} travelers.`,
    status: "planning",
    coverImage: destination.imageUrl,
    dates: generateTripDates(input.duration),
    budget,
    itinerary,
    hotels: generateHotelRecommendations(destination, input.budget, input.duration),
    flights: [],
    activities,
    travelerCount: input.travelerCount,
    travelStyle: input.travelStyle,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [input.travelStyle, input.budget, destination.country],
    isPublic: false,
    aiGenerated: true,
  };

  const generationTime = Date.now() - startTime;
  const suggestions = generateSuggestions(input);

  return {
    tripPlan,
    generationTime,
    suggestions,
  };
}

// -----------------------------
// Helper Functions
// -----------------------------

function getDestination(location: string): Destination {
  const normalizedLocation = location.toLowerCase();
  return (
    MOCK_DESTINATIONS[normalizedLocation] || {
      id: "dest-generic-001",
      name: location,
      country: "Unknown",
      city: location,
      description: `Discover the beauty of ${location}.`,
      imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
      coordinates: { latitude: 0, longitude: 0 },
      timezone: "UTC",
      avgTemperature: { spring: 20, summer: 25, fall: 18, winter: 10 },
      bestTimeToVisit: [{ month: "Year-round", description: "Always a good time", crowdLevel: "medium" }],
      attractions: [],
      localCuisine: [],
      safetyLevel: "safe",
      costOfLiving: "medium",
      language: "English",
      currency: "USD",
    }
  );
}

function generateItinerary(
  duration: number,
  travelStyle: TravelStyle
): ItineraryDay[] {
  const itinerary: ItineraryDay[] = [];
  const activitiesPerDay = travelStyle === "relaxation" ? 2 : travelStyle === "adventure" ? 4 : 3;
  const activityTypes = getActivityTypesForStyle(travelStyle);

  for (let day = 1; day <= duration; day++) {
    const dayActivities: Activity[] = [];
    
    for (let i = 0; i < activitiesPerDay; i++) {
      const type = activityTypes[i % activityTypes.length];
      const templates = ACTIVITY_TEMPLATES[type];
      if (templates.length === 0) continue;

      const template = templates[Math.floor(Math.random() * templates.length)];
      if (!template?.activity) continue;
      
      const timeSlot = generateTimeSlot(i, activitiesPerDay);

      dayActivities.push({
        id: generateId("activity"),
        tripPlanId: "",
        day,
        time: timeSlot,
        destination: getDestination(""),
        activity: {
          type: template.activity.type,
          name: template.activity.name,
          description: `${template.activity.name} - Day ${day} activity`,
          location: template.activity.location,
          imageUrl: template.activity.imageUrl,
        } as ActivityDetails,
        transport: {
          type: i === 0 ? "walking" : "taxi",
          from: "Previous Location",
          to: template.activity?.location || "Destination",
          duration: 15,
          cost: i === 0 ? 0 : 10,
          bookingRequired: false,
        },
        booking: {
          confirmed: false,
          provider: template.activity?.provider || "Local",
          cancellationPolicy: "Free cancellation up to 24h before",
          totalCost: template.activity?.price?.min || 0,
          currency: "USD",
        },
        notes: "",
        status: "planned",
      });
    }

    itinerary.push({
      day,
      date: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
      title: `Day ${day}: ${getDayTitle(travelStyle, day)}`,
      summary: `Explore ${travelStyle} activities and local experiences on day ${day}.`,
      activities: dayActivities,
      highlights: [
        "Visit iconic landmarks",
        "Experience local culture",
        "Try authentic cuisine",
      ],
      tips: [
        "Start early to beat crowds",
        "Keep camera ready",
        "Stay hydrated",
      ],
    });
  }

  return itinerary;
}

function getActivityTypesForStyle(style: TravelStyle): ActivityType[] {
  const mapping: Record<TravelStyle, ActivityType[]> = {
    adventure: ["sightseeing", "adventure", "adventure", "dining"],
    relaxation: ["sightseeing", "wellness", "dining", "sightseeing"],
    cultural: ["sightseeing", "sightseeing", "dining", "shopping"],
    culinary: ["dining", "dining", "shopping", "sightseeing"],
    romantic: ["sightseeing", "dining", "nightlife", "wellness"],
    family: ["sightseeing", "sightseeing", "shopping", "dining"],
    luxury: ["sightseeing", "dining", "nightlife", "wellness"],
  };
  return mapping[style] || ["sightseeing", "dining", "shopping"];
}

function generateTimeSlot(index: number, total: number): { start: string; end: string; duration: number } {
  const baseHour = 8 + index * 3;
  const start = `${baseHour.toString().padStart(2, "0")}:00`;
  const end = `${(baseHour + 2).toString().padStart(2, "0")}:00`;
  return { start, end, duration: 120 };
}

function getDayTitle(style: TravelStyle, day: number): string {
  const titles: Record<TravelStyle, string[]> = {
    adventure: ["Mountain Exploration", "Local Wildlife", "Water Sports", "Trekking Adventure"],
    relaxation: ["Beach Morning", "Spa Retreat", "Yoga Session", "Quiet Walk"],
    cultural: ["Museum Tour", "Historic Walk", "Local Market", "Art District"],
    culinary: ["Cooking Class", "Food Market", "Restaurant Hop", "Wine Tasting"],
    romantic: ["Sunset View", "Candlelight Dinner", "Couple's Spa", "Scenic Drive"],
    family: ["Theme Park", "Zoo Visit", "Beach Day", "Local Fun"],
    luxury: ["Shopping Spree", "Fine Dining", "Spa Day", "Private Tour"],
  };
  const dayTitles = titles[style] || titles.adventure;
  return dayTitles[(day - 1) % dayTitles.length];
}

function calculateBudget(
  budgetLevel: BudgetLevel,
  duration: number
): TripBudget {
  // Get random budget within the range for this budget level
  const total = getRandomBudgetInRange(budgetLevel);
  const range = BUDGET_RANGES[budgetLevel];

  return {
    total,
    currency: BUDGET_CURRENCY,
    breakdown: {
      flights: Math.round(total * 0.3),
      accommodation: Math.round(total * 0.3),
      activities: Math.round(total * 0.2),
      food: Math.round(total * 0.15),
      transport: Math.round(total * 0.03),
      misc: Math.round(total * 0.02),
    },
    remaining: total,
    alerts: [
      { type: "info", category: "budget", message: `Budget range: $${range.min.toLocaleString()} - $${range.max.toLocaleString()}` },
      { type: "tip", category: "food", message: "Consider local eateries to save 20% on meals" },
      { type: "tip", category: "transport", message: "Get a day pass for public transit to save money" },
    ],
  };
}

function generateTripDates(duration: number): {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  season: "spring" | "summer" | "fall" | "winter";
} {
  const now = new Date();
  const startDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
  const month = startDate.getMonth();
  
  let season: "spring" | "summer" | "fall" | "winter";
  if (month >= 2 && month <= 4) season = "spring";
  else if (month >= 5 && month <= 7) season = "summer";
  else if (month >= 8 && month <= 10) season = "fall";
  else season = "winter";

  return { startDate, endDate, totalDays: duration, season };
}

function generateHotelRecommendations(
  destination: Destination,
  budget: BudgetLevel,
  duration: number
): HotelReservation[] {
  const priceMultiplier = budget === "luxury" ? 3 : budget === "premium" ? 2 : budget === "moderate" ? 1.5 : 1;
  const basePrice = 100 * priceMultiplier;

  return [
    {
      hotel: {
        id: "hotel-001",
        name: `${destination.name} Grand Hotel`,
        description: "Luxurious accommodations in the heart of the city",
        imageUrls: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
        address: { street: "123 Main St", city: destination.city, country: destination.country, postalCode: "10001" },
        coordinates: destination.coordinates,
        destination,
        starRating: Math.round(priceMultiplier + 2),
        userRating: 4.6,
        reviewCount: 2400,
        category: "hotel" as const,
        pricePerNight: { min: basePrice, max: basePrice * 1.5, currency: "USD" },
        amenities: [],
        roomTypes: [],
        policies: { cancellation: "Free cancellation", checkInAge: 18, petsAllowed: false, smokingAllowed: false, childPolicy: "Kids stay free" },
        contact: { phone: "+1 555-0100", email: "info@grandhotel.com", website: "https://grandhotel.com" },
        checkInTime: "15:00",
        checkOutTime: "11:00",
      },
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + (7 + duration) * 24 * 60 * 60 * 1000),
      roomType: { id: "room-001", name: "Deluxe Room", description: "Spacious room with city view", maxOccupancy: 2, bedType: "King", size: 35, pricePerNight: { min: basePrice, max: basePrice * 1.5, currency: "USD" }, amenities: [], images: [], availability: 5 },
      guests: 2,
      totalCost: basePrice * duration,
      booking: { confirmed: false, provider: "Hotel.com", cancellationPolicy: "Free cancellation up to 24h before", totalCost: basePrice * duration, currency: "USD" },
    },
  ];
}

function extractActivities(itinerary: ItineraryDay[]): Activity[] {
  return itinerary.flatMap((day) => day.activities);
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateSuggestions(input: GenerateTripPlanInput): string[] {
  const suggestions: string[] = [];

  if (input.travelStyle === "adventure") {
    suggestions.push("Consider booking adventure activities in advance - they fill up quickly!");
    suggestions.push("Pack comfortable hiking shoes and moisture-wicking clothing.");
  }

  if (input.budget === "budget") {
    suggestions.push("Look for free walking tours - great way to see the city on a budget!");
    suggestions.push("Visit local markets for affordable and authentic food options.");
  }

  if (input.travelStyle === "romantic") {
    suggestions.push("Make restaurant reservations at least a week in advance.");
    suggestions.push("Consider a sunset cruise or rooftop dining experience.");
  }

  if (input.travelerCount.adults > 2) {
    suggestions.push("For larger groups, consider renting a private villa for better value.");
    suggestions.push("Group tours often offer discounts - ask about group rates!");
  }

  suggestions.push("Download offline maps to navigate without data charges.");
  suggestions.push("Keep a digital copy of all booking confirmations handy.");

  return suggestions;
}
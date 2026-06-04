// ==========================================
// DreamTrip AI - Travel Type Definitions
// ==========================================

// -----------------------------
// Enums & Constants
// -----------------------------

export type BudgetLevel = "budget" | "moderate" | "premium" | "luxury";

export type TravelStyle =
  | "adventure"
  | "relaxation"
  | "cultural"
  | "culinary"
  | "romantic"
  | "family"
  | "luxury";

export type ActivityType =
  | "sightseeing"
  | "dining"
  | "shopping"
  | "adventure"
  | "nightlife"
  | "wellness"
  | "transport";

export type AccommodationType = "hotel" | "hostel" | "airbnb" | "resort" | "villa";

export type TripStatus = "planning" | "confirmed" | "in_progress" | "completed" | "cancelled";

// -----------------------------
// Core Types
// -----------------------------

/**
 * Represents a traveler/user profile
 */
export interface Traveler {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: TravelerPreferences;
  stats?: TravelerStats;
}

export interface TravelerPreferences {
  budget: BudgetLevel;
  travelStyle: TravelStyle;
  dietaryRestrictions: string[];
  mobilityRequirements?: string;
  interests: string[];
  language: string;
  currency: string;
  notificationPreferences: NotificationPreferences;
}

export interface TravelerStats {
  totalTrips: number;
  countriesVisited: number;
  citiesVisited: number;
  totalDaysTraveled: number;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

/**
 * Represents a travel destination
 */
export interface Destination {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  imageUrl: string;
  coordinates: GeoCoordinates;
  timezone: string;
  avgTemperature: SeasonalTemperature;
  bestTimeToVisit: BestTimeToVisit[];
  attractions: Attraction[];
  localCuisine: string[];
  safetyLevel: SafetyLevel;
  costOfLiving: CostLevel;
 机场?: Airport[];
  visaRequirements?: string;
  language: string;
  currency: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface SeasonalTemperature {
  spring: number;
  summer: number;
  fall: number;
  winter: number;
}

export interface BestTimeToVisit {
  month: string;
  description: string;
  crowdLevel: "low" | "medium" | "high";
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: PriceRange;
  duration: string;
  tags: string[];
}

export interface Airport {
  code: string;
  name: string;
  distanceFromCity: string;
}

export type SafetyLevel = "safe" | "moderate" | "caution";
export type CostLevel = "low" | "medium" | "high";

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

/**
 * Represents an activity in an itinerary
 */
export interface Activity {
  id: string;
  tripPlanId: string;
  day: number;
  time: TimeSlot;
  destination: Destination;
  activity: ActivityDetails;
  transport: TransportInfo;
  booking: BookingDetails;
  notes: string;
  status: ActivityStatus;
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string;
  duration: number; // minutes
}

export interface ActivityDetails {
  type: ActivityType;
  name: string;
  description: string;
  imageUrl?: string;
  location: string;
  address: string;
  coordinates: GeoCoordinates;
  provider: string;
  price: PriceRange;
  rating: number;
  reviewCount: number;
  tags: string[];
  tips: string[];
}

export interface TransportInfo {
  type: TransportType;
  from: string;
  to: string;
  duration: number; // minutes
  cost: number;
  bookingRequired: boolean;
  bookingUrl?: string;
  notes?: string;
}

export type TransportType =
  | "flight"
  | "train"
  | "bus"
  | "car"
  | "taxi"
  | "walking"
  | "ferry"
  | "other";

export interface BookingDetails {
  confirmed: boolean;
  confirmationNumber?: string;
  provider: string;
  bookingUrl?: string;
  cancellationPolicy: string;
  totalCost: number;
  currency: string;
}

export type ActivityStatus = "planned" | "booked" | "completed" | "cancelled";

/**
 * Represents a hotel/accommodation
 */
export interface Hotel {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  address: Address;
  coordinates: GeoCoordinates;
  destination: Destination;
  starRating: number;
  userRating: number;
  reviewCount: number;
  category: AccommodationType;
  pricePerNight: PriceRange;
  amenities: Amenity[];
  roomTypes: RoomType[];
  policies: HotelPolicies;
  contact: HotelContact;
  checkInTime: string;
  checkOutTime: string;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: "basic" | "dining" | "wellness" | "business" | "entertainment";
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  maxOccupancy: number;
  bedType: string;
  size: number; // square meters
  pricePerNight: PriceRange;
  amenities: string[];
  images: string[];
  availability: number;
}

export interface HotelPolicies {
  cancellation: string;
  checkInAge: number;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  childPolicy: string;
}

export interface HotelContact {
  phone: string;
  email: string;
  website: string;
}

/**
 * Represents a complete trip plan
 */
export interface TripPlan {
  id: string;
  travelerId: string;
  destination: Destination;
  title: string;
  description: string;
  status: TripStatus;
  coverImage?: string;
  dates: TripDates;
  budget: TripBudget;
  itinerary: ItineraryDay[];
  hotels: HotelReservation[];
  flights: FlightBooking[];
  activities: Activity[];
  travelerCount: TravelerCount;
  travelStyle: TravelStyle;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isPublic: boolean;
  aiGenerated: boolean;
}

export interface TripDates {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  season: "spring" | "summer" | "fall" | "winter";
}

export interface TravelerCount {
  adults: number;
  children: number;
  infants: number;
  total: number;
}

export interface TripBudget {
  total: number;
  currency: string;
  breakdown: BudgetBreakdown;
  remaining: number;
  alerts: BudgetAlert[];
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  activities: number;
  food: number;
  transport: number;
  misc: number;
}

export interface BudgetAlert {
  type: "warning" | "exceeded" | "tip";
  category: string;
  message: string;
  amount?: number;
}

export interface ItineraryDay {
  day: number;
  date: Date;
  title: string;
  summary: string;
  activities: Activity[];
  highlights: string[];
  tips: string[];
  weather?: WeatherForecast;
}

export interface WeatherForecast {
  temp: number;
  condition: string;
  humidity: number;
  precipitation: number;
}

export interface HotelReservation {
  hotel: Hotel;
  checkIn: Date;
  checkOut: Date;
  roomType: RoomType;
  guests: number;
  totalCost: number;
  booking: BookingDetails;
}

export interface FlightBooking {
  id: string;
  airline: string;
  flightNumber: string;
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  duration: number;
  price: PriceRange;
  booking: BookingDetails;
}

export interface FlightEndpoint {
  airport: string;
  city: string;
  dateTime: Date;
  terminal?: string;
  gate?: string;
}

// -----------------------------
// AI-Related Types
// -----------------------------

export interface ItineraryGenerationRequest {
  destination: string;
  budget: BudgetLevel;
  duration: number;
  travelStyle: TravelStyle;
  travelerCount: TravelerCount;
  preferences: TravelerPreferences;
  mustInclude?: string[];
  mustExclude?: string[];
}

export interface ItineraryGenerationResponse {
  itinerary: ItineraryDay[];
  hotels: Hotel[];
  activities: Activity[];
  estimatedBudget: TripBudget;
  recommendations: Recommendation[];
}

export interface Recommendation {
  type: "activity" | "restaurant" | "hotel" | "transport";
  item: Activity | Hotel | string;
  reason: string;
}

// -----------------------------
// Utility Types
// -----------------------------

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
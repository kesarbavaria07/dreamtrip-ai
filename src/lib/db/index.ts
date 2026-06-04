/**
 * Database Module - Barrel Export
 * 
 * Export all database services and client utilities.
 */

export {
  getSupabaseClient,
  getSupabaseAdmin,
  checkSupabaseConnection,
} from "./supabase-client";

export type {
  TripPlanInsert,
  UserPreferencesInsert,
} from "./supabase-client";

// Trip Plan Service
export {
  createTripPlan,
  getTripPlanById,
  getTripPlans,
  getPublicTripPlans,
  getTripPlanCount,
  updateTripPlan,
  updateTripPlanStatus,
  deleteTripPlan,
  duplicateTripPlan,
  deleteMultipleTripPlans,
} from "./trip-plan.service";

export type {
  TripPlanFilter,
  TripPlanUpdate,
} from "./trip-plan.service";

// User Preferences Service
export {
  createUserPreferences,
  initializePreferences,
  getUserPreferences,
  getUserPreferencesWithDefaults,
  updateUserPreferences,
  updateTravelPreferences,
  updateNotificationPreferences,
  addPreferredDestination,
  removePreferredDestination,
  addDietaryRestriction,
  deleteUserPreferences,
  resetPreferencesToDefaults,
} from "./preferences.service";

export type {
  PreferencesUpdate,
  UserPreferencesResponse,
} from "./preferences.service";

// ================================
// Quick Usage Examples
// ================================

/**
 * // Get user's trip plans
 * import { getTripPlans } from "@/lib/db";
 * 
 * const { tripPlans, total } = await getTripPlans({ userId: "user-123" });
 * 
 * // Create a new trip
 * import { createTripPlan } from "@/lib/db";
 * 
 * const newTrip = await createTripPlan({
 *   user_id: "user-123",
 *   title: "Paris Adventure",
 *   destination_name: "Paris",
 *   start_date: "2024-06-15",
 *   end_date: "2024-06-20",
 *   total_days: 5,
 *   total_budget: 3000,
 *   travel_style: "romantic",
 * });
 * 
 * // Update preferences
 * import { updateUserPreferences } from "@/lib/db";
 * 
 * await updateUserPreferences("user-123", {
 *   defaultBudget: "premium",
 *   defaultTravelStyle: "luxury",
 *   preferredDestinations: ["Paris", "Tokyo", "Bali"],
 * });
 */
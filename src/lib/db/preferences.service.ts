/**
 * User Preferences Service
 * 
 * Service layer for User Preferences CRUD operations.
 * Handles all database interactions for user settings.
 */

import { getSupabaseAdmin, type UserPreferencesRow, type UserPreferencesInsert } from "./supabase-client";

// ================================
// Types
// ================================

export interface PreferencesUpdate {
  defaultBudget?: string;
  defaultTravelStyle?: string;
  preferredDestinations?: string[];
  dietaryRestrictions?: string[];
  mobilityRequirements?: string;
  language?: string;
  currency?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  aiPersonalization?: boolean;
  travelHistoryEnabled?: boolean;
}

export type { UserPreferencesRow as UserPreferencesResponse };

// ================================
// Create / Initialize
// ================================

export async function createUserPreferences(userId: string, data?: Partial<UserPreferencesInsert>) {
  const supabase = getSupabaseAdmin();

  const { data: preferences, error } = await supabase
    .from("user_preferences")
    .insert({
      user_id: userId,
      default_budget: data?.default_budget || "moderate",
      default_travel_style: data?.default_travel_style || "cultural",
      preferred_destinations: data?.preferred_destinations || [],
      dietary_restrictions: data?.dietary_restrictions || [],
      language: data?.language || "en",
      currency: data?.currency || "USD",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create preferences: ${error.message}`);
  return preferences as UserPreferencesRow;
}

export async function initializePreferences(userId: string) {
  // Check if preferences already exist
  const existing = await getUserPreferences(userId);
  if (existing) return existing;

  // Create default preferences
  return createUserPreferences(userId);
}

// ================================
// Read
// ================================

export async function getUserPreferences(userId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(`Failed to get preferences: ${error.message}`);
  }
  return data as UserPreferencesRow;
}

export async function getUserPreferencesWithDefaults(userId: string) {
  const preferences = await getUserPreferences(userId);
  
  // Return with defaults if not found
  return preferences || {
    id: "",
    user_id: userId,
    default_budget: "moderate",
    default_travel_style: "cultural",
    preferred_destinations: [],
    dietary_restrictions: [],
    mobility_requirements: null,
    language: "en",
    currency: "USD",
    timezone: "UTC",
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    ai_personalization: true,
    travel_history_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ================================
// Update
// ================================

export async function updateUserPreferences(userId: string, updates: PreferencesUpdate) {
  const supabase = getSupabaseAdmin();

  // Build update object
  const updateData: Record<string, unknown> = {};

  if (updates.defaultBudget !== undefined) updateData.default_budget = updates.defaultBudget;
  if (updates.defaultTravelStyle !== undefined) updateData.default_travel_style = updates.defaultTravelStyle;
  if (updates.preferredDestinations !== undefined) updateData.preferred_destinations = updates.preferredDestinations;
  if (updates.dietaryRestrictions !== undefined) updateData.dietary_restrictions = updates.dietaryRestrictions;
  if (updates.mobilityRequirements !== undefined) updateData.mobility_requirements = updates.mobilityRequirements;
  if (updates.language !== undefined) updateData.language = updates.language;
  if (updates.currency !== undefined) updateData.currency = updates.currency;
  if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
  if (updates.emailNotifications !== undefined) updateData.email_notifications = updates.emailNotifications;
  if (updates.pushNotifications !== undefined) updateData.push_notifications = updates.pushNotifications;
  if (updates.smsNotifications !== undefined) updateData.sms_notifications = updates.smsNotifications;
  if (updates.aiPersonalization !== undefined) updateData.ai_personalization = updates.aiPersonalization;
  if (updates.travelHistoryEnabled !== undefined) updateData.travel_history_enabled = updates.travelHistoryEnabled;

  const { data, error } = await supabase
    .from("user_preferences")
    .update(updateData)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update preferences: ${error.message}`);
  return data as UserPreferencesRow;
}

// ================================
// Convenience Methods
// ================================

export async function updateTravelPreferences(
  userId: string,
  budget: string,
  travelStyle: string,
  preferredDestinations?: string[]
) {
  return updateUserPreferences(userId, {
    defaultBudget: budget,
    defaultTravelStyle: travelStyle,
    preferredDestinations,
  });
}

export async function updateNotificationPreferences(
  userId: string,
  email: boolean,
  push: boolean,
  sms: boolean
) {
  return updateUserPreferences(userId, {
    emailNotifications: email,
    pushNotifications: push,
    smsNotifications: sms,
  });
}

export async function addPreferredDestination(userId: string, destination: string) {
  const current = await getUserPreferences(userId);
  if (!current) return null;

  const destinations = [...(current.preferred_destinations || []), destination];
  // Remove duplicates
  const unique = [...new Set(destinations)];

  return updateUserPreferences(userId, {
    preferredDestinations: unique,
  });
}

export async function removePreferredDestination(userId: string, destination: string) {
  const current = await getUserPreferences(userId);
  if (!current) return null;

  const destinations = (current.preferred_destinations || []).filter(d => d !== destination);

  return updateUserPreferences(userId, {
    preferredDestinations: destinations,
  });
}

export async function addDietaryRestriction(userId: string, restriction: string) {
  const current = await getUserPreferences(userId);
  if (!current) return null;

  const restrictions = [...(current.dietary_restrictions || []), restriction];
  const unique = [...new Set(restrictions)];

  return updateUserPreferences(userId, {
    dietaryRestrictions: unique,
  });
}

// ================================
// Delete
// ================================

export async function deleteUserPreferences(userId: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("user_preferences")
    .delete()
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete preferences: ${error.message}`);
  return true;
}

// ================================
// Reset to Defaults
// ================================

export async function resetPreferencesToDefaults(userId: string) {
  return updateUserPreferences(userId, {
    defaultBudget: "moderate",
    defaultTravelStyle: "cultural",
    preferredDestinations: [],
    dietaryRestrictions: [],
    mobilityRequirements: undefined,
    language: "en",
    currency: "USD",
    timezone: "UTC",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    aiPersonalization: true,
    travelHistoryEnabled: true,
  });
}

// ================================
// Export for convenience
// ================================

export type { PreferencesUpdate as UserPreferencesUpdate };
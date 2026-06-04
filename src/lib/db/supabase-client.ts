/**
 * Supabase Client Configuration
 * 
 * Setup for connecting to Supabase PostgreSQL database.
 * Uses @supabase/supabase-js for client operations.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// ================================
// Singleton Clients
// ================================

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

// Browser Client (uses anon key)
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase URL or ANON_KEY not configured");
      return null;
    }
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
}

// Server Client (uses service role key for admin operations)
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    const key = supabaseServiceKey || supabaseAnonKey;
    if (!supabaseUrl || !key) {
      throw new Error("Supabase URL or service key not configured");
    }
    supabaseAdminClient = createClient(supabaseUrl, key, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseAdminClient;
}

// ================================
// Utility: Check Connection
// ================================

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) return false;
    
    const { error } = await client.from("trip_plans").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

// ================================
// Database Types
// ================================

export interface TripPlanRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  cover_image: string | null;
  destination_name: string;
  destination_country: string | null;
  destination_city: string | null;
  start_date: string;
  end_date: string;
  total_days: number;
  total_budget: number;
  currency: string;
  itinerary: unknown | null;
  hotels: unknown | null;
  flights: unknown | null;
  activities: unknown | null;
  budget_breakdown: unknown | null;
  travel_style: string;
  traveler_count: unknown | null;
  ai_generated: boolean;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesRow {
  id: string;
  user_id: string;
  default_budget: string;
  default_travel_style: string;
  preferred_destinations: string[];
  dietary_restrictions: string[];
  mobility_requirements: string | null;
  language: string;
  currency: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  ai_personalization: boolean;
  travel_history_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TravelStoryRow {
  id: string;
  user_id: string;
  trip_plan_id: string | null;
  title: string;
  content: string;
  cover_image: string | null;
  location: string | null;
  travel_date: string | null;
  tags: string[];
  is_draft: boolean;
  is_published: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

// ================================
// Insert Types
// ================================

export interface TripPlanInsert {
  user_id: string;
  title: string;
  destination_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_budget?: number;
  status?: string;
  travel_style?: string;
  itinerary?: unknown;
  tags?: string[];
}

export interface UserPreferencesInsert {
  user_id: string;
  default_budget?: string;
  default_travel_style?: string;
  preferred_destinations?: string[];
  dietary_restrictions?: string[];
  language?: string;
  currency?: string;
}

export interface TravelStoryInsert {
  user_id: string;
  trip_plan_id?: string;
  title: string;
  content: string;
  location?: string;
  travel_date?: string;
  tags?: string[];
}

// Re-export enums
export type BudgetLevel = "budget" | "moderate" | "premium" | "luxury";
export type TravelStyle = "adventure" | "relaxation" | "cultural" | "culinary" | "romantic" | "family" | "luxury";
export type TripStatus = "planning" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type ActivityType = "sightseeing" | "dining" | "adventure" | "shopping" | "wellness" | "nightlife" | "transport" | "museum" | "nature" | "other";
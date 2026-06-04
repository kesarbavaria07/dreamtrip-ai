/**
 * Trip Plan Service
 * 
 * Service layer for Trip Plan CRUD operations.
 * Handles all database interactions for trip plans.
 */

import { getSupabaseAdmin, type TripPlanRow, type TripPlanInsert } from "./supabase-client";

// ================================
// Types
// ================================

export interface TripPlanFilter {
  userId?: string;
  status?: string;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface TripPlanUpdate {
  title?: string;
  description?: string;
  status?: string;
  coverImage?: string;
  itinerary?: unknown;
  hotels?: unknown[];
  flights?: unknown[];
  activities?: unknown[];
  budgetBreakdown?: unknown;
  tags?: string[];
  isPublic?: boolean;
}

export type { TripPlanRow };

// ================================
// Create
// ================================

export async function createTripPlan(data: TripPlanInsert) {
  const supabase = getSupabaseAdmin();

  const { data: tripPlan, error } = await supabase
    .from("trip_plans")
    .insert({
      user_id: data.user_id,
      title: data.title,
      destination_name: data.destination_name,
      start_date: data.start_date,
      end_date: data.end_date,
      total_days: data.total_days,
      total_budget: data.total_budget || 0,
      status: data.status || "planning",
      travel_style: data.travel_style,
      itinerary: data.itinerary,
      tags: data.tags || [],
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create trip plan: ${error.message}`);
  return tripPlan as TripPlanRow;
}

// ================================
// Read
// ================================

export async function getTripPlanById(id: string, userId?: string) {
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("trip_plans")
    .select("*")
    .eq("id", id);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to get trip plan: ${error.message}`);
  }
  return data as TripPlanRow;
}

export async function getTripPlans(filters: TripPlanFilter = {}) {
  const supabase = getSupabaseAdmin();

  let query = supabase.from("trip_plans").select("*", { count: "exact" });

  if (filters.userId) {
    query = query.eq("user_id", filters.userId);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.destination) {
    query = query.ilike("destination_name", `%${filters.destination}%`);
  }
  if (filters.startDate) {
    query = query.gte("start_date", filters.startDate.toISOString());
  }
  if (filters.endDate) {
    query = query.lte("end_date", filters.endDate.toISOString());
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to get trip plans: ${error.message}`);
  return { tripPlans: (data as TripPlanRow[]) || [], total: count || 0 };
}

export async function getPublicTripPlans(limit = 20, offset = 0) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("trip_plans")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`Failed to get public trip plans: ${error.message}`);
  return (data as TripPlanRow[]) || [];
}

export async function getTripPlanCount(userId: string) {
  const supabase = getSupabaseAdmin();

  const { count, error } = await supabase
    .from("trip_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to get trip count: ${error.message}`);
  return count || 0;
}

// ================================
// Update
// ================================

export async function updateTripPlan(id: string, userId: string, updates: TripPlanUpdate) {
  const supabase = getSupabaseAdmin();

  const updateData: Record<string, unknown> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
  if (updates.itinerary !== undefined) updateData.itinerary = updates.itinerary;
  if (updates.hotels !== undefined) updateData.hotels = updates.hotels;
  if (updates.flights !== undefined) updateData.flights = updates.flights;
  if (updates.activities !== undefined) updateData.activities = updates.activities;
  if (updates.budgetBreakdown !== undefined) updateData.budget_breakdown = updates.budgetBreakdown;
  if (updates.tags !== undefined) updateData.tags = updates.tags;
  if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

  const { data, error } = await supabase
    .from("trip_plans")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update trip plan: ${error.message}`);
  return data as TripPlanRow;
}

export async function updateTripPlanStatus(id: string, userId: string, status: string) {
  return updateTripPlan(id, userId, { status });
}

// ================================
// Delete
// ================================

export async function deleteTripPlan(id: string, userId: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("trip_plans")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete trip plan: ${error.message}`);
  return true;
}

// ================================
// Duplicate
// ================================

export async function duplicateTripPlan(id: string, userId: string) {
  const original = await getTripPlanById(id, userId);
  if (!original) throw new Error("Trip plan not found");

  return createTripPlan({
    user_id: userId,
    title: `${original.title} (Copy)`,
    destination_name: original.destination_name,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + (original.total_days || 1) * 24 * 60 * 60 * 1000).toISOString(),
    total_days: original.total_days,
    total_budget: original.total_budget,
    status: "planning",
    travel_style: original.travel_style,
    itinerary: original.itinerary,
    tags: original.tags,
  });
}

// ================================
// Batch Operations
// ================================

export async function deleteMultipleTripPlans(ids: string[], userId: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("trip_plans")
    .delete()
    .in("id", ids)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete trip plans: ${error.message}`);
  return true;
}
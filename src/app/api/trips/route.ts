/**
 * Trip Generation API Route
 * 
 * POST /api/trips - Generate a new trip plan
 */

import { NextRequest, NextResponse } from "next/server";
import { generateTripPlan, type GenerateTripPlanInput } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("[API] Received trip generation request:", {
      destination: body.destination,
      budget: body.budget,
      duration: body.duration,
      travelStyle: body.travelStyle,
    });

    // Validate required fields
    const requiredFields = ['destination', 'budget', 'duration', 'travelStyle'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Build the input for AI service
    const input: GenerateTripPlanInput = {
      destination: body.destination,
      budget: body.budget,
      duration: body.duration,
      travelStyle: body.travelStyle,
      travelerCount: body.travelerCount || { adults: 1, children: 0 },
    };

    console.log("[API] Calling AI service with input:", input);

    // Generate the trip plan using AI service
    const result = await generateTripPlan(input);

    console.log("[API] Trip generation complete:", {
      tripId: result.tripPlan.id,
      title: result.tripPlan.title,
      generationTime: result.generationTime,
      days: result.tripPlan.itinerary.length,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("[API] Error generating trip:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate trip plan",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch a specific trip
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get('id');

  if (!tripId) {
    return NextResponse.json(
      { error: "Trip ID is required" },
      { status: 400 }
    );
  }

  // For now, return a mock trip - in production, fetch from database
  return NextResponse.json({
    success: true,
    data: null,
    message: "Trip retrieval not implemented yet"
  });
}

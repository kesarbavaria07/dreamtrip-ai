"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TripPlannerForm, { type TripPlannerFormData } from "@/components/ui/trip-planner-form";
import TravelPoster from "@/components/stories/travel-poster";
import Navbar from "@/components/home/navbar";

type TripPlan = {
  id: string;
  title: string;
  destination: string;
  itinerary: Array<{
    day: number;
    date: string;
    title: string;
    activities: Array<{
      id: string;
      time: string;
      title: string;
      description: string;
      location: string;
      cost: number;
      duration: string;
    }>;
  }>;
  budget: {
    total: number;
    breakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  };
};

type LoadingState = {
  isLoading: boolean;
  step: string;
};

export default function PlannerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "poster">("itinerary");
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, step: "" });
  const [error, setError] = useState<string | null>(null);

  // Protect route - redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in?callbackUrl=/planner");
    }
  }, [status, router]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  const handleFormSubmit = async (data: TripPlannerFormData) => {
    console.log("[Planner] Form submitted:", data);
    setError(null);
    setLoading({ isLoading: true, step: "Validating..." });

    try {
      // Step 1: Sending request
      setLoading({ isLoading: true, step: "Sending request to AI..." });
      console.log("[Planner] Making API call to /api/trips...");

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("[Planner] Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate trip");
      }

      const result = await response.json();
      console.log("[Planner] API Response:", result);

      if (!result.success) {
        throw new Error(result.error || "Failed to generate trip");
      }

      // Step 2: Processing AI response
      setLoading({ isLoading: true, step: "Creating your itinerary..." });
      console.log("[Planner] Processing trip plan...");

      // Transform the AI response to our TripPlan format
      const { tripPlan: aiTripPlan, generationTime } = result.data;
      console.log("[Planner] Generation time:", generationTime, "ms");

      // Create a display-friendly trip plan
      const tripStyle = data.travelStyle.charAt(0).toUpperCase() + data.travelStyle.slice(1);
      const displayTripPlan: TripPlan = {
        id: aiTripPlan.id,
        title: data.duration + "-Day " + tripStyle + " Adventure in " + data.destination,
        destination: data.destination,
        itinerary: aiTripPlan.itinerary.map((day: any) => ({
          day: day.day,
          date: day.date,
          title: day.title,
          activities: day.activities.map((activity: any) => ({
            id: activity.id,
            time: activity.time?.start || "09:00",
            title: activity.activity?.name || "Activity",
            description: activity.activity?.description || "",
            location: activity.activity?.location || "",
            cost: activity.booking?.totalCost || activity.transport?.cost || activity.activity?.price?.min || 0,
            duration: "2 hours",
          })),
        })),
        budget: {
          total: aiTripPlan.budget?.total || 0,
          breakdown: aiTripPlan.budget?.breakdown || [],
        },
      };

      console.log("[Planner] Display trip plan created:", {
        id: displayTripPlan.id,
        title: displayTripPlan.title,
        days: displayTripPlan.itinerary.length,
      });

      // Step 3: Complete
      setLoading({ isLoading: false, step: "" });
      setTripPlan(displayTripPlan);
      setActiveTab("itinerary");

      console.log("[Planner] Trip plan set successfully!");

    } catch (err) {
      console.error("[Planner] Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading({ isLoading: false, step: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Plan Your Dream Trip
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Tell us about your ideal trip and our AI will create a personalized itinerary just for you.
          </p>
        </div>

        {/* Loading State */}
        {loading.isLoading && (
          <div className="max-w-md mx-auto mb-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white/80">{loading.step}</p>
            <p className="text-white/40 text-sm mt-2">This may take a few seconds...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-6 bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/30 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column: Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Trip Details</h2>
            <TripPlannerForm onSubmit={handleFormSubmit} />
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {tripPlan ? (
              <>
                {/* Trip Header */}
                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{tripPlan.title}</h2>
                  <p className="text-white/60">{tripPlan.destination}</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 bg-white/5 backdrop-blur-xl rounded-xl p-2">
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === "itinerary"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Itinerary
                  </button>
                  <button
                    onClick={() => setActiveTab("budget")}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === "budget"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Budget
                  </button>
                  <button
                    onClick={() => setActiveTab("poster")}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === "poster"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Poster
                  </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  {activeTab === "itinerary" && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Your Itinerary</h3>
                      {tripPlan.itinerary.length > 0 ? (
                        <div className="space-y-6">
                          {tripPlan.itinerary.map((day) => (
                            <div key={day.day} className="bg-white/5 rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {day.day}
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">{day.title}</h4>
                                  <p className="text-white/50 text-sm">{day.date}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {day.activities.map((activity, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                    <div className="w-16 text-indigo-400 text-sm font-medium">{activity.time}</div>
                                    <div className="flex-1">
                                      <p className="text-white font-medium">{activity.title}</p>
                                      <p className="text-white/50 text-sm">{activity.description}</p>
                                      <p className="text-white/30 text-xs mt-1">{activity.location}</p>
                                    </div>
                                    <div className="text-pink-400 font-medium">${activity.cost}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/60 text-center py-8">No itinerary generated yet.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "budget" && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Budget Breakdown</h3>
                      <div className="space-y-4">
                        {[
                          { category: "Accommodation", amount: Math.round(tripPlan.budget.total * 0.4), percentage: 40 },
                          { category: "Food & Dining", amount: Math.round(tripPlan.budget.total * 0.25), percentage: 25 },
                          { category: "Activities", amount: Math.round(tripPlan.budget.total * 0.2), percentage: 20 },
                          { category: "Transport", amount: Math.round(tripPlan.budget.total * 0.1), percentage: 10 },
                          { category: "Miscellaneous", amount: Math.round(tripPlan.budget.total * 0.05), percentage: 5 },
                        ].map((item) => (
                          <div key={item.category} className="space-y-2">
                            <div className="flex justify-between text-white">
                              <span>{item.category}</span>
                              <span className="text-pink-400 font-medium">${item.amount}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                style={{ width: item.percentage + "%" }}
                              />
                            </div>
                            <p className="text-white/40 text-sm">{item.percentage}% of total</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-lg">
                          <span className="text-white/80">Total Budget</span>
                          <span className="text-white font-bold">${tripPlan.budget.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "poster" && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Travel Poster</h3>
                      <TravelPoster 
                        destination={tripPlan.destination}
                        tagline="An unforgettable adventure awaits"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Your Trip Awaits</h3>
                <p className="text-white/60">
                  Fill out the form and click &quot;Generate My Trip&quot; to create your personalized itinerary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

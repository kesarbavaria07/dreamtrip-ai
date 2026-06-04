"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation Schema
const tripPlannerSchema = z.object({
  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters")
    .max(100, "Destination must be less than 100 characters"),
  budget: z.enum(["budget", "moderate", "premium", "luxury"], {
    required_error: "Please select a budget",
  }),
  duration: z
    .number()
    .min(1, "Trip must be at least 1 day")
    .max(90, "Trip must be less than 90 days"),
  travelStyle: z.enum(
    ["adventure", "relaxation", "cultural", "culinary", "romantic", "family", "luxury", "budget"],
    {
      required_error: "Please select a travel style",
    }
  ),
});

type TripPlannerFormData = z.infer<typeof tripPlannerSchema>;

// Form Options
const budgetOptions = [
  { value: "budget", label: "Budget", description: "$500 - $1,500" },
  { value: "moderate", label: "Moderate", description: "$1,500 - $3,000" },
  { value: "premium", label: "Premium", description: "$3,000 - $5,000" },
  { value: "luxury", label: "Luxury", description: "$5,000+" },
];

const travelStyleOptions = [
  { value: "adventure", label: "Adventure & Exploration", icon: "🧗" },
  { value: "relaxation", label: "Relaxation & Wellness", icon: "🧘" },
  { value: "cultural", label: "Cultural & Historical", icon: "🏛️" },
  { value: "culinary", label: "Culinary & Food", icon: "🍽️" },
  { value: "romantic", label: "Romantic Getaway", icon: "💕" },
  { value: "family", label: "Family Friendly", icon: "👨‍👩‍👧" },
  { value: "luxury", label: "Luxury Travel", icon: "✨" },
  { value: "budget", label: "Budget Friendly", icon: "💰" },
];

interface TripPlannerFormProps {
  onSubmit?: (data: TripPlannerFormData) => void;
  defaultValues?: Partial<TripPlannerFormData>;
  className?: string;
}

export default function TripPlannerForm({
  onSubmit,
  defaultValues,
  className = "",
}: TripPlannerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<TripPlannerFormData>({
    resolver: zodResolver(tripPlannerSchema),
    mode: "onChange",
    defaultValues: {
      destination: defaultValues?.destination || "",
      budget: defaultValues?.budget || undefined,
      duration: defaultValues?.duration || 7,
      travelStyle: defaultValues?.travelStyle || undefined,
    },
  });

  const watchedValues = watch();

  const handleFormSubmit: SubmitHandler<TripPlannerFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit?.(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const durationValue = watch("duration");

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-8 ${className}`}
    >
      {/* Destination Field */}
      <div className="space-y-2">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-white/80"
        >
          Destination
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-white/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <input
            id="destination"
            type="text"
            placeholder="Where do you want to go?"
            {...register("destination")}
            className={`
              w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white 
              placeholder:text-white/30 transition-all appearance-none
              focus:outline-none focus:bg-white/10
              ${errors.destination
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/10 focus:border-indigo-500/50"
              }
            `}
          />
        </div>
        {errors.destination && (
          <p className="text-red-400 text-sm">{errors.destination.message}</p>
        )}
      </div>

      {/* Budget Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white/80">
          Budget Range
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("budget", option.value as TripPlannerFormData["budget"], { shouldValidate: true })}
              className={`
                p-4 rounded-xl border text-left transition-all
                ${watchedValues.budget === option.value
                  ? "bg-indigo-500/20 border-indigo-500/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
                }
              `}
            >
              <span className="block text-white font-medium">{option.label}</span>
              <span className="block text-white/40 text-sm">{option.description}</span>
            </button>
          ))}
        </div>
        <input type="hidden" {...register("budget")} />
        {errors.budget && (
          <p className="text-red-400 text-sm">{errors.budget.message}</p>
        )}
      </div>

      {/* Duration Field */}
      <div className="space-y-3">
        <label htmlFor="duration" className="block text-sm font-medium text-white/80">
          Trip Duration (Days)
        </label>
        <div className="flex items-center gap-4">
          <input
            id="duration"
            type="range"
            min="1"
            max="30"
            step="1"
            {...register("duration", { valueAsNumber: true })}
            className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex items-center justify-center w-20 h-12 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-white font-medium">{durationValue} days</span>
          </div>
        </div>
        <input type="hidden" {...register("duration", { valueAsNumber: true })} />
        {errors.duration && (
          <p className="text-red-400 text-sm">{errors.duration.message}</p>
        )}
      </div>

      {/* Travel Style Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white/80">
          Travel Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {travelStyleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("travelStyle", option.value as TripPlannerFormData["travelStyle"], { shouldValidate: true })}
              className={`
                p-4 rounded-xl border text-center transition-all
                ${watchedValues.travelStyle === option.value
                  ? "bg-indigo-500/20 border-indigo-500/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
                }
              `}
            >
              <span className="block text-2xl mb-1">{option.icon}</span>
              <span className="text-white text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
        <input type="hidden" {...register("travelStyle")} />
        {errors.travelStyle && (
          <p className="text-red-400 text-sm">{errors.travelStyle.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2
          ${isValid && !isSubmitting
            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
            : "bg-white/10 text-white/30 cursor-not-allowed"
          }
        `}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Generate My Trip
          </>
        )}
      </button>

      {/* Form Summary (Debug - remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-4 bg-white/5 rounded-xl text-xs">
          <p className="text-white/40 mb-2">Form Values:</p>
          <pre className="text-white/60 overflow-x-auto">
            {JSON.stringify(watchedValues, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}

// Export types for external use
export type { TripPlannerFormData };
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DreamTrip AI - AI-Powered Travel Planning",
  description: "Transform your travel dreams into detailed itineraries with AI. Personalized adventures await.",
  keywords: ["travel", "AI", "trip planner", "itinerary", "vacation", "planning"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
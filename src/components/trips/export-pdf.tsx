"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import type { TripPlan } from "@/types/travel";

// -----------------------------
// Props
// -----------------------------

export interface ExportPDFProps {
  tripPlan: TripPlan;
  className?: string;
}

// -----------------------------
// PDF Generator
// -----------------------------

function generatePDF(tripPlan: TripPlan): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Colors
  const primaryColor = [99, 102, 241]; // Indigo
  const textColor = [30, 30, 30];
  const mutedColor = [100, 100, 100];

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; fontStyle?: string; color?: number[] }) => {
    const fontSize = options?.fontSize || 12;
    const fontStyle = options?.fontStyle || "normal";
    const color = options?.color || textColor;
    
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, y);
  };

  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    let currentY = y;
    
    for (const line of lines) {
      doc.text(line, x, currentY);
      currentY += lineHeight;
    }
    
    return currentY;
  };

  const addPage = () => {
    doc.addPage();
    yPos = 20;
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > 270) {
      addPage();
      return true;
    }
    return false;
  };

  // ========== HEADER ==========
  // Title background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 45, "F");
  
  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(tripPlan.title || "Trip Itinerary", margin, 25);
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${tripPlan.destination?.name || "Destination"} • ${tripPlan.dates?.totalDays || 0} Days`,
    margin,
    35
  );
  
  // Status badge
  const statusText = tripPlan.status?.toUpperCase() || "PLANNING";
  doc.setFontSize(10);
  doc.text(statusText, pageWidth - margin - 30, 35);
  
  yPos = 55;
  
  // ========== TRIP DETAILS ==========
  // Dates section
  addText("TRIP DATES", margin, yPos, { fontSize: 10, color: primaryColor });
  yPos += 8;
  
  const startDate = tripPlan.dates?.startDate ? new Date(tripPlan.dates.startDate).toLocaleDateString() : "N/A";
  const endDate = tripPlan.dates?.endDate ? new Date(tripPlan.dates.endDate).toLocaleDateString() : "N/A";
  
  addText(`${startDate} - ${endDate}`, margin, yPos, { fontSize: 12 });
  yPos += 15;
  
  // Budget section
  addText("BUDGET", margin, yPos, { fontSize: 10, color: primaryColor });
  yPos += 8;
  
  addText(`$${tripPlan.budget?.total?.toLocaleString() || 0} ${tripPlan.budget?.currency || "USD"}`, margin, yPos, { fontSize: 14, fontStyle: "bold" });
  
  // Budget breakdown
  if (tripPlan.budget?.breakdown) {
    const breakdown = tripPlan.budget.breakdown;
    const breakdownText = `Flights: $${breakdown.flights} • Hotels: $${breakdown.accommodation} • Food: $${breakdown.food} • Activities: $${breakdown.activities}`;
    yPos += 6;
    addText(breakdownText, margin, yPos, { fontSize: 9, color: mutedColor });
  }
  
  yPos += 15;
  
  // ========== ITINERARY ==========
  // Draw line
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  
  addText("DETAILED ITINERARY", margin, yPos, { fontSize: 12, fontStyle: "bold" });
  yPos += 10;
  
  // Days
  for (const day of tripPlan.itinerary || []) {
    checkPageBreak(40);
    
    // Day header
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, yPos - 5, pageWidth - margin * 2, 12, "F");
    
    addText(`Day ${day.day}`, margin + 5, yPos + 2, { fontSize: 11, fontStyle: "bold", color: primaryColor });
    
    const dayDate = day.date ? new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
    addText(dayDate, pageWidth - margin - 30, yPos + 2, { fontSize: 9, color: mutedColor });
    
    yPos += 15;
    
    // Day title
    addText(day.title || `Day ${day.day}`, margin, yPos, { fontSize: 11, fontStyle: "bold" });
    yPos += 6;
    
    // Summary
    if (day.summary) {
      const summaryLines = doc.splitTextToSize(day.summary, pageWidth - margin * 2);
      addText(summaryLines.join("\n"), margin, yPos, { fontSize: 9, color: mutedColor });
      yPos += summaryLines.length * 5 + 5;
    }
    
    // Activities
    if (day.activities && day.activities.length > 0) {
      yPos += 5;
      addText("Activities:", margin, yPos, { fontSize: 9, fontStyle: "bold" });
      yPos += 5;
      
      for (const activity of day.activities.slice(0, 5)) { // Limit activities per day
        if (checkPageBreak(10)) break;
        
        const time = activity.time?.start || "09:00";
        const name = activity.activity?.name || "Activity";
        const price = activity.activity?.price?.min || 0;
        
        const activityText = `${time} - ${name}${price > 0 ? ` ($${price})` : ""}`;
        addText("• " + activityText, margin + 5, yPos, { fontSize: 8, color: mutedColor });
        yPos += 4;
      }
    }
    
    // Highlights
    if (day.highlights && day.highlights.length > 0) {
      yPos += 3;
      addText("Highlights: " + day.highlights.join(", "), margin, yPos, { fontSize: 8, color: [139, 92, 246] });
    }
    
    yPos += 12;
  }
  
  // ========== HOTELS ==========
  if (tripPlan.hotels && tripPlan.hotels.length > 0) {
    if (checkPageBreak(30)) {
      addPage();
    }
    
    yPos += 10;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    addText("ACCOMMODATION", margin, yPos, { fontSize: 12, fontStyle: "bold" });
    yPos += 10;
    
    for (const reservation of tripPlan.hotels) {
      const hotel = reservation.hotel;
      if (!hotel) continue;
      
      if (checkPageBreak(25)) addPage();
      
      addText(hotel.name || "Hotel", margin, yPos, { fontSize: 11, fontStyle: "bold" });
      addText(`$${hotel.pricePerNight?.min || 0}/night`, pageWidth - margin - 30, yPos, { fontSize: 10, color: mutedColor });
      yPos += 6;
      
      addText(`${hotel.address?.city || ""}, ${hotel.address?.country || ""}`, margin, yPos, { fontSize: 9, color: mutedColor });
      yPos += 10;
    }
  }
  
  // ========== FOOTER ==========
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, 280, pageWidth - margin, 280);
    
    // Page number
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by DreamTrip AI • Page ${i} of ${totalPages}`,
      margin,
      288
    );
    
    // Date
    doc.text(
      new Date().toLocaleDateString(),
      pageWidth - margin - 30,
      288
    );
  }
  
  return doc;
}

// -----------------------------
// Component
// -----------------------------

export default function ExportPDF({ tripPlan, className = "" }: ExportPDFProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const doc = generatePDF(tripPlan);
      
      // Generate filename
      const destination = tripPlan.destination?.name || "Trip";
      const startDate = tripPlan.dates?.startDate
        ? new Date(tripPlan.dates.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const filename = `${destination.replace(/\s+/g, "_")}_${startDate}.pdf`;
      
      // Download
      doc.save(filename);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        inline-flex items-center justify-center gap-2 px-5 py-3 
        rounded-xl font-medium transition-all
        ${isExporting
          ? "bg-white/5 text-white/30 cursor-not-allowed"
          : "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 active:scale-95"
        }
        ${className}
      `}
    >
      {isExporting ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </>
      )}
    </button>
  );
}
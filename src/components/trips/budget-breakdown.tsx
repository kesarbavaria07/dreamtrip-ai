"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { BudgetBreakdown, BudgetAlert } from "@/types/travel";

// -----------------------------
// Props
// -----------------------------

export interface BudgetBreakdownProps {
  breakdown: BudgetBreakdown;
  total: number;
  currency?: string;
  remaining?: number;
  alerts?: BudgetAlert[];
  className?: string;
}

// -----------------------------
// Chart Colors
// -----------------------------

const COLORS = {
  flights: "#818CF8",      // Indigo
  accommodation: "#A78BFA", // Purple
  activities: "#C084FC",    // Violet
  food: "#F472B6",          // Pink
  transport: "#34D399",     // Emerald
  misc: "#FBBF24",          // Amber
};

// -----------------------------
// Custom Tooltip
// -----------------------------

interface TooltipPayload {
  name: string;
  value: number;
  payload: {
    fill: string;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  return (
    <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-xl p-3 shadow-xl">
      <p className="text-white font-medium capitalize">{data.name}</p>
      <p className="text-white/60 text-sm">${data.value.toLocaleString()}</p>
    </div>
  );
}

// -----------------------------
// Legend Item
// -----------------------------

function LegendItem({ 
  name, 
  value, 
  total, 
  color, 
  isActive, 
  onClick 
}: { 
  name: string; 
  value: number; 
  total: number; 
  color: string; 
  isActive: boolean;
  onClick: () => void;
}) {
  const percentage = ((value / total) * 100).toFixed(1);

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
        isActive ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 text-left">
        <p className="text-white font-medium capitalize">{name}</p>
        <p className="text-white/40 text-sm">{percentage}%</p>
      </div>
      <p className="text-white font-semibold">${value.toLocaleString()}</p>
    </button>
  );
}

// -----------------------------
// Main Component
// -----------------------------

export default function BudgetBreakdown({
  breakdown,
  total,
  currency = "USD",
  remaining,
  alerts = [],
  className = "",
}: BudgetBreakdownProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Transform data for chart
  const chartData = Object.entries(breakdown)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      fill: COLORS[name as keyof typeof COLORS] || "#6B7280",
    }));

  const totalSpent = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  const calculatedRemaining = remaining ?? (total - totalSpent);
  const percentageUsed = ((totalSpent / total) * 100).toFixed(0);

  // Center content for donut chart
  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (activeIndex === null) {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
      return percent > 0.05 ? (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      ) : null;
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Budget Breakdown</h2>
          <p className="text-white/50 text-sm">
            Total allocated: ${total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="relative">
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={activeIndex !== null ? 110 : 100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                      className="transition-all duration-200"
                      style={{ transform: activeIndex === index ? "scale(1.05)" : "scale(1)" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{percentageUsed}%</p>
              <p className="text-white/50 text-sm">spent</p>
            </div>
          </div>
        </div>

        {/* Legend & Details */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="space-y-1">
            {chartData.map((item, index) => (
              <LegendItem
                key={item.name}
                name={item.name}
                value={item.value}
                total={total}
                color={item.fill}
                isActive={activeIndex === index || activeIndex === null}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* Remaining Budget */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-sm">Remaining Budget</p>
                <p className={`text-2xl font-bold ${calculatedRemaining >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  ${Math.abs(calculatedRemaining).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    alert.type === "warning"
                      ? "bg-amber-500/10 border border-amber-500/20"
                      : alert.type === "exceeded"
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-blue-500/10 border border-blue-500/20"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ${
                      alert.type === "warning"
                        ? "text-amber-400"
                        : alert.type === "exceeded"
                        ? "text-red-400"
                        : "text-blue-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {alert.type === "tip" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : alert.type === "exceeded" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <div>
                    <p className="text-sm text-white capitalize">{alert.category}</p>
                    <p className="text-xs text-white/50">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1 capitalize">{item.name}</p>
            <p className="text-xl font-bold text-white">${item.value.toLocaleString()}</p>
            <p className="text-xs text-white/30 mt-1">
              {((item.value / total) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
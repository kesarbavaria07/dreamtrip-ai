"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const countries = [
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "UK", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "India", name: "India", currency: "INR", symbol: "₹" },
  { code: "Germany", name: "Germany", currency: "EUR", symbol: "€" },
  { code: "France", name: "France", currency: "EUR", symbol: "€" },
  { code: "Japan", name: "Japan", currency: "JPY", symbol: "¥" },
  { code: "Australia", name: "Australia", currency: "AUD", symbol: "A$" },
  { code: "Canada", name: "Canada", currency: "CAD", symbol: "C$" },
];

const statesByCountry: Record<string, string[]> = {
  US: ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan"],
  UK: ["England", "Scotland", "Wales", "Northern Ireland"],
  India: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Gujarat", "West Bengal"],
  Germany: ["Bavaria", "Berlin", "Hamburg", "Munich", "Frankfurt", "Cologne"],
  France: ["Île-de-France", "Provence", "Brittany", "Alsace", "Normandy", "Lyon"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Okinawa", "Hiroshima"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
};

export default function SignUpPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCountry = countries.find((c) => c.code === country);
  const states = country ? statesByCountry[country] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!country) {
      setError("Please select your country");
      return;
    }
    
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        name,
        country,
        state,
        isSignUp: "true",
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/planner");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white">
            DreamTrip AI
          </Link>
          <p className="text-white/60 mt-2">Create your account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-white/80 mb-2">
                Country <span className="text-red-400">*</span>
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState("");
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
              {selectedCountry && (
                <p className="mt-1 text-xs text-white/50">
                  Prices will be shown in {selectedCountry.currency}
                </p>
              )}
            </div>

            {states.length > 0 && (
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-white/80 mb-2">
                  State/Region
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select your state (optional)</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
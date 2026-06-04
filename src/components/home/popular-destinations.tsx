"use client";

import GlassCard from "@/components/ui/card";

const destinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    trips: "2.4k",
    rating: 4.9
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    trips: "3.1k",
    rating: 4.8
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    trips: "4.2k",
    rating: 4.9
  },
  {
    id: 4,
    name: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=800&q=80",
    trips: "1.8k",
    rating: 4.7
  },
  {
    id: 5,
    name: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    trips: "1.5k",
    rating: 4.9
  },
  {
    id: 6,
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    trips: "2.9k",
    rating: 4.8
  }
];

export default function PopularDestinations() {
  return (
    <section id="destinations" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
            Popular Destinations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Explore Dream Destinations
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Discover the world&apos;s most breathtaking locations, AI-curated for your perfect trip.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <GlassCard
              key={destination.id}
              variant="hover"
              className={`group cursor-pointer ${
                index === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""
              }`}
            >
              {/* Image Container */}
              <div className={`relative overflow-hidden ${
                index === 0 ? "h-64 lg:h-full" : "h-48"
              }`}>
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-xl bg-white/10 border border-white/20">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-white">{destination.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{destination.name}</h3>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {destination.trips} trips
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
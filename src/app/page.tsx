import { Navbar, Hero, PopularDestinations, HowItWorks, Features, Footer } from "@/components/home";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <PopularDestinations />
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  );
}
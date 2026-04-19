import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { SitePreloader } from "@/components/site/SitePreloader";
import { Features } from "@/components/site/Features";
import { Restaurants } from "@/components/site/Restaurants";
import { About } from "@/components/site/About";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Testimonials } from "@/components/site/Testimonials";
import { Riders } from "@/components/site/Riders";
import { WhyZaaou } from "@/components/site/WhyZaaou";
import { PartnerCTA } from "@/components/site/PartnerCTA";
import { AppDownload } from "@/components/site/AppDownload";
import { TeamSection } from "@/components/site/TeamSection";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zaaou Food - Itahari's Favourite Food Delivery App" },
      { name: "description", content: "Order from the best restaurants in Itahari. Fast delivery, fresh food and exclusive offers - only on Zaaou Food." },
      { property: "og:title", content: "Zaaou Food - Itahari's Favourite Food Delivery App" },
      { property: "og:description", content: "Order from the best restaurants in Itahari. Fast delivery, fresh food and exclusive offers - only on Zaaou Food." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SitePreloader />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Restaurants />
        <About />
        <WhyZaaou />
        <HowItWorks />
        <Riders />
        <Testimonials />
        <TeamSection />
        <PartnerCTA />
        <AppDownload />
      </main>
      <Footer />
    </div>
  );
}

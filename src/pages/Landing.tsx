import {
  LandingHeader,
  LandingHero,
  LogoStrip,
  ProductSection,
  HowItWorks,
  TrustSection,
  Testimonials,
  PricingSection,
  FAQSection,
  FinalCTA,
  LandingFooter,
} from "@/components/landing";

import { useEffect } from "react";
import { runOverflowDebug } from "@/lib/overflow-debug";

export default function Landing() {
  useEffect(() => {
    runOverflowDebug();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LogoStrip />
        <ProductSection />
        <HowItWorks />
        <TrustSection />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}

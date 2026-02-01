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

import { useOverflowDebug } from "@/lib/use-overflow-debug";

export default function Landing() {
  useOverflowDebug({ label: "landing" });

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

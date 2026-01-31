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
  LandingFooter,
} from "@/components/landing";

export default function Landing() {
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
      </main>
      <LandingFooter />
    </div>
  );
}

import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { Testimonials } from '@/components/landing/testimonials';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Testimonials />
      <CTASection />
    </>
  );
}

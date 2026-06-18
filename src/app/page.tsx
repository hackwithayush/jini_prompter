import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AgentShowcase from '@/components/landing/AgentShowcase';
import { GeneratedOutput } from '@/components/landing/GeneratedOutput';
import CognitiveFramework from '@/components/landing/CognitiveFramework';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { PromptIntelligence } from '@/components/landing/PromptIntelligence';
import { BlueprintProvider } from '@/lib/context/BlueprintContext';

export default function Home() {
  return (
    <BlueprintProvider>
      <main className="relative min-h-screen bg-[#08060f] overflow-x-hidden">
      {/* Ambient background mesh gradient */}
      <div className="mesh-gradient" aria-hidden="true">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Page Sections */}
      <div className="relative z-10">
        <HeroSection />
        <CognitiveFramework />
        <GeneratedOutput />
        <PromptIntelligence />
        <FeaturesSection />
        <AgentShowcase />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
      </main>
    </BlueprintProvider>
  );
}

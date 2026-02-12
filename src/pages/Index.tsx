import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import PipelineSection from "@/components/PipelineSection";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardSection from "@/components/DashboardSection";
import AIChatSection from "@/components/AIChatSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <PipelineSection />
      <FeaturesSection />
      <DashboardSection />
      <AIChatSection />
      <ArchitectureSection />
      <Footer />
    </main>
  );
};

export default Index;

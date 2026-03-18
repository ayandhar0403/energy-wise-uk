import Header from "@/components/dashboard/Header";
import PostcodeHero from "@/components/dashboard/PostcodeHero";
import EnergyOverview from "@/components/dashboard/EnergyOverview";
import UsageChart from "@/components/dashboard/UsageChart";
import TariffComparison from "@/components/dashboard/TariffComparison";
import SavingsTips from "@/components/dashboard/SavingsTips";
import CarbonFootprint from "@/components/dashboard/CarbonFootprint";
import BudgetTracker from "@/components/dashboard/BudgetTracker";
import EPCRating from "@/components/dashboard/EPCRating";
import EnergyFAQ from "@/components/dashboard/EnergyFAQ";
import HowToSwitch from "@/components/dashboard/HowToSwitch";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />
        <PostcodeHero />
        <EnergyOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <UsageChart />
          </div>
          <div className="space-y-6">
            <BudgetTracker />
            <TariffComparison />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <SavingsTips />
          <CarbonFootprint />
          <EPCRating />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <EnergyFAQ />
          </div>
          <HowToSwitch />
        </div>
        <footer className="mt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">
            Data sourced from Ofgem & Energy Saving Trust · Prices as of March 2026
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

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
import { Separator } from "@/components/ui/separator";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />
        <PostcodeHero />
        <EnergyOverview />

        {/* EPC Rating moved up — alongside Usage Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <UsageChart />
          </div>
          <div className="space-y-6">
            <EPCRating />
            <BudgetTracker />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <SavingsTips />
          <CarbonFootprint />
          <TariffComparison />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <EnergyFAQ />
          </div>
          <HowToSwitch />
        </div>
      </div>

      {/* Footer — Contact Us & Terms like EDF Energy */}
      <footer className="mt-12 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg">EnergyWise</span>
              </div>
              <p className="text-sm text-background/60">
                Smart energy management for UK households. Helping you save money and reduce your carbon footprint.
              </p>
            </div>

            {/* Contact Us */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Contact Us</h4>
              <ul className="space-y-2 text-sm text-background/60">
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  0800 123 4567
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  support@energywise.co.uk
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  EnergyWise HQ, 10 Green Lane, London EC2A 1AB
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm text-background/60">
                <li><a href="/profile" className="hover:text-background transition-colors">My Account</a></li>
                <li><a href="/bills" className="hover:text-background transition-colors">Bill History</a></li>
                <li><a href="/upload-bill" className="hover:text-background transition-colors">Upload a Bill</a></li>
                <li><a href="/settings" className="hover:text-background transition-colors">Settings</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-background/60">
                <li><a href="#" className="hover:text-background transition-colors">Terms &amp; Conditions</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-background/15" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
            <p>© {new Date().getFullYear()} EnergyWise. All rights reserved.</p>
            <p>Data sourced from Ofgem &amp; Energy Saving Trust · Prices as of March 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

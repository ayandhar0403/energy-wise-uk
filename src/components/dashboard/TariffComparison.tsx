import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

const tariffs = [
  {
    provider: "British Gas",
    plan: "Fixed Price 2026",
    monthlyCost: "£135",
    annualSaving: "£87",
    rating: 3.9,
    badge: null,
    features: ["Fixed until Mar 2026", "No exit fees", "Dual fuel"],
    switchUrl: "https://www.britishgas.co.uk/energy/gas-and-electricity.html",
  },
  {
    provider: "EDF Energy",
    plan: "Simply Online",
    monthlyCost: "£139",
    annualSaving: "£42",
    rating: 4.1,
    badge: null,
    features: ["Online management", "1yr fixed", "Green option"],
    switchUrl: "https://www.edfenergy.com/gas-electricity",
  },
];

const TariffComparison = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-display">Switch & Save</CardTitle>
        <CardDescription>
          Based on your usage, here are better tariffs available
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tariffs.map((tariff) => (
          <div
            key={tariff.plan}
            className="relative rounded-lg border border-border p-4 hover:border-primary/40 transition-colors group"
          >
            {tariff.badge && (
              <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-xs">
                {tariff.badge}
              </Badge>
            )}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-sm">{tariff.provider}</p>
                <p className="text-xs text-muted-foreground">{tariff.plan}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="text-xs font-medium">{tariff.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold font-display">{tariff.monthlyCost}</p>
                <p className="text-xs text-muted-foreground">/month</p>
                <p className="text-xs font-medium text-success mt-1">
                  Save {tariff.annualSaving}/yr
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tariff.features.map((f) => (
                <Badge key={f} variant="secondary" className="text-xs font-normal">
                  {f}
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-primary group-hover:bg-primary/5"
              asChild
            >
              <a href={tariff.switchUrl} target="_blank" rel="noopener noreferrer">
                Compare & Switch <ArrowRight className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TariffComparison;

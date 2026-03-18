import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, ThermometerSnowflake, Timer, Plug } from "lucide-react";

const tips = [
  {
    icon: ThermometerSnowflake,
    title: "Lower thermostat by 1°C",
    saving: "£80/year",
    impact: 85,
    description: "Reducing from 21°C to 20°C saves ~10% on heating",
  },
  {
    icon: Lightbulb,
    title: "Switch to LED bulbs",
    saving: "£55/year",
    impact: 60,
    description: "Replace remaining 8 halogen bulbs in your home",
  },
  {
    icon: Timer,
    title: "Use off-peak hours",
    saving: "£45/year",
    impact: 50,
    description: "Run dishwasher & washing machine after 10pm",
  },
  {
    icon: Plug,
    title: "Eliminate standby drain",
    saving: "£35/year",
    impact: 40,
    description: "Turn off 12 devices left on standby overnight",
  },
];

const SavingsTips = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          Smart Savings Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip) => (
          <div key={tip.title} className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <tip.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{tip.title}</p>
                  <span className="text-sm font-bold text-success">{tip.saving}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={tip.impact} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">{tip.impact}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-lg bg-primary/5 p-3 mt-2">
          <p className="text-sm font-semibold text-primary font-display">
            Total potential savings: £215/year
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on your current household usage patterns
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsTips;

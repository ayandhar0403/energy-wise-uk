import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Zap, PoundSterling, Flame, Droplets } from "lucide-react";

const stats = [
  {
    title: "Monthly Bill",
    value: "£142.30",
    change: "-8.2%",
    trend: "down" as const,
    icon: PoundSterling,
    description: "vs last month",
  },
  {
    title: "Electricity",
    value: "285 kWh",
    change: "-12.1%",
    trend: "down" as const,
    icon: Zap,
    description: "vs last month",
  },
  {
    title: "Gas Usage",
    value: "420 kWh",
    change: "+3.4%",
    trend: "up" as const,
    icon: Flame,
    description: "vs last month",
  },
  {
    title: "Water",
    value: "8.2 m³",
    change: "-5.0%",
    trend: "down" as const,
    icon: Droplets,
    description: "vs last month",
  },
];

const EnergyOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <stat.icon className="w-20 h-20" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{stat.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {stat.trend === "down" ? (
                <TrendingDown className="h-3 w-3 text-success" />
              ) : (
                <TrendingUp className="h-3 w-3 text-destructive" />
              )}
              <span
                className={`text-xs font-medium ${
                  stat.trend === "down" ? "text-success" : "text-destructive"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnergyOverview;

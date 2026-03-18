import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Zap, PoundSterling, Flame, Droplets } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const EnergyOverview = () => {
  const { data: bills = [] } = useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .order("bill_date", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data;
    },
  });

  const latest = bills[0];
  const previous = bills[1];

  const calcChange = (curr: number | null, prev: number | null) => {
    if (!curr || !prev || prev === 0) return null;
    return ((curr - prev) / prev) * 100;
  };

  const monthlyChange = calcChange(
    latest?.total_amount ? Number(latest.total_amount) : null,
    previous?.total_amount ? Number(previous.total_amount) : null
  );
  const elecChange = calcChange(
    latest?.electricity_kwh ? Number(latest.electricity_kwh) : null,
    previous?.electricity_kwh ? Number(previous.electricity_kwh) : null
  );
  const gasChange = calcChange(
    latest?.gas_kwh ? Number(latest.gas_kwh) : null,
    previous?.gas_kwh ? Number(previous.gas_kwh) : null
  );

  const stats = [
    {
      title: "Monthly Bill",
      value: latest?.total_amount ? `£${Number(latest.total_amount).toFixed(2)}` : "—",
      change: monthlyChange,
      icon: PoundSterling,
      description: "vs last bill",
    },
    {
      title: "Electricity",
      value: latest?.electricity_kwh ? `${Number(latest.electricity_kwh).toLocaleString()} kWh` : "—",
      change: elecChange,
      icon: Zap,
      description: "vs last bill",
    },
    {
      title: "Gas Usage",
      value: latest?.gas_kwh ? `${Number(latest.gas_kwh).toLocaleString()} kWh` : "—",
      change: gasChange,
      icon: Flame,
      description: "vs last bill",
    },
    {
      title: "Bills Tracked",
      value: String(bills.length),
      change: null,
      icon: Droplets,
      description: "total uploaded",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const trend = stat.change !== null ? (stat.change <= 0 ? "down" : "up") : null;
        return (
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
                {trend === "down" && <TrendingDown className="h-3 w-3 text-success" />}
                {trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
                {stat.change !== null && (
                  <span className={`text-xs font-medium ${trend === "down" ? "text-success" : "text-destructive"}`}>
                    {stat.change > 0 ? "+" : ""}{stat.change.toFixed(1)}%
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EnergyOverview;

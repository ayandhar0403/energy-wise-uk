import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { Leaf } from "lucide-react";

const data = [
  { name: "Heating", value: 42, color: "hsl(38, 92%, 55%)" },
  { name: "Hot Water", value: 21, color: "hsl(205, 80%, 50%)" },
  { name: "Appliances", value: 18, color: "hsl(152, 58%, 38%)" },
  { name: "Lighting", value: 11, color: "hsl(280, 60%, 55%)" },
  { name: "Cooking", value: 8, color: "hsl(0, 72%, 55%)" },
];

const chartConfig = {
  heating: { label: "Heating", color: "hsl(38, 92%, 55%)" },
  hotWater: { label: "Hot Water", color: "hsl(205, 80%, 50%)" },
  appliances: { label: "Appliances", color: "hsl(152, 58%, 38%)" },
  lighting: { label: "Lighting", color: "hsl(280, 60%, 55%)" },
  cooking: { label: "Cooking", color: "hsl(0, 72%, 55%)" },
} satisfies ChartConfig;

const CarbonFootprint = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Carbon Breakdown
        </CardTitle>
        <CardDescription>Your energy use by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-muted p-3 mt-4 text-center">
          <p className="text-2xl font-bold font-display">2.4t</p>
          <p className="text-xs text-muted-foreground">CO₂ this year · 18% below UK avg</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonFootprint;

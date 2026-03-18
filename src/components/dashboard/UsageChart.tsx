import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const dailyData = [
  { day: "Mon", electricity: 9.2, gas: 14.1 },
  { day: "Tue", electricity: 8.8, gas: 13.5 },
  { day: "Wed", electricity: 10.1, gas: 15.2 },
  { day: "Thu", electricity: 7.6, gas: 12.8 },
  { day: "Fri", electricity: 9.5, gas: 14.9 },
  { day: "Sat", electricity: 12.3, gas: 16.1 },
  { day: "Sun", electricity: 11.8, gas: 15.7 },
];

const monthlyData = [
  { month: "Jul", electricity: 220, gas: 180 },
  { month: "Aug", electricity: 235, gas: 170 },
  { month: "Sep", electricity: 260, gas: 280 },
  { month: "Oct", electricity: 280, gas: 380 },
  { month: "Nov", electricity: 310, gas: 450 },
  { month: "Dec", electricity: 320, gas: 520 },
  { month: "Jan", electricity: 305, gas: 490 },
  { month: "Feb", electricity: 285, gas: 420 },
];

const chartConfig = {
  electricity: {
    label: "Electricity (kWh)",
    color: "hsl(152, 58%, 38%)",
  },
  gas: {
    label: "Gas (kWh)",
    color: "hsl(38, 92%, 55%)",
  },
} satisfies ChartConfig;

const UsageChart = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display">Energy Usage</CardTitle>
            <CardDescription>Track your electricity and gas consumption</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">8 Months</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="fillElec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 58%, 38%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(152, 58%, 38%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="electricity" stroke="hsl(152, 58%, 38%)" fill="url(#fillElec)" strokeWidth={2} />
                <Area type="monotone" dataKey="gas" stroke="hsl(38, 92%, 55%)" fill="url(#fillGas)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="monthly">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="fillElecM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 58%, 38%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(152, 58%, 38%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillGasM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="electricity" stroke="hsl(152, 58%, 38%)" fill="url(#fillElecM)" strokeWidth={2} />
                <Area type="monotone" dataKey="gas" stroke="hsl(38, 92%, 55%)" fill="url(#fillGasM)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UsageChart;

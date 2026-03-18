import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, RefreshCw, Gauge } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Compare & choose",
    description: "Enter a few details, compare tariffs, and pick the one that works for you.",
    icon: ClipboardList,
  },
  {
    step: 2,
    title: "We handle the switch",
    description: "Your new supplier talks to your current one and takes care of everything.",
    icon: RefreshCw,
  },
  {
    step: 3,
    title: "Submit a meter reading",
    description: "Once complete, send a reading so you only pay for what you've actually used.",
    icon: Gauge,
  },
];

const HowToSwitch = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-display">How to Switch</CardTitle>
        <CardDescription>
          It normally takes just 3–5 days in 3 easy steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <Badge className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold">
                {s.step}
              </Badge>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-sm">{s.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HowToSwitch;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoundSterling, AlertTriangle } from "lucide-react";

interface BudgetSettings {
  enabled: boolean;
  monthlyLimit: number;
  alertAt: number;
}

const BudgetTracker = () => {
  const [budget, setBudget] = useState<BudgetSettings>({
    enabled: true,
    monthlyLimit: 150,
    alertAt: 80,
  });

  useEffect(() => {
    const saved = localStorage.getItem("budgetSettings");
    if (saved) setBudget(JSON.parse(saved));
  }, []);

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

  // Get current month's spending (latest bill as proxy)
  const latestBill = bills[0];
  const currentSpend = latestBill?.total_amount ? Number(latestBill.total_amount) : 0;
  const percentage = budget.monthlyLimit > 0 ? Math.min((currentSpend / budget.monthlyLimit) * 100, 100) : 0;
  const isOverBudget = percentage >= 100;
  const isNearBudget = percentage >= budget.alertAt;

  if (!budget.enabled) return null;

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PoundSterling className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-display">Monthly Budget</CardTitle>
          </div>
          {isNearBudget && (
            <div className="flex items-center gap-1 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">
                {isOverBudget ? "Over budget" : "Near limit"}
              </span>
            </div>
          )}
        </div>
        <CardDescription>
          {currentSpend > 0
            ? `£${currentSpend.toFixed(2)} of £${budget.monthlyLimit} spent`
            : "No bill data yet — upload a bill to track spending"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress
          value={percentage}
          className={`h-3 ${isOverBudget ? "[&>div]:bg-destructive" : isNearBudget ? "[&>div]:bg-warning" : ""}`}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>£0</span>
          <span className={isNearBudget ? "font-semibold text-warning" : ""}>
            {percentage.toFixed(0)}% used
          </span>
          <span>£{budget.monthlyLimit}</span>
        </div>
        {currentSpend > 0 && (
          <p className="text-xs text-muted-foreground">
            Remaining: <span className="font-semibold text-foreground">
              £{Math.max(budget.monthlyLimit - currentSpend, 0).toFixed(2)}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetTracker;

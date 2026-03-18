import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PoundSterling, Moon, TrendingUp, CalendarClock } from "lucide-react";

interface NotificationPrefs {
  budgetAlerts: boolean;
  weeklyReport: boolean;
  savingsTips: boolean;
  tariffChanges: boolean;
  usageSpikes: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface BudgetSettings {
  enabled: boolean;
  monthlyLimit: number;
  alertAt: number; // percentage threshold
}

interface QuietHoursSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface UsageAlertSettings {
  enabled: boolean;
  threshold: number; // percentage above average
  comparisonPeriod: string;
}

interface BillReminderSettings {
  enabled: boolean;
  daysBefore: number;
  reminderTime: string;
}

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    budgetAlerts: true,
    weeklyReport: true,
    savingsTips: false,
    tariffChanges: true,
    usageSpikes: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const [budget, setBudget] = useState<BudgetSettings>({
    enabled: true,
    monthlyLimit: 150,
    alertAt: 80,
  });

  const [quietHours, setQuietHours] = useState<QuietHoursSettings>({
    enabled: false,
    startTime: "22:00",
    endTime: "07:00",
  });

  const [usageAlert, setUsageAlert] = useState<UsageAlertSettings>({
    enabled: true,
    threshold: 30,
    comparisonPeriod: "7days",
  });

  const [billReminder, setBillReminder] = useState<BillReminderSettings>({
    enabled: true,
    daysBefore: 3,
    reminderTime: "09:00",
  });

  useEffect(() => {
    const savedNotifs = localStorage.getItem("notificationPrefs");
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    const savedBudget = localStorage.getItem("budgetSettings");
    if (savedBudget) setBudget(JSON.parse(savedBudget));
    const savedQuiet = localStorage.getItem("quietHoursSettings");
    if (savedQuiet) setQuietHours(JSON.parse(savedQuiet));
    const savedUsage = localStorage.getItem("usageAlertSettings");
    if (savedUsage) setUsageAlert(JSON.parse(savedUsage));
    const savedBill = localStorage.getItem("billReminderSettings");
    if (savedBill) setBillReminder(JSON.parse(savedBill));
  }, []);

  const saveAll = () => {
    localStorage.setItem("notificationPrefs", JSON.stringify(notifications));
    localStorage.setItem("budgetSettings", JSON.stringify(budget));
    localStorage.setItem("quietHoursSettings", JSON.stringify(quietHours));
    localStorage.setItem("usageAlertSettings", JSON.stringify(usageAlert));
    localStorage.setItem("billReminderSettings", JSON.stringify(billReminder));
    toast.success("Notification preferences saved");
  };

  return (
    <div className="space-y-6">
      {/* Budget Threshold */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <PoundSterling className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-display">Budget Threshold</CardTitle>
                <CardDescription className="text-xs">Get alerted when approaching your monthly limit</CardDescription>
              </div>
            </div>
            <Switch
              checked={budget.enabled}
              onCheckedChange={(v) => setBudget({ ...budget, enabled: v })}
            />
          </div>
        </CardHeader>
        {budget.enabled && (
          <CardContent className="space-y-5 pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Monthly Budget</Label>
                <span className="text-sm font-semibold text-primary">£{budget.monthlyLimit}</span>
              </div>
              <Slider
                value={[budget.monthlyLimit]}
                onValueChange={([v]) => setBudget({ ...budget, monthlyLimit: v })}
                min={50}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>£50</span>
                <span>£500</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Alert when spending reaches</Label>
                <span className="text-sm font-semibold text-accent">{budget.alertAt}%</span>
              </div>
              <Slider
                value={[budget.alertAt]}
                onValueChange={([v]) => setBudget({ ...budget, alertAt: v })}
                min={50}
                max={95}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                You'll be alerted when you've spent £{Math.round(budget.monthlyLimit * budget.alertAt / 100)} of your £{budget.monthlyLimit} budget
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Usage Comparison Alerts */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-base font-display">Usage Comparison Alerts</CardTitle>
                <CardDescription className="text-xs">Get notified when usage spikes above your average</CardDescription>
              </div>
            </div>
            <Switch
              checked={usageAlert.enabled}
              onCheckedChange={(v) => setUsageAlert({ ...usageAlert, enabled: v })}
            />
          </div>
        </CardHeader>
        {usageAlert.enabled && (
          <CardContent className="space-y-5 pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Alert threshold</Label>
                <span className="text-sm font-semibold text-destructive">+{usageAlert.threshold}%</span>
              </div>
              <Slider
                value={[usageAlert.threshold]}
                onValueChange={([v]) => setUsageAlert({ ...usageAlert, threshold: v })}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Alert when daily usage is {usageAlert.threshold}% higher than your average
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Compare against</Label>
              <Select
                value={usageAlert.comparisonPeriod}
                onValueChange={(v) => setUsageAlert({ ...usageAlert, comparisonPeriod: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days average</SelectItem>
                  <SelectItem value="30days">Last 30 days average</SelectItem>
                  <SelectItem value="sameMonth">Same month last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bill Due Reminders */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <CalendarClock className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-base font-display">Bill Due Reminders</CardTitle>
                <CardDescription className="text-xs">Reminders before your bill payment dates</CardDescription>
              </div>
            </div>
            <Switch
              checked={billReminder.enabled}
              onCheckedChange={(v) => setBillReminder({ ...billReminder, enabled: v })}
            />
          </div>
        </CardHeader>
        {billReminder.enabled && (
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Remind me</Label>
                <Select
                  value={String(billReminder.daysBefore)}
                  onValueChange={(v) => setBillReminder({ ...billReminder, daysBefore: Number(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="2">2 days before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="5">5 days before</SelectItem>
                    <SelectItem value="7">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Reminder time</Label>
                <Input
                  type="time"
                  value={billReminder.reminderTime}
                  onChange={(e) => setBillReminder({ ...billReminder, reminderTime: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quiet Hours */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base font-display">Quiet Hours</CardTitle>
                <CardDescription className="text-xs">Pause all notifications during set times</CardDescription>
              </div>
            </div>
            <Switch
              checked={quietHours.enabled}
              onCheckedChange={(v) => setQuietHours({ ...quietHours, enabled: v })}
            />
          </div>
        </CardHeader>
        {quietHours.enabled && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">From</Label>
                <Input
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Until</Label>
                <Input
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No notifications will be sent between {quietHours.startTime} and {quietHours.endTime}
            </p>
          </CardContent>
        )}
      </Card>

      {/* General Toggles */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-display">General Alerts & Delivery</CardTitle>
          <CardDescription className="text-xs">Toggle individual alert types and channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "tariffChanges" as const, label: "Tariff Changes", desc: "Notify when Ofgem price cap or your tariff changes" },
            { key: "weeklyReport" as const, label: "Weekly Summary", desc: "Weekly email with your energy usage breakdown" },
            { key: "savingsTips" as const, label: "Savings Tips", desc: "Personalised tips based on your usage patterns" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
              />
            </div>
          ))}

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Delivery Channels</h3>
            {[
              { key: "emailNotifications" as const, label: "Email", desc: "Receive alerts via email" },
              { key: "pushNotifications" as const, label: "Push Notifications", desc: "Browser push notifications" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{item.label}</Label>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveAll} className="w-full sm:w-auto">
        Save All Preferences
      </Button>
    </div>
  );
};

export default NotificationsTab;

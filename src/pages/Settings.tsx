import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Zap, User, Bell, Palette, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import NotificationsTab from "@/components/settings/NotificationsTab";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    postcode: "",
    propertyType: "",
    bedrooms: "",
    provider: "",
  });


  // Units & preferences
  const [preferences, setPreferences] = useState({
    energyUnit: "kWh",
    currency: "GBP",
    dateFormat: "DD/MM/YYYY",
    billingCycle: "monthly",
  });

  // Load saved data
  useEffect(() => {
    const savedProfile = localStorage.getItem("householdProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile((prev) => ({ ...prev, ...parsed }));
    }
    const savedPrefs = localStorage.getItem("unitPrefs");
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
  }, []);

  const saveProfile = () => {
    localStorage.setItem("householdProfile", JSON.stringify(profile));
    toast.success("Profile updated successfully");
  };


  const savePreferences = () => {
    localStorage.setItem("unitPrefs", JSON.stringify(preferences));
    toast.success("Preferences saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Bell className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Palette className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger value="units" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Units</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="font-display">Profile & Account</CardTitle>
                <CardDescription>Update your personal and household details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      placeholder="CF10 1AA"
                      value={profile.postcode}
                      onChange={(e) => setProfile({ ...profile, postcode: e.target.value })}
                      className="uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Energy Provider</Label>
                    <Select
                      value={profile.provider}
                      onValueChange={(v) => setProfile({ ...profile, provider: v })}
                    >
                      <SelectTrigger id="provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {["British Gas", "EDF Energy", "E.ON Next", "Octopus Energy", "OVO Energy", "Scottish Power", "Shell Energy", "Other"].map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select
                      value={profile.propertyType}
                      onValueChange={(v) => setProfile({ ...profile, propertyType: v })}
                    >
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { value: "detached", label: "Detached House" },
                          { value: "semi-detached", label: "Semi-Detached" },
                          { value: "terraced", label: "Terraced House" },
                          { value: "flat", label: "Flat / Apartment" },
                          { value: "bungalow", label: "Bungalow" },
                        ].map((pt) => (
                          <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={profile.bedrooms}
                      onValueChange={(v) => setProfile({ ...profile, bedrooms: v })}
                    >
                      <SelectTrigger id="bedrooms">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5+"].map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={saveProfile} className="w-full sm:w-auto">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="font-display">Appearance</CardTitle>
                <CardDescription>Customise how EnergyWise looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { value: "light", label: "Light", desc: "Clean, bright interface" },
                  { value: "dark", label: "Dark", desc: "Easy on the eyes, saves energy on OLED screens" },
                  { value: "system", label: "System", desc: "Follows your device's theme setting" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`w-full flex items-center justify-between rounded-lg border p-4 transition-all text-left
                      ${theme === option.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40"
                      }`}
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                    <div
                      className={`h-4 w-4 rounded-full border-2 transition-colors ${
                        theme === option.value ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Units Tab */}
          <TabsContent value="units">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="font-display">Units & Preferences</CardTitle>
                <CardDescription>Configure display formats and measurement units</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Energy Unit</Label>
                    <Select
                      value={preferences.energyUnit}
                      onValueChange={(v) => setPreferences({ ...preferences, energyUnit: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kWh">kWh (Kilowatt-hours)</SelectItem>
                        <SelectItem value="MJ">MJ (Megajoules)</SelectItem>
                        <SelectItem value="BTU">BTU (British Thermal Units)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={preferences.currency}
                      onValueChange={(v) => setPreferences({ ...preferences, currency: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">£ GBP (British Pound)</SelectItem>
                        <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                        <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(v) => setPreferences({ ...preferences, dateFormat: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Cycle</Label>
                    <Select
                      value={preferences.billingCycle}
                      onValueChange={(v) => setPreferences({ ...preferences, billingCycle: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={savePreferences} className="w-full sm:w-auto">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

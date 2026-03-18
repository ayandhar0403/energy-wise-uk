import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Home, ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";

const propertyTypes = [
  { value: "detached", label: "Detached House" },
  { value: "semi-detached", label: "Semi-Detached House" },
  { value: "terraced", label: "Terraced House" },
  { value: "flat", label: "Flat / Apartment" },
  { value: "bungalow", label: "Bungalow" },
  { value: "cottage", label: "Cottage" },
];

const energyProviders = [
  "British Gas",
  "EDF Energy",
  "E.ON Next",
  "Octopus Energy",
  "OVO Energy",
  "Scottish Power",
  "Shell Energy",
  "So Energy",
  "Utility Warehouse",
  "Bulb (now Octopus)",
  "Other",
];

const bedroomOptions = ["1", "2", "3", "4", "5+"];

const HouseholdProfile = () => {
  const navigate = useNavigate();
  const [postcode, setPostcode] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [provider, setProvider] = useState("");

  const isValidPostcode = (pc: string) =>
    /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postcode || !isValidPostcode(postcode)) {
      toast.error("Please enter a valid UK postcode");
      return;
    }
    if (!propertyType) {
      toast.error("Please select your property type");
      return;
    }
    if (!bedrooms) {
      toast.error("Please select the number of bedrooms");
      return;
    }
    if (!provider) {
      toast.error("Please select your energy provider");
      return;
    }

    localStorage.setItem(
      "householdProfile",
      JSON.stringify({ postcode: postcode.trim().toUpperCase(), propertyType, bedrooms, provider })
    );
    toast.success("Household profile saved!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
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
              <h1 className="text-xl font-bold font-display text-foreground">Household Profile</h1>
              <p className="text-sm text-muted-foreground">Help us personalise your energy insights</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Postcode */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Postcode</CardTitle>
              <CardDescription>We use this to find tariffs and regional pricing in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g. CF10 1AA"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                maxLength={10}
                className="max-w-xs uppercase"
              />
            </CardContent>
          </Card>

          {/* Property Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Property Type</CardTitle>
              <CardDescription>Different property types have different energy profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propertyTypes.map((pt) => (
                  <button
                    type="button"
                    key={pt.value}
                    onClick={() => setPropertyType(pt.value)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all
                      ${propertyType === pt.value
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                      }`}
                  >
                    <Home className="h-4 w-4 shrink-0" />
                    {pt.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bedrooms */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Number of Bedrooms</CardTitle>
              <CardDescription>This helps estimate your typical energy consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={bedrooms} onValueChange={setBedrooms} className="flex flex-wrap gap-3">
                {bedroomOptions.map((b) => (
                  <Label
                    key={b}
                    htmlFor={`bed-${b}`}
                    className={`flex items-center justify-center w-14 h-14 rounded-xl border cursor-pointer text-base font-semibold transition-all
                      ${bedrooms === b
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                      }`}
                  >
                    <RadioGroupItem value={b} id={`bed-${b}`} className="sr-only" />
                    {b}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Energy Provider */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Current Energy Provider</CardTitle>
              <CardDescription>We'll compare your tariff against better deals</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select your provider" />
                </SelectTrigger>
                <SelectContent>
                  {energyProviders.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full font-display font-semibold text-base">
            Save Profile & View Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HouseholdProfile;

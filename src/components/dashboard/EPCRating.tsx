import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Lightbulb, ThermometerSnowflake, Droplets, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HouseholdProfile {
  postcode?: string;
  propertyType?: string;
  bedrooms?: string;
}

const epcBands = {
  A: { color: "hsl(152, 58%, 38%)", label: "Excellent", score: "92+" },
  B: { color: "hsl(152, 58%, 48%)", label: "Very Good", score: "81-91" },
  C: { color: "hsl(80, 60%, 45%)", label: "Good", score: "69-80" },
  D: { color: "hsl(38, 92%, 55%)", label: "Average", score: "55-68" },
  E: { color: "hsl(25, 80%, 50%)", label: "Below Average", score: "39-54" },
  F: { color: "hsl(10, 70%, 50%)", label: "Poor", score: "21-38" },
  G: { color: "hsl(0, 72%, 55%)", label: "Very Poor", score: "1-20" },
};

type EPCBand = keyof typeof epcBands;

// Estimate EPC band based on property type and age proxy
const estimateEPC = (propertyType: string, bedrooms: string): EPCBand => {
  const bedroomNum = parseInt(bedrooms) || 3;
  const typeScores: Record<string, number> = {
    flat: 72,
    terraced: 65,
    "semi-detached": 60,
    detached: 55,
    bungalow: 58,
    cottage: 48,
  };
  let score = typeScores[propertyType] || 60;
  score -= (bedroomNum - 2) * 3; // larger homes tend to be less efficient
  
  if (score >= 81) return "B";
  if (score >= 69) return "C";
  if (score >= 55) return "D";
  if (score >= 39) return "E";
  if (score >= 21) return "F";
  return "G";
};

const getInsulationTips = (band: EPCBand, propertyType: string) => {
  const tips = [];
  if (["D", "E", "F", "G"].includes(band)) {
    tips.push({
      icon: ThermometerSnowflake,
      text: "Cavity wall insulation could save up to £395/year",
      saving: "£395",
    });
  }
  if (["C", "D", "E", "F", "G"].includes(band)) {
    tips.push({
      icon: Home,
      text: "Loft insulation (270mm) could save up to £590/year",
      saving: "£590",
    });
  }
  if (["D", "E", "F", "G"].includes(band)) {
    tips.push({
      icon: Droplets,
      text: "Upgrading your boiler could save up to £840/year",
      saving: "£840",
    });
  }
  if (band !== "A" && band !== "B") {
    tips.push({
      icon: Lightbulb,
      text: "Double glazing upgrades could save up to £235/year",
      saving: "£235",
    });
  }
  return tips.slice(0, 3);
};

const EPCRating = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<HouseholdProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("householdProfile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  if (!profile?.postcode || !profile?.propertyType) {
    return (
      <Card className="border-none shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Home className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="font-display font-semibold text-foreground mb-1">EPC Rating</p>
          <p className="text-xs text-muted-foreground mb-3">
            Complete your household profile to see your estimated energy rating
          </p>
          <Button size="sm" variant="outline" onClick={() => navigate("/profile")}>
            Set Up Profile <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const band = estimateEPC(profile.propertyType, profile.bedrooms || "3");
  const bandInfo = epcBands[band];
  const tips = getInsulationTips(band, profile.propertyType);

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="font-display flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          EPC Rating Estimate
        </CardTitle>
        <CardDescription>
          Based on your {profile.propertyType} in {profile.postcode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* EPC Band Display */}
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-bold font-display text-white"
            style={{ backgroundColor: bandInfo.color }}
          >
            {band}
          </div>
          <div>
            <p className="font-semibold text-foreground">{bandInfo.label}</p>
            <p className="text-xs text-muted-foreground">Score range: {bandInfo.score}</p>
            <Badge variant="secondary" className="mt-1 text-xs">
              Estimated · {profile.bedrooms || "3"} bed {profile.propertyType}
            </Badge>
          </div>
        </div>

        {/* EPC Scale */}
        <div className="space-y-1">
          {(Object.keys(epcBands) as EPCBand[]).map((b) => (
            <div key={b} className="flex items-center gap-2">
              <div
                className={`h-5 rounded text-xs font-bold text-white flex items-center justify-center transition-all ${
                  b === band ? "w-full" : "w-3/4 opacity-40"
                }`}
                style={{
                  backgroundColor: epcBands[b].color,
                  minWidth: b === band ? undefined : "60%",
                }}
              >
                {b === band && `${b} - ${epcBands[b].label}`}
                {b !== band && b}
              </div>
            </div>
          ))}
        </div>

        {/* Insulation Tips */}
        {tips.length > 0 && (
          <div className="space-y-2 mt-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Improvement Tips
            </p>
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-muted p-2.5">
                <tip.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">{tip.text}</p>
                </div>
                <span className="text-xs font-bold text-success shrink-0">{tip.saving}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EPCRating;

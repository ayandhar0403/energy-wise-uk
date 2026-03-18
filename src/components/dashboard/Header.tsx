import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, FileText, History, Settings, User, Zap } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between pb-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight">
            EnergyWise
          </h1>
          <p className="text-xs text-muted-foreground">
            Smart energy management for UK households
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="hidden sm:flex gap-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
          Ofgem Cap: 24.5p/kWh
        </Badge>
        <Button variant="ghost" size="icon" onClick={() => navigate("/upload-bill")} className="relative">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
          <User className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

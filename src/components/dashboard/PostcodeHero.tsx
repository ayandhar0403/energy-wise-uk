import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PostcodeHero = () => {
  const [postcode, setPostcode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = postcode.trim().toUpperCase();
    // Basic UK postcode validation
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/;
    if (!postcodeRegex.test(trimmed)) {
      toast({
        title: "Invalid postcode",
        description: "Please enter a valid UK postcode (e.g. SW1A 1AA)",
        variant: "destructive",
      });
      return;
    }
    // Store postcode and navigate to profile to complete setup
    localStorage.setItem("energywise_postcode", trimmed);
    toast({ title: "Postcode saved!", description: "We'll use this to find the best tariffs for your area." });
    navigate("/profile");
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 sm:p-8 text-primary-foreground mb-6">
      <h2 className="text-xl sm:text-2xl font-bold font-display mb-2">
        Lock in your energy price
      </h2>
      <p className="text-primary-foreground/80 text-sm mb-5 max-w-md">
        Enter your postcode to compare tariffs and find the best deal for your area.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
        <Input
          placeholder="e.g. SW1A 1AA"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="bg-primary-foreground/15 border-primary-foreground/25 placeholder:text-primary-foreground/50 text-primary-foreground"
        />
        <Button
          type="submit"
          variant="secondary"
          className="shrink-0 gap-1.5 font-semibold"
        >
          <Search className="h-4 w-4" />
          Get started
        </Button>
      </form>
    </div>
  );
};

export default PostcodeHero;

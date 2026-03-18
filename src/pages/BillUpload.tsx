import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Camera, FileText, Zap, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BillData {
  provider: string | null;
  account_number: string | null;
  bill_date: string | null;
  period_start: string | null;
  period_end: string | null;
  total_amount: number | null;
  electricity_kwh: number | null;
  electricity_cost: number | null;
  gas_kwh: number | null;
  gas_cost: number | null;
  standing_charge_electricity: number | null;
  standing_charge_gas: number | null;
  unit_rate_electricity: number | null;
  unit_rate_gas: number | null;
  tariff_name: string | null;
  payment_method: string | null;
}

const BillUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [billData, setBillData] = useState<BillData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image or PDF of your energy bill");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }

    setFileName(file.name);
    setBillData(null);

    // Generate preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Convert to base64
    setIsProcessing(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("extract-bill", {
        body: { imageBase64: base64, mimeType: file.type },
      });

      if (error) {
        throw new Error(error.message || "Failed to process bill");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.data) {
        setBillData(data.data);
        toast.success("Bill data extracted successfully!");
      }
    } catch (err) {
      console.error("Bill processing error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to process bill. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const formatCurrency = (value: number | null) =>
    value !== null ? `£${value.toFixed(2)}` : "—";

  const formatNumber = (value: number | null, unit: string) =>
    value !== null ? `${value.toLocaleString()} ${unit}` : "—";

  const formatDate = (value: string | null) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return value;
    }
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
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground">Bill Scanner</h1>
              <p className="text-sm text-muted-foreground">Upload your energy bill for instant analysis</p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="font-display font-semibold text-foreground">Analysing your bill…</p>
                  <p className="text-sm text-muted-foreground">
                    AI is extracting tariff rates, usage and costs
                  </p>
                </div>
              ) : preview ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={preview}
                    alt="Bill preview"
                    className="max-h-48 rounded-lg object-contain border border-border"
                  />
                  <p className="text-sm text-muted-foreground">{fileName}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreview(null);
                      setFileName("");
                      setBillData(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-display font-semibold text-foreground mb-1">
                    Drop your energy bill here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports JPG, PNG, or PDF · Max 10MB
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="default"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-1" /> Upload File
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-1" /> Take Photo
                    </Button>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data */}
        {billData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-display">Bill Summary</CardTitle>
                </div>
                <CardDescription>
                  {billData.provider && `${billData.provider} · `}
                  {billData.bill_date ? formatDate(billData.bill_date) : "Date not found"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <DataCard label="Total Amount" value={formatCurrency(billData.total_amount)} highlight />
                  <DataCard label="Billing Period" value={
                    billData.period_start && billData.period_end
                      ? `${formatDate(billData.period_start)} – ${formatDate(billData.period_end)}`
                      : "—"
                  } />
                  <DataCard label="Payment Method" value={billData.payment_method || "—"} />
                </div>
              </CardContent>
            </Card>

            {/* Electricity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" /> Electricity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <DataCard label="Usage" value={formatNumber(billData.electricity_kwh, "kWh")} />
                  <DataCard label="Cost" value={formatCurrency(billData.electricity_cost)} />
                  <DataCard label="Unit Rate" value={billData.unit_rate_electricity ? `${billData.unit_rate_electricity}p/kWh` : "—"} />
                  <DataCard label="Standing Charge" value={billData.standing_charge_electricity ? `${billData.standing_charge_electricity}p/day` : "—"} />
                </div>
              </CardContent>
            </Card>

            {/* Gas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <span className="text-orange-500">🔥</span> Gas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <DataCard label="Usage" value={formatNumber(billData.gas_kwh, "kWh")} />
                  <DataCard label="Cost" value={formatCurrency(billData.gas_cost)} />
                  <DataCard label="Unit Rate" value={billData.unit_rate_gas ? `${billData.unit_rate_gas}p/kWh` : "—"} />
                  <DataCard label="Standing Charge" value={billData.standing_charge_gas ? `${billData.standing_charge_gas}p/day` : "—"} />
                </div>
              </CardContent>
            </Card>

            {/* Tariff & Account */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <DataCard label="Tariff" value={billData.tariff_name || "—"} />
                  <DataCard label="Account Number" value={billData.account_number || "—"} />
                  <DataCard label="Provider" value={billData.provider || "—"} />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1" disabled={isSaving} onClick={async () => {
                setIsSaving(true);
                try {
                  const { error } = await supabase.from("bills").insert({
                    provider: billData.provider,
                    account_number: billData.account_number,
                    bill_date: billData.bill_date,
                    period_start: billData.period_start,
                    period_end: billData.period_end,
                    total_amount: billData.total_amount,
                    electricity_kwh: billData.electricity_kwh,
                    electricity_cost: billData.electricity_cost,
                    gas_kwh: billData.gas_kwh,
                    gas_cost: billData.gas_cost,
                    standing_charge_electricity: billData.standing_charge_electricity,
                    standing_charge_gas: billData.standing_charge_gas,
                    unit_rate_electricity: billData.unit_rate_electricity,
                    unit_rate_gas: billData.unit_rate_gas,
                    tariff_name: billData.tariff_name,
                    payment_method: billData.payment_method,
                  });
                  if (error) throw error;
                  toast.success("Bill saved to history!");
                  navigate("/bills");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to save bill");
                } finally {
                  setIsSaving(false);
                }
              }}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving…</> : "Save to History"}
              </Button>
              <Button variant="outline" onClick={() => {
                setPreview(null);
                setFileName("");
                setBillData(null);
              }}>
                Scan Another Bill
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DataCard = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`font-semibold ${highlight ? "text-lg text-primary" : "text-sm text-foreground"}`}>
      {value}
    </p>
  </div>
);

export default BillUpload;

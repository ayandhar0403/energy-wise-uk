import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Plus, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

const BillHistory = () => {
  const navigate = useNavigate();

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .order("bill_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (v: number | null) => (v != null ? `£${Number(v).toFixed(2)}` : "—");
  const formatDate = (v: string | null) => {
    if (!v) return "—";
    try {
      return new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return v;
    }
  };

  const totalSpent = bills.reduce((s, b) => s + (Number(b.total_amount) || 0), 0);
  const avgBill = bills.length ? totalSpent / bills.length : 0;

  const latestTwo = bills.slice(0, 2);
  const trend =
    latestTwo.length === 2
      ? ((Number(latestTwo[0].total_amount) || 0) - (Number(latestTwo[1].total_amount) || 0))
      : null;

  const chartData = [...bills]
    .reverse()
    .map((b) => ({
      date: b.bill_date
        ? new Date(b.bill_date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
        : "?",
      electricity: Number(b.electricity_cost) || 0,
      gas: Number(b.gas_cost) || 0,
      total: Number(b.total_amount) || 0,
    }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">Bill History</h1>
                <p className="text-sm text-muted-foreground">
                  {bills.length} bill{bills.length !== 1 && "s"} on record
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate("/upload-bill")}>
            <Plus className="h-4 w-4 mr-1" /> Add Bill
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">Loading…</div>
        ) : bills.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="font-display font-semibold text-foreground mb-1">No bills yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your first energy bill to start tracking spending
              </p>
              <Button onClick={() => navigate("/upload-bill")}>
                <Plus className="h-4 w-4 mr-1" /> Upload Bill
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Spent" value={formatCurrency(totalSpent)} />
              <StatCard label="Average Bill" value={formatCurrency(avgBill)} />
              <StatCard label="Bills Tracked" value={String(bills.length)} />
              <StatCard
                label="Latest Trend"
                value={
                  trend !== null
                    ? `${trend >= 0 ? "+" : ""}£${Math.abs(trend).toFixed(2)}`
                    : "—"
                }
                icon={
                  trend !== null ? (
                    trend >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-primary" />
                    )
                  ) : undefined
                }
              />
            </div>

            {/* Chart */}
            {chartData.length >= 2 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Spending Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `£${v}`} />
                        <Tooltip
                          formatter={(value: number) => `£${value.toFixed(2)}`}
                          contentStyle={{
                            borderRadius: "0.5rem",
                            border: "1px solid hsl(var(--border))",
                            background: "hsl(var(--popover))",
                            color: "hsl(var(--popover-foreground))",
                          }}
                        />
                        <Bar dataKey="electricity" name="Electricity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="gas" name="Gas" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                        <Line dataKey="total" name="Total" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">All Bills</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead className="hidden sm:table-cell">Electricity</TableHead>
                      <TableHead className="hidden sm:table-cell">Gas</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{formatDate(bill.bill_date)}</TableCell>
                        <TableCell>
                          {bill.provider ? (
                            <Badge variant="secondary">{bill.provider}</Badge>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatCurrency(Number(bill.electricity_cost))}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatCurrency(Number(bill.gas_cost))}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(Number(bill.total_amount))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-lg font-bold font-display text-foreground">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default BillHistory;

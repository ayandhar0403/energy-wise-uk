
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT,
  account_number TEXT,
  bill_date DATE,
  period_start DATE,
  period_end DATE,
  total_amount NUMERIC,
  electricity_kwh NUMERIC,
  electricity_cost NUMERIC,
  gas_kwh NUMERIC,
  gas_cost NUMERIC,
  standing_charge_electricity NUMERIC,
  standing_charge_gas NUMERIC,
  unit_rate_electricity NUMERIC,
  unit_rate_gas NUMERIC,
  tariff_name TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Public insert/select for now (no auth yet)
CREATE POLICY "Allow public read" ON public.bills FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.bills FOR INSERT WITH CHECK (true);

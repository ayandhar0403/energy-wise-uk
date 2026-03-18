import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert at extracting structured data from UK energy bills. 
Extract the following fields from the bill image. Return ONLY the tool call, no other text.
If a field cannot be found, use null.
Amounts should be numbers (no currency symbols). Dates should be ISO format (YYYY-MM-DD).
Usage should be in kWh as a number.`;

    const userContent = [
      {
        type: "image_url",
        image_url: {
          url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
        },
      },
      {
        type: "text",
        text: "Extract the energy bill data from this image.",
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_bill_data",
              description: "Extract structured data from a UK energy bill",
              parameters: {
                type: "object",
                properties: {
                  provider: { type: "string", description: "Energy provider name" },
                  account_number: { type: "string", description: "Account or customer reference number" },
                  bill_date: { type: "string", description: "Bill date in YYYY-MM-DD format" },
                  period_start: { type: "string", description: "Billing period start date YYYY-MM-DD" },
                  period_end: { type: "string", description: "Billing period end date YYYY-MM-DD" },
                  total_amount: { type: "number", description: "Total bill amount in GBP" },
                  electricity_kwh: { type: "number", description: "Electricity usage in kWh" },
                  electricity_cost: { type: "number", description: "Electricity cost in GBP" },
                  gas_kwh: { type: "number", description: "Gas usage in kWh" },
                  gas_cost: { type: "number", description: "Gas cost in GBP" },
                  standing_charge_electricity: { type: "number", description: "Daily standing charge for electricity in pence" },
                  standing_charge_gas: { type: "number", description: "Daily standing charge for gas in pence" },
                  unit_rate_electricity: { type: "number", description: "Electricity unit rate in pence per kWh" },
                  unit_rate_gas: { type: "number", description: "Gas unit rate in pence per kWh" },
                  tariff_name: { type: "string", description: "Name of the tariff" },
                  payment_method: { type: "string", description: "Payment method (Direct Debit, Prepayment, etc.)" },
                },
                required: ["provider", "total_amount"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_bill_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("AI did not return structured bill data");
    }

    const extractedData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, data: extractedData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("extract-bill error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

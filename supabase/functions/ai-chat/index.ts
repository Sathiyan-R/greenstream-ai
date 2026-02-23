import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, dashboardContext } = await req.json();
    const GREENSTREAM_API_KEY = Deno.env.get("GREENSTREAM_API_KEY");
    if (!GREENSTREAM_API_KEY) throw new Error("GREENSTREAM_API_KEY is not configured");

    const systemPrompt = `You are GreenStream AI Assistant.
You analyze real-time environmental and energy data.
Explain anomalies clearly.
Provide sustainability recommendations.
Predict future risks based on forecast.
Always use real-time values in your response.
Be concise and actionable.

You have access to the following LIVE dashboard data:
${JSON.stringify(dashboardContext, null, 2)}

Your role:
- Reference live values (temperature, AQI, energy, carbon) in every answer
- Detect and explain anomalies (energy spikes >20%, high AQI, solar drops >30%)
- Include tomorrow's prediction data when discussing future risks
- Provide 3 clear, actionable sustainability recommendations
- Return structured insights with summary, risk level, and recommendations
- Use the rolling average (rollingAvgUsage) to contextualize current readings
- Reference the prediction engine's risk level and factors

Format responses with bullet points and bold key metrics.`;

    const response = await fetch("https://ai.gateway.greenstream.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GREENSTREAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

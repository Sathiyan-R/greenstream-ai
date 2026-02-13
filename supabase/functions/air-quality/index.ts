import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { city, state, country } = await req.json();
    const apiKey = Deno.env.get("AIRVISUAL_API_KEY");
    if (!apiKey) throw new Error("AIRVISUAL_API_KEY not configured");

    const res = await fetch(
      `https://api.airvisual.com/v2/city?city=${encodeURIComponent(city || "London")}&state=${encodeURIComponent(state || "England")}&country=${encodeURIComponent(country || "UK")}&key=${apiKey}`
    );
    const data = await res.json();

    if (data.status !== "success") {
      return new Response(JSON.stringify({ error: data.data?.message || "Air quality API error" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pollution = data.data?.current?.pollution;
    const weather = data.data?.current?.weather;

    return new Response(JSON.stringify({
      city: data.data?.city,
      aqi: pollution?.aqius,
      main_pollutant: pollution?.mainus,
      temperature: weather?.tp,
      humidity: weather?.hu,
      wind_speed: weather?.ws,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Air quality error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

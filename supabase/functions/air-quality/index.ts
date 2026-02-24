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

    if (apiKey) {
      try {
        const res = await fetch(
          `https://api.airvisual.com/v2/city?city=${encodeURIComponent(city || "Chennai")}&state=${encodeURIComponent(state || "Tamil Nadu")}&country=${encodeURIComponent(country || "India")}&key=${apiKey}`
        );
        const data = await res.json();

        if (data.status === "success") {
          const pollution = data.data?.current?.pollution;
          const weather = data.data?.current?.weather;
          return new Response(JSON.stringify({
            city: data.data?.city,
            aqi: pollution?.aqius,
            main_pollutant: pollution?.mainus,
            temperature: weather?.tp,
            humidity: weather?.hu,
            wind_speed: weather?.ws,
            simulated: false,
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error("AirVisual API error:", JSON.stringify(data));
      } catch (e) {
        console.error("AirVisual fetch failed:", e);
      }
    }

    const aqi = 30 + Math.floor(Math.random() * 80);
    const pollutants = ["p2", "p1", "o3", "n2", "s2", "co"];
    return new Response(JSON.stringify({
      city: city || "Chennai",
      aqi,
      main_pollutant: pollutants[Math.floor(Math.random() * pollutants.length)],
      temperature: 15 + Math.round(Math.random() * 15),
      humidity: 40 + Math.round(Math.random() * 40),
      wind_speed: Math.round(Math.random() * 8 * 10) / 10,
      simulated: true,
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

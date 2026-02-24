import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { city } = await req.json();
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");

    if (apiKey) {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city || "New Delhi")}&units=metric&appid=${apiKey}`
        );
        const data = await res.json();

        if (data.cod === "200" && data.list) {
          
          const now = Date.now();
          const tomorrow = now + 24 * 60 * 60 * 1000;
          const dayAfter = now + 48 * 60 * 60 * 1000;

          const tomorrowForecasts = data.list.filter((item: any) => {
            const t = item.dt * 1000;
            return t >= tomorrow && t < dayAfter;
          });

          if (tomorrowForecasts.length > 0) {
            const avgTemp = tomorrowForecasts.reduce((s: number, f: any) => s + f.main.temp, 0) / tomorrowForecasts.length;
            const maxTemp = Math.max(...tomorrowForecasts.map((f: any) => f.main.temp));
            const avgHumidity = tomorrowForecasts.reduce((s: number, f: any) => s + f.main.humidity, 0) / tomorrowForecasts.length;
            const avgWind = tomorrowForecasts.reduce((s: number, f: any) => s + f.wind.speed, 0) / tomorrowForecasts.length;
            const avgClouds = tomorrowForecasts.reduce((s: number, f: any) => s + f.clouds.all, 0) / tomorrowForecasts.length;
            const conditions = tomorrowForecasts.map((f: any) => f.weather[0]?.main).filter(Boolean);
            const dominantCondition = conditions.sort((a: string, b: string) =>
              conditions.filter((v: string) => v === a).length - conditions.filter((v: string) => v === b).length
            ).pop() || "Unknown";

            return new Response(JSON.stringify({
              city: data.city?.name || city,
              avgTemp: Math.round(avgTemp * 10) / 10,
              maxTemp: Math.round(maxTemp * 10) / 10,
              humidity: Math.round(avgHumidity),
              windSpeed: Math.round(avgWind * 10) / 10,
              clouds: Math.round(avgClouds),
              condition: dominantCondition,
              forecastPoints: tomorrowForecasts.length,
              simulated: false,
            }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
        }
        console.error("Forecast API issue:", JSON.stringify(data).slice(0, 200));
      } catch (e) {
        console.error("Forecast fetch failed:", e);
      }
    }

    const baseTemp = 15 + Math.random() * 20;
    return new Response(JSON.stringify({
      city: city || "Chennai",
      avgTemp: Math.round(baseTemp * 10) / 10,
      maxTemp: Math.round((baseTemp + 3 + Math.random() * 5) * 10) / 10,
      humidity: 40 + Math.round(Math.random() * 40),
      windSpeed: Math.round(Math.random() * 8 * 10) / 10,
      clouds: Math.round(Math.random() * 100),
      condition: ["Clear", "Clouds", "Rain", "Drizzle"][Math.floor(Math.random() * 4)],
      forecastPoints: 8,
      simulated: true,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Forecast error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

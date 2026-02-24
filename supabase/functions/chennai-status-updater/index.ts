import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ZoneData {
  zone_name: string;
  temperature: number;
  aqi: number;
  energy_consumption: number;
  carbon_emission: number;
  sustainability_score: number;
  trend_temperature: string;
  trend_aqi: string;
  trend_energy: string;
  prediction_tomorrow: string;
  ai_suggestion: string;
}

function calculateTrend(current: number, previous: number): string {
  const diff = current - previous;
  const threshold = Math.abs(previous) * 0.05; 
  
  if (Math.abs(diff) < threshold) return "→";
  return diff > 0 ? "↑" : "↓";
}

function calculateSustainabilityScore(
  aqi: number,
  energy: number,
  carbon: number,
  temperature: number
): number {
  
  const aqiScore = Math.max(0, 100 - (aqi / 2)); 
  const energyScore = Math.max(0, 100 - (energy / 30)); 
  const tempScore = Math.max(0, 100 - (temperature - 25) * 5); 
  
  return Math.round((aqiScore * 0.5) + (energyScore * 0.3) + (tempScore * 0.2));
}

function generateAISuggestion(zone: ZoneData): string {
  const suggestions: string[] = [];
  
  if (zone.aqi > 150) {
    suggestions.push("Critical: Deploy air purifiers and reduce outdoor activities");
  } else if (zone.aqi > 100) {
    suggestions.push("Alert: Monitor air quality and limit sensitive group exposure");
  }
  
  if (zone.energy_consumption > 2000) {
    suggestions.push("High energy demand - implement load balancing immediately");
  } else if (zone.energy_consumption > 1500) {
    suggestions.push("Consider renewable energy integration to reduce grid load");
  }
  
  if (zone.sustainability_score < 50) {
    suggestions.push("Urgent intervention required across all environmental parameters");
  }
  
  if (suggestions.length === 0) {
    return "Continue monitoring current sustainable practices";
  }
  
  return suggestions.join(". ");
}

function generatePrediction(zone: ZoneData): string {
  const predictions: string[] = [];
  
  if (zone.trend_temperature === "↑") {
    predictions.push("Temperature expected to rise by 1-2°C");
  } else if (zone.trend_temperature === "↓") {
    predictions.push("Cooler conditions expected");
  }
  
  if (zone.trend_aqi === "↑") {
    predictions.push("AQI may worsen without intervention");
  }
  
  if (zone.trend_energy === "↑") {
    predictions.push("Higher energy demand forecasted");
  }
  
  if (predictions.length === 0) {
    return "Stable environmental conditions expected";
  }
  
  return predictions.join(". ");
}

serve(async (req) => {
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: currentData } = await supabaseAdmin
      .from("chennai_environment_status")
      .select("*")
      .order("zone_name");

    const weatherApiKey = Deno.env.get("OPENWEATHER_API_KEY");
    let baseTemperature = 32;
    
    if (weatherApiKey) {
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=${weatherApiKey}&units=metric`
        );
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          baseTemperature = weatherData.main.temp;
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
      }
    }

    const iqAirApiKey = Deno.env.get("IQAIR_API_KEY");
    let baseAqi = 120;
    
    if (iqAirApiKey) {
      try {
        const aqiResponse = await fetch(
          `https://api.airvisual.com/v2/city?city=Chennai&state=Tamil Nadu&country=India&key=${iqAirApiKey}`
        );
        if (aqiResponse.ok) {
          const aqiData = await aqiResponse.json();
          baseAqi = aqiData.data.current.pollution.aqius;
        }
      } catch (error) {
        console.error("AQI fetch failed:", error);
      }
    }

    const zones = [
      {
        zone_name: "North Chennai",
        tempOffset: -0.5,
        aqiMultiplier: 1.2,
        energyBase: 1250,
      },
      {
        zone_name: "Central Chennai",
        tempOffset: 0,
        aqiMultiplier: 0.8,
        energyBase: 850,
      },
      {
        zone_name: "South Chennai",
        tempOffset: 1.0,
        aqiMultiplier: 1.1,
        energyBase: 1450,
      },
      {
        zone_name: "OMR / IT Corridor",
        tempOffset: 2.5,
        aqiMultiplier: 1.4,
        energyBase: 2100,
      },
      {
        zone_name: "Industrial Belt",
        tempOffset: 3.0,
        aqiMultiplier: 1.5,
        energyBase: 2500,
      },
    ];

    const updates = await Promise.all(
      zones.map(async (zoneConfig) => {
        const previousZone = currentData?.find(
          (z) => z.zone_name === zoneConfig.zone_name
        );

        const variation = (Math.random() - 0.5) * 2;
        const temperature = parseFloat(
          (baseTemperature + zoneConfig.tempOffset + variation).toFixed(2)
        );
        const aqi = Math.round(baseAqi * zoneConfig.aqiMultiplier + variation * 10);
        const energy_consumption = parseFloat(
          (zoneConfig.energyBase + (Math.random() - 0.5) * 200).toFixed(2)
        );
        const carbon_emission = parseFloat((energy_consumption * 0.82).toFixed(2));
        const sustainability_score = calculateSustainabilityScore(
          aqi,
          energy_consumption,
          carbon_emission,
          temperature
        );

        const trend_temperature = previousZone
          ? calculateTrend(temperature, previousZone.temperature)
          : "→";
        const trend_aqi = previousZone
          ? calculateTrend(aqi, previousZone.aqi)
          : "→";
        const trend_energy = previousZone
          ? calculateTrend(energy_consumption, previousZone.energy_consumption)
          : "→";

        const zoneData: ZoneData = {
          zone_name: zoneConfig.zone_name,
          temperature,
          aqi,
          energy_consumption,
          carbon_emission,
          sustainability_score,
          trend_temperature,
          trend_aqi,
          trend_energy,
          prediction_tomorrow: "",
          ai_suggestion: "",
        };

        zoneData.prediction_tomorrow = generatePrediction(zoneData);
        zoneData.ai_suggestion = generateAISuggestion(zoneData);

        const { error } = await supabaseAdmin
          .from("chennai_environment_status")
          .update(zoneData)
          .eq("zone_name", zoneConfig.zone_name);

        if (error) {
          console.error(`Error updating ${zoneConfig.zone_name}:`, error);
        }

        return zoneData;
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Chennai environmental status updated successfully",
        data: updates,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

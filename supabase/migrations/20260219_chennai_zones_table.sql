-- Create chennai_environment_status table for real-time zone data
CREATE TABLE IF NOT EXISTS public.chennai_environment_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name TEXT NOT NULL,
  zone_region TEXT,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  aqi INTEGER,
  energy_consumption DECIMAL(10, 2),
  carbon_emission DECIMAL(10, 2),
  sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  wind_speed DECIMAL(5, 2),
  zone_area DECIMAL(10, 2),
  energy_variance DECIMAL(10, 2),
  trend_temperature TEXT,
  trend_aqi TEXT,
  trend_energy TEXT,
  prediction_tomorrow TEXT,
  ai_suggestion TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_zone_name ON public.chennai_environment_status(zone_name);
CREATE INDEX IF NOT EXISTS idx_last_updated ON public.chennai_environment_status(last_updated DESC);

-- Enable Row Level Security
ALTER TABLE public.chennai_environment_status ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (adjust based on your security needs)
CREATE POLICY "Allow public read access" ON public.chennai_environment_status
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update (adjust based on your needs)
CREATE POLICY "Allow authenticated insert" ON public.chennai_environment_status
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.chennai_environment_status
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data for Chennai zones
INSERT INTO public.chennai_environment_status (
  zone_name, zone_region, latitude, longitude, temperature, humidity, aqi,
  energy_consumption, carbon_emission, sustainability_score, wind_speed,
  zone_area, energy_variance, trend_temperature, trend_aqi, trend_energy,
  prediction_tomorrow, ai_suggestion
) VALUES
  ('T. Nagar', 'Commercial Hub', 13.0418, 80.2341, 32, 72, 145, 850, 697, 54, 6, 45, 127, '↑', '↓', '→', 'Stable conditions expected', 'Monitor energy consumption closely'),
  ('Anna Nagar', 'Residential', 13.0850, 80.2101, 31, 68, 98, 620, 508.4, 72, 10, 55, 93, '→', '↓', '↑', 'Air quality improving', 'Continue green initiatives'),
  ('OMR / IT Corridor', 'Tech Hub', 12.9426, 80.2313, 33, 75, 132, 1200, 984, 44, 8, 120, 180, '↑', '↑', '↑', 'High energy demand expected', 'Implement renewable sources'),
  ('Adyar', 'Coastal Residential', 13.0067, 80.2577, 30, 78, 88, 540, 442.8, 68, 15, 60, 81, '→', '→', '→', 'Moderate conditions', 'Maintain current practices'),
  ('Central Chennai', 'Urban Core', 13.0827, 80.2707, 34, 70, 156, 980, 803.6, 59, 5, 80, 147, '↑', '↑', '→', 'Temperature rising', 'Increase cooling infrastructure'),
  ('Velachery', 'Suburban Mix', 12.9750, 80.2207, 31.5, 73, 115, 720, 590.4, 62, 7, 70, 108, '→', '↑', '↑', 'Energy consumption increasing', 'Optimize power usage'),
  ('Tambaram', 'Industrial South', 12.9249, 80.1000, 32.5, 69, 125, 890, 730.2, 57, 6, 90, 133.5, '↑', '→', '↑', 'Moderate pollution levels', 'Improve industrial filters'),
  ('Porur', 'Expanding Suburb', 13.0358, 80.1560, 31, 71, 108, 650, 533, 65, 9, 65, 97.5, '→', '↓', '→', 'Sustainable growth pattern', 'Continue balanced development'),
  ('Guindy', 'Mixed Use', 13.0067, 80.2206, 30.5, 74, 102, 710, 582.2, 66, 11, 50, 106.5, '→', '→', '↑', 'Stable environmental metrics', 'Maintain monitoring'),
  ('Nungambakkam', 'Upscale Residential', 13.0569, 80.2426, 31.8, 69, 95, 680, 557.6, 70, 8, 40, 102, '→', '↓', '→', 'Good air quality', 'Sustain green spaces'),
  ('Industrial Belt', 'Manufacturing Zone', 13.1185, 80.2072, 31.96, 70, 120, 662, 543, 56, 7, 110, 99.3, '→', '↑', '↑', 'Air quality may worsen', 'Consider energy efficiency measures'),
  ('Sholinganallur', 'Tech & Residential', 12.9008, 80.2279, 32.2, 76, 118, 780, 639.6, 61, 9, 85, 117, '↑', '↑', '→', 'Growing energy demand', 'Implement smart grid solutions')
ON CONFLICT DO NOTHING;

-- Create function to auto-update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update timestamp
CREATE TRIGGER update_chennai_environment_status_timestamp
  BEFORE UPDATE ON public.chennai_environment_status
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated_column();

-- Grant necessary permissions
GRANT SELECT ON public.chennai_environment_status TO anon, authenticated;
GRANT INSERT, UPDATE ON public.chennai_environment_status TO authenticated;

-- Create chennai_environment_status table
CREATE TABLE IF NOT EXISTS public.chennai_environment_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL UNIQUE,
  zone_region TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  temperature DECIMAL(5, 2) NOT NULL,
  aqi INTEGER NOT NULL,
  energy_consumption DECIMAL(10, 2) NOT NULL,
  carbon_emission DECIMAL(10, 2) NOT NULL,
  sustainability_score INTEGER NOT NULL CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  trend_temperature TEXT DEFAULT '→',
  trend_aqi TEXT DEFAULT '→',
  trend_energy TEXT DEFAULT '→',
  prediction_tomorrow TEXT,
  ai_suggestion TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.chennai_environment_status ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON public.chennai_environment_status
  FOR SELECT
  TO public
  USING (true);

-- Create policy for service role write access
CREATE POLICY "Allow service role write access"
  ON public.chennai_environment_status
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_zone_name ON public.chennai_environment_status(zone_name);
CREATE INDEX IF NOT EXISTS idx_last_updated ON public.chennai_environment_status(last_updated DESC);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.chennai_environment_status;

-- Insert initial 5 Chennai zones
INSERT INTO public.chennai_environment_status (
  zone_name, 
  zone_region, 
  latitude, 
  longitude, 
  temperature, 
  aqi, 
  energy_consumption, 
  carbon_emission, 
  sustainability_score,
  prediction_tomorrow,
  ai_suggestion
) VALUES
  (
    'North Chennai',
    'Industrial & Port Area',
    13.1482,
    80.2619,
    32.0,
    145,
    1250.0,
    1025.0,
    52,
    'Temperature expected to rise by 2°C, AQI may worsen due to industrial activity',
    'Increase renewable energy adoption. Monitor air quality closely in industrial zones.'
  ),
  (
    'Central Chennai',
    'Urban Core & Commercial',
    13.0827,
    80.2707,
    31.5,
    98,
    850.0,
    697.0,
    68,
    'Stable conditions expected, slight increase in energy demand during peak hours',
    'Optimize energy consumption during peak hours. Consider demand-side management.'
  ),
  (
    'South Chennai',
    'IT Corridor & Residential',
    12.9249,
    80.2270,
    33.0,
    132,
    1450.0,
    1189.0,
    58,
    'Energy consumption likely to spike due to IT sector demand',
    'Implement solar rooftop solutions. Encourage green buildings in IT parks.'
  ),
  (
    'OMR / IT Corridor',
    'Technology Hub',
    12.9352,
    80.2430,
    34.5,
    168,
    2100.0,
    1722.0,
    45,
    'High energy demand expected. AQI may deteriorate without intervention',
    'Critical: Deploy air purifiers in office spaces. Switch to electric vehicle fleet.'
  ),
  (
    'Industrial Belt',
    'Manufacturing Zone',
    13.1143,
    80.1548,
    35.0,
    185,
    2500.0,
    2050.0,
    38,
    'Sustained high emissions forecasted. Immediate action required',
    'Urgent: Implement emission control systems. Transition to cleaner fuel sources.'
  )
ON CONFLICT (zone_name) DO NOTHING;

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update last_updated
CREATE TRIGGER set_last_updated
  BEFORE UPDATE ON public.chennai_environment_status
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();

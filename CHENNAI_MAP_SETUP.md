# 🚀 Chennai Real-Time Environmental Map Setup Guide

This guide will help you set up the real-time Chennai Environmental Status Map with Supabase.

## 📋 Prerequisites

- Supabase account and project
- API keys:
  - OpenWeather API key (optional, for weather data)
  - IQAir API key (optional, for air quality data)

## 🗄️ Step 1: Create the Database Table

Run the SQL migration to create the `chennai_environment_status` table:

```sql
-- Navigate to your Supabase project → SQL Editor
-- Copy and paste the contents of:
supabase/migrations/20260217_chennai_environment_status.sql
```

This will:
- ✅ Create the table with all required fields
- ✅ Enable Row Level Security (RLS)
- ✅ Set up read/write policies
- ✅ Enable real-time subscriptions
- ✅ Insert 5 Chennai zones with initial data

## ⚙️ Step 2: Deploy the Edge Function

Deploy the Chennai Status Updater Edge Function:

```bash
# Navigate to project directory
cd greenstream-ai

# Deploy the function
npx supabase functions deploy chennai-status-updater
```

### Set Environment Variables

In Supabase Dashboard → Edge Functions → Secrets, add:

```
OPENWEATHER_API_KEY=your_openweather_api_key
IQAIR_API_KEY=your_iqair_api_key
```

> **Note**: These API keys are optional. The function will work with simulated data if keys are not provided.

## 🔄 Step 3: Set Up Automatic Updates

### Option A: Using Supabase Cron (Recommended)

Create a schedule to run the updater every 5 minutes:

```sql
-- In Supabase SQL Editor
SELECT cron.schedule(
    'chennai-status-update',
    '*/5 * * * *',  -- Every 5 minutes
    $$
    SELECT net.http_post(
        url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/chennai-status-updater',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) AS request_id;
    $$
);
```

### Option B: Manual Testing

Test the Edge Function manually:

```bash
curl -L -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/chennai-status-updater' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## 🌐 Step 4: Update Frontend Configuration

The frontend is already configured to use the Supabase client. Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## ✅ Verification

Visit http://localhost:8080/dashboard/map

You should see:
- ✅ 5 Chennai zones on the map
- ✅ Real-time data updates every 5 seconds
- ✅ Animated popups with trends and AI suggestions
- ✅ Floating legend with color coding
- ✅ Live update indicator

## 🎨 Features

### Map Modes
- **Sustainability Score**: Overall environmental health (default)
- **Temperature**: Heat distribution across zones
- **Air Quality (AQI)**: Pollution levels
- **Energy Consumption**: Power usage patterns

### Interactive Elements
- Click any zone for detailed insights
- View trend arrows (↑ ↓ →) for all metrics
- See tomorrow's predictions
- Get AI-powered recommendations
- Real-time updates with live indicator

### 5 Chennai Zones

1. **North Chennai** - Industrial & Port Area
2. **Central Chennai** - Urban Core & Commercial
3. **South Chennai** - IT Corridor & Residential
4. **OMR / IT Corridor** - Technology Hub
5. **Industrial Belt** - Manufacturing Zone

## 🔧 Troubleshooting

### Data Not Showing

1. Check if table exists:
```sql
SELECT * FROM chennai_environment_status;
```

2. Verify real-time is enabled:
```sql
SELECT * FROM pg_publication_tables 
WHERE tablename = 'chennai_environment_status';
```

### Edge Function Not Updating

1. Check function logs in Supabase Dashboard
2. Verify environment variables are set
3. Test function manually with curl

### Frontend Not Receiving Updates

1. Check browser console for WebSocket errors
2. Verify Supabase URL and Anon Key in `.env`
3. Clear browser cache and reload

## 📊 Data Flow

```
Edge Function (every 5 min)
    ↓
Fetches API data (Weather + AQI)
    ↓
Calculates zone metrics
    ↓
Updates Supabase table
    ↓
Real-time broadcast
    ↓
Frontend auto-updates (5s polling + WebSocket)
```

## 🎯 Production Checklist

- [ ] Supabase table created and populated
- [ ] Edge Function deployed
- [ ] Environment variables set
- [ ] Cron job scheduled
- [ ] Real-time enabled on table
- [ ] Frontend `.env` configured
- [ ] API keys added (optional)
- [ ] Test all map modes
- [ ] Verify popups and animations
- [ ] Check real-time updates

## 🏆 Smart City Control Center Experience

Your map now:
- ✨ Auto-updates in real-time
- 🎨 Has smooth Framer Motion animations
- 🤖 Provides AI-powered insights
- 📈 Shows trend analysis with arrows
- 🔮 Makes predictions for tomorrow
- 🌈 Uses color-coded sustainability scoring

Perfect for impressing hackathon judges! 🚀

## 📚 Additional Resources

- [Supabase Real-time Docs](https://supabase.com/docs/guides/realtime)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

**Need Help?** Check the Supabase logs or browser console for detailed error messages.

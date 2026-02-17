# 🗺️ Environmental Map Feature - GreenStream AI

## Overview

A comprehensive interactive environmental monitoring map for Chennai, Tamil Nadu, featuring real-time data visualization, AI-powered insights, and multi-metric analysis.

## 🚀 Features Implemented

### Core Functionality
- ✅ **Google Maps Integration** with dark theme
- ✅ **Interactive Zone Visualization** - 12 Chennai zones with live data
- ✅ **Multi-Mode Display** - Temperature, AQI, and Energy views
- ✅ **AI Insight Panel** - Click zones for intelligent analysis
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Smooth Transitions** - Between different metric modes
- ✅ **Real-time Statistics** - Sidebar with live aggregated data

### Components Created

#### 1. **EnvironmentalMap** (`src/components/map/EnvironmentalMap.tsx`)
Main map component with:
- Google Maps API integration
- Dark theme styling
- Colored zone circles based on selected metric
- Dynamic circle sizing based on intensity
- Hover tooltips with zone details
- Click handlers for AI insights
- Smooth animations and transitions

#### 2. **MapControls** (`src/components/map/MapControls.tsx`)
Toggle buttons for:
- 🌡️ Temperature mode
- 💨 Air Quality Index mode
- ⚡ Energy consumption mode
- Gradient backgrounds
- Active state highlighting

#### 3. **MapLegend** (`src/components/map/MapLegend.tsx`)
Dynamic legend showing:
- Color-coded ranges for current metric
- Status labels (Good, Moderate, Unhealthy, etc.)
- Measurement units
- Real-time mode indicator

#### 4. **AIInsightPanel** (`src/components/map/AIInsightPanel.tsx`)
Intelligent analysis panel featuring:
- 🧠 AI-generated insights
- Severity indicators (High/Medium/Low)
- Live metrics grid (Temperature, AQI, Energy, Carbon)
- Actionable recommendations
- Correlation detection
- Beautiful gradient design

### Data & Logic

#### 5. **Map Data Module** (`src/lib/mapData.ts`)
- 12 Chennai zones with real coordinates
- Simulated environmental data
- Color mapping functions
- Circle radius calculations
- AI insight generation algorithm

#### 6. **Type Definitions** (`src/types/map.ts`)
- ZoneData interface
- MapMode types
- AIInsight structure
- MapLegendItem type

### Main Page

#### 7. **DashboardMap** (`src/pages/DashboardMap.tsx`)
Full-featured dashboard with:
- Header with navigation
- Statistics sidebar
- Live data badges
- Responsive grid layout
- Integration of all components

---

## 📍 Chennai Zones Monitored

1. **T. Nagar** - Commercial Hub
2. **Anna Nagar** - Residential
3. **Velachery** - Mixed Development
4. **OMR (Thoraipakkam)** - IT Corridor
5. **Adyar** - Coastal Residential
6. **Tambaram** - Industrial
7. **Mylapore** - Heritage & Coastal
8. **Guindy** - Industrial Park
9. **Porur** - Suburban Residential
10. **Nungambakkam** - Urban Core
11. **ECR (Palavakkam)** - Coastal Tourist
12. **Ambattur** - Industrial Estate

---

## 🎨 Visual Features

### Color Coding

**Temperature:**
- 🟢 Green: < 29°C (Cool)
- 🟡 Yellow: 29-31°C (Warm)
- 🟠 Amber: 31-33°C (Hot)
- 🟠 Orange: 33-35°C (Very Hot)
- 🔴 Red: ≥ 35°C (Extreme)

**AQI:**
- 🟢 Green: 0-50 (Good)
- 🟡 Amber: 51-100 (Moderate)
- 🔴 Red: 101-150 (Unhealthy)
- 🟣 Purple: ≥ 151 (Very Unhealthy)

**Energy:**
- 🟢 Emerald: < 300 kWh (Low)
- 🟢 Lime: 300-500 kWh (Moderate)
- 🟡 Yellow: 500-750 kWh (High)
- 🟠 Orange: 750-1000 kWh (Very High)
- 🔴 Red: ≥ 1000 kWh (Critical)

### Dark Theme
- Elegant dark map styling
- High contrast for visibility
- Glowing accent colors
- Gradient overlays
- Backdrop blur effects

---

## 🧠 AI Insight Engine

The AI system analyzes multiple factors to generate contextual insights:

### Analysis Factors:
1. **Temperature Analysis**
   - Heat wave detection
   - Cooling demand estimation
   - Energy consumption correlation

2. **Air Quality Analysis**
   - Pollution level assessment
   - Health recommendations
   - Industrial impact detection

3. **Energy Analysis**
   - Peak load identification
   - Usage pattern recognition
   - Efficiency suggestions

4. **Correlation Detection**
   - Temperature-Energy relationships
   - Coastal wind impact on AQI
   - Area-specific patterns

### Example AI Insights:
- "Energy is high in OMR due to temperature spike and office peak hours"
- "Industrial activity contributing to elevated AQI levels in Tambaram"
- "Sea breeze from Bay of Bengal helping maintain good air quality in ECR"
- "Extreme heat in Ambattur (35°C) - Consider energy-saving measures"

---

## 🛠️ Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API**
4. Create credentials (API Key)
5. Restrict key to your domain (optional but recommended)

### 2. Configure Environment

Add to `.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Access the Map

Navigate to: **http://localhost:8080/dashboard/map**

Or click "Environmental Map" button in the main dashboard header.

---

## 📱 Usage Guide

### Basic Navigation:
1. **Switch Modes**: Click Temperature, Air Quality, or Energy buttons
2. **View Details**: Hover over any zone to see quick stats
3. **Get AI Insights**: Click on a zone for detailed analysis
4. **Close Insights**: Click X button or click another zone
5. **Zoom/Pan**: Use standard Google Maps controls

### Interpreting the Map:
- **Circle Size**: Larger = Higher intensity
- **Circle Color**: Indicates severity level
- **Statistics Sidebar**: Shows aggregate data
- **Live Updates**: Data refreshes automatically

---

## 🚀 Advanced Features

### Implemented:
✅ Smooth transitions between modes  
✅ Responsive layout (mobile/tablet/desktop)  
✅ Hover tooltips with zone details  
✅ Click-to-analyze AI system  
✅ Dynamic legend updates  
✅ Real-time statistics  
✅ Severity-based recommendations  
✅ Multi-metric correlation detection  

### AI Capabilities:
- Context-aware analysis
- Severity classification (High/Medium/Low)
- Area-specific insights
- Actionable recommendations
- Pattern recognition

---

## 🎯 Performance Optimizations

- **Memo Components**: All map components memoized
- **Efficient Rendering**: Only changed circles re-render
- **Lazy Data**: Statistics calculated on-demand
- **Callback Optimization**: useCallback for event handlers
- **Smooth Animations**: CSS transitions for mode changes

---

## 🔮 Future Enhancements (Optional)

### Potential Additions:
- [ ] Heat map overlay option
- [ ] Time-series playback (24-hour history)
- [ ] Export insights as PDF
- [ ] Real-time data streaming
- [ ] Custom zone creation
- [ ] Comparative analysis mode
- [ ] Alert threshold customization
- [ ] Integration with real weather APIs
- [ ] Predictive modeling overlay
- [ ] Social sharing of insights

---

## 📊 Technical Details

### Stack:
- **React 18** with TypeScript
- **@react-google-maps/api** for map integration
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **shadcn/ui** components

### File Structure:
```
src/
├── components/map/
│   ├── EnvironmentalMap.tsx      (Main map with Google Maps)
│   ├── MapControls.tsx            (Mode toggle buttons)
│   ├── MapLegend.tsx              (Dynamic legend)
│   └── AIInsightPanel.tsx         (AI analysis panel)
├── pages/
│   └── DashboardMap.tsx           (Main page layout)
├── lib/
│   └── mapData.ts                 (Data & algorithms)
└── types/
    └── map.ts                     (TypeScript types)
```

---

## 🐛 Troubleshooting

### Map not loading?
- Check Google Maps API key in `.env`
- Verify API is enabled in Google Cloud Console
- Check browser console for errors

### No insights appearing?
- Click directly on zone circles (not between them)
- Ensure JavaScript is enabled
- Check network connection

### Colors not showing?
- Try switching between modes
- Refresh the page
- Clear browser cache

---

## 📝 Notes

- **Data**: Currently simulated for demonstration
- **Updates**: Can be connected to real APIs
- **Scalability**: Designed to handle 50+ zones
- **Extensibility**: Easy to add new metrics
- **Customization**: All colors and thresholds configurable

---

## 🎉 Credits

Built for **GreenStream AI** - Advanced Environmental Monitoring System  
Location: **Chennai, Tamil Nadu, India**  
Feature: **Interactive Environmental Mapping with AI Insights**

---

**For support or questions, refer to the main project documentation.**

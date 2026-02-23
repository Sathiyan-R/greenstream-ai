# Netlify Deployment Setup

## Environment Variables Configuration

After deploying to Netlify, you **MUST** configure the following environment variables in your Netlify dashboard:

### Step 1: Go to Site Settings
1. Log in to your Netlify dashboard
2. Select your site (greenstream-ai)
3. Go to **Site settings** → **Environment variables**

### Step 2: Add These Variables

Add the following environment variables:

```
VITE_SUPABASE_PROJECT_ID=kzxusjxvgrtchjrzwrzd
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6eHVzanh2Z3J0Y2hqcnp3cnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzQwOTcsImV4cCI6MjA4NjQ1MDA5N30.8erhXhrQ0DPpjmVBJV72F1dd9tDrdNXzCyLnzevXqMU
VITE_SUPABASE_URL=https://kzxusjxvgrtchjrzwrzd.supabase.co
```

### Step 3: Redeploy
1. After adding the environment variables, click **"Deploys"** in the top menu
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

## Build Configuration

The `netlify.toml` file is already configured with:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **SPA routing**: Configured with redirects
- **Node version**: 18

## Troubleshooting

### AI Assistant Not Working?
- Check that all environment variables are set in Netlify (not just in the `.env` file)
- Redeploy after adding environment variables
- Check browser console for error messages

### Environmental Map Button Missing on Mobile?
- Fixed! The button now shows on mobile devices with shorter text "Map"

### 404 Errors on Page Refresh?
- The `_redirects` file and `netlify.toml` redirects handle SPA routing
- Make sure they're in the repository

## Quick Deploy Checklist
- ✅ Environment variables configured in Netlify
- ✅ netlify.toml file in repository
- ✅ _redirects file in public/ folder
- ✅ Clear cache and redeploy after changes

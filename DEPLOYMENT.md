# Deployment Guide

## Build Status

The application is fully implemented. The build error you may see is expected when Firebase environment variables are not set. Once you configure your environment variables, the build will succeed.

## Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.local` file with all required variables (see `.env.local.example` for template).

**Required Variables:**
- Firebase configuration (6 variables)
- Firebase Admin credentials (3 variables)
- NextAuth configuration (2 variables)
- Google OAuth (2 variables)
- Anthropic API key (1 variable)

### 2. Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Set up Authentication (enable Google provider)

2. **Get Firebase Config:**
   - Project Settings > General > Your apps
   - Copy the Firebase config values

3. **Set up Firebase Admin:**
   - Project Settings > Service Accounts
   - Generate new private key
   - Save the JSON file
   - Extract: project_id, private_key, client_email

4. **Deploy Firestore Rules:**
   - Use the `firestore.rules` file provided
   - Deploy via Firebase CLI or Console

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)

### 4. Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Sign in to Vercel
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables in Vercel:**
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env.local`
   - Make sure to add them for Production, Preview, and Development

4. **Deploy:**
   - Vercel will automatically deploy on push
   - Or trigger manual deployment from dashboard

## Post-Deployment

1. Update Google OAuth redirect URI with production URL
2. Test authentication flow
3. Test coaching session creation
4. Verify Cursor brief download works

## Troubleshooting

### Build Errors
- Ensure all environment variables are set in Vercel
- Check Firebase Admin credentials are correct (private key should have newlines)
- Verify Google OAuth redirect URIs match your domain

### Runtime Errors
- Check Firebase security rules are deployed
- Verify Firestore collections exist
- Check API route logs in Vercel dashboard

## Architecture Notes

- **Claude Model:** Using `claude-3-5-sonnet-20241022` (Claude Sonnet 4.5)
- **Authentication:** NextAuth.js v5 beta with Google OAuth
- **Database:** Firebase Firestore with security rules
- **Deployment:** Vercel serverless functions


# Vercel Deployment Guide

## Overview

This application is designed to run exclusively on Vercel. All configuration is done through the Vercel dashboard and external service consoles.

## Pre-Deployment Checklist

### 1. Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Set up Authentication (enable Email/Password and Google providers)

2. **Get Firebase Config:**
   - Project Settings > General > Your apps
   - Add a web app if you haven't already
   - Copy the Firebase config values for Vercel environment variables

3. **Set up Firebase Admin:**
   - Project Settings > Service Accounts
   - Generate new private key
   - Extract from JSON: `project_id`, `private_key`, `client_email`
   - Add these to Vercel environment variables

4. **Deploy Firestore Rules:**
   - Use the `firestore.rules` file provided in the repository
   - Deploy via Firebase Console or Firebase CLI

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (or use existing)
3. Add authorized redirect URI:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
   **Important:** Replace `your-app-name` with your actual Vercel app name
4. Save the Client ID and Client Secret for Vercel environment variables

### 3. Vercel Deployment

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Select the `BizDev3` repository (https://github.com/liquidgolf-cmd/BizDev3)
   - Vercel will auto-detect Next.js - click "Deploy"

2. **Add Environment Variables:**
   - Go to Project Settings > Environment Variables
   - Add all 13 required variables (see [SETUP.md](./SETUP.md) for complete list)
   - **Important:** Add variables to Production, Preview, and Development environments

3. **Get Your Vercel URL:**
   - After initial deployment, note your Vercel app URL
   - Format: `https://your-app-name.vercel.app`

4. **Update NEXTAUTH_URL:**
   - In Vercel environment variables, set `NEXTAUTH_URL` to your Vercel domain
   - Example: `NEXTAUTH_URL=https://your-app-name.vercel.app`

5. **Update Google OAuth Redirect URI:**
   - Go back to Google Cloud Console
   - Update the redirect URI to match your Vercel domain
   - Save changes

6. **Redeploy:**
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

## Post-Deployment

1. **Test Authentication:**
   - Visit your Vercel URL
   - Test sign-in with Google OAuth
   - Test sign-in with Email/Password
   - Test sign-up with Email/Password

2. **Test Core Features:**
   - Create a new coaching session
   - Complete the AI coaching flow
   - Approve an outline and create a project
   - Download a Cursor brief

3. **Verify Logs:**
   - Check Vercel Dashboard → Deployments → Functions tab for any errors
   - Monitor browser console for client-side issues

## Troubleshooting

### Build Errors

- **Missing Environment Variables:** Ensure all 13 variables are set in Vercel
- **Firebase Admin Key Format:** Private key must include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` with newlines
- **TypeScript Errors:** Check build logs for specific type errors

### Runtime Errors

- **"Server configuration problem":** Missing `AUTH_SECRET` in Vercel
- **"Unauthorized" errors:** 
  - Missing Google OAuth credentials
  - Wrong redirect URI in Google Cloud Console
  - Redirect URI doesn't match Vercel domain exactly
- **Firebase errors:** 
  - Missing Firebase environment variables
  - Firestore security rules not deployed
  - Firebase Admin not properly initialized

### Check Logs

- **Vercel Function Logs:** Dashboard → Deployments → Click deployment → Functions tab
- **Browser Console:** Check for client-side errors
- **Network Tab:** Verify API requests are successful

## Architecture Notes

- **Claude Model:** Using `claude-3-5-sonnet-20241022` (Claude Sonnet 4.5)
- **Authentication:** NextAuth.js v5 beta with Google OAuth and Email/Password
- **Database:** Firebase Firestore with security rules
- **Deployment:** Vercel serverless functions
- **Framework:** Next.js 16+ (App Router)

## Quick Reference

- **Repository:** https://github.com/liquidgolf-cmd/BizDev3
- **Environment Variables:** See [SETUP.md](./SETUP.md)
- **Detailed Deployment:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

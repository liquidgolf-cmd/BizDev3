# Vercel Environment Variables Setup Guide

## Overview

This application runs exclusively on Vercel. All environment variables must be configured in the Vercel dashboard.

## Step 1: Access Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your **BizDev3** project
3. Navigate to **Settings** → **Environment Variables**

## Step 2: Add Required Environment Variables

Add each variable below for **Production**, **Preview**, and **Development** environments:

### NextAuth Configuration

```env
AUTH_SECRET=your-secret-key-here
```

**Generate a secret:**
- Visit [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- Or run: `openssl rand -base64 32`

### Google OAuth

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Firebase Client Configuration (Public)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase Admin SDK (Server-side)

```env
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Important:** For `FIREBASE_ADMIN_PRIVATE_KEY`, copy the ENTIRE key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` with newlines.

### Anthropic Claude API

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### NextAuth URL

```env
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Important:** Replace `your-app-name` with your actual Vercel app name. This should match your deployment URL.

## Step 3: Verify All Variables

Ensure you have added **13 total environment variables**:
- 1 AUTH_SECRET
- 2 Google OAuth (CLIENT_ID, CLIENT_SECRET)
- 6 Firebase Client (NEXT_PUBLIC_*)
- 3 Firebase Admin
- 1 Anthropic API Key
- 1 NEXTAUTH_URL

## Step 4: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

## Common Issues

### "Server configuration problem"
- **Cause:** Missing `AUTH_SECRET`
- **Fix:** Add `AUTH_SECRET` to Vercel environment variables

### "Unauthorized" errors
- **Cause:** Missing Google OAuth credentials or wrong redirect URI
- **Fix:** 
  - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
  - Check Google OAuth redirect URI matches your Vercel domain

### Firebase errors
- **Cause:** Missing Firebase environment variables
- **Fix:** Verify all 9 Firebase variables are added (6 client + 3 admin)

### Build fails
- **Cause:** Missing required environment variables
- **Fix:** Check Vercel build logs for specific missing variables

## Testing

After redeploying with all environment variables:

1. Visit your Vercel URL (e.g., `https://your-app-name.vercel.app`)
2. Test sign-in with Google or Email/Password
3. Test creating a new coaching session
4. Check Vercel function logs if there are issues

## Getting Help

- Check Vercel Dashboard → **Deployments** → Click deployment → **Functions** tab for logs
- Review browser console for client-side errors
- See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment guide

# Vercel Deployment Guide

## Step 1: Connect GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Select the **`BizDev3`** repository (https://github.com/liquidgolf-cmd/BizDev3)
4. Vercel will auto-detect Next.js - click **"Deploy"** (we'll add environment variables next)

## Step 2: Add Environment Variables in Vercel

After the initial deployment, go to your project settings:

1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add each variable for **Production**, **Preview**, and **Development** environments:

### Required Environment Variables:

```env
# NextAuth (REQUIRED)
AUTH_SECRET=2u0RHZxSQyGwh328kxGBDgJMboykp/iBlHUkiAwH8y4=

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-...

# NextAuth URL (Update after deployment)
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Important Notes:

- **AUTH_SECRET**: Use the same secret you generated (or generate a new one)
- **FIREBASE_ADMIN_PRIVATE_KEY**: Copy the ENTIRE key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` with newlines
- **NEXTAUTH_URL**: After deployment, Vercel will give you a URL. Update this variable with your actual Vercel URL
- Add variables to **all three environments** (Production, Preview, Development)

## Step 3: Update Google OAuth Settings

After you get your Vercel URL:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
5. Save changes

## Step 4: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

## Step 5: Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-app-name.vercel.app`)
2. Test the sign-in flow
3. Check browser console for any errors
4. Check Vercel function logs if there are issues

## Troubleshooting

### Common Issues:

1. **"Server configuration problem"** → Missing `AUTH_SECRET`
2. **"Unauthorized" errors** → Missing Google OAuth credentials or wrong redirect URI
3. **Firebase errors** → Missing Firebase environment variables
4. **Build fails** → Check build logs in Vercel dashboard

### Check Logs:

- Vercel Dashboard → Your Project → **Deployments** → Click on deployment → **Functions** tab
- Check serverless function logs for API route errors

## Quick Checklist

- [ ] Repository connected to Vercel
- [ ] All environment variables added (13 total)
- [ ] Google OAuth redirect URI updated
- [ ] NEXTAUTH_URL set to Vercel domain
- [ ] Redeployed after adding variables
- [ ] Tested sign-in flow
- [ ] Tested creating a new project


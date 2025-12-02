# Fix Google OAuth Redirect URI Mismatch Error

## The Problem

Error 400: `redirect_uri_mismatch` means the redirect URI in Google Cloud Console doesn't match what NextAuth is sending from your Vercel deployment.

## The Solution

### Step 1: Find Your Correct Redirect URI

NextAuth uses this format for Google OAuth on Vercel:
```
https://your-app-name.vercel.app/api/auth/callback/google
```

**Important:** Replace `your-app-name` with your actual Vercel app name.

### Step 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (the one you're using for this app)
5. Click **Edit** (pencil icon)
6. Under **Authorized redirect URIs**, add:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
   **Important:** Replace `your-app-name` with your actual Vercel app name!
7. Click **Save**
8. Wait 1-2 minutes for changes to propagate

### Step 3: Verify Vercel Environment Variables

Make sure these are set correctly in Vercel Dashboard → Settings → Environment Variables:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Important:** 
- `NEXTAUTH_URL` must match your Vercel domain exactly
- Replace `your-app-name` with your actual Vercel app name
- Add variables to Production, Preview, and Development environments

### Step 4: Redeploy on Vercel

After updating Google OAuth settings:

1. Go to Vercel Dashboard → Deployments
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 5: Test

1. Visit your Vercel URL (e.g., `https://your-app-name.vercel.app`)
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. You should be redirected back to your app and signed in

## Common Issues

1. **Missing protocol**: Make sure to include `https://` (not `http://`)
2. **Trailing slash**: Don't add a trailing slash (no `/` at the end)
3. **Wrong domain**: Must match your Vercel domain exactly
4. **Case sensitivity**: URIs are case-sensitive
5. **Not saved**: Make sure you clicked "Save" in Google Cloud Console
6. **Propagation delay**: Wait 1-2 minutes after saving for changes to take effect

## Quick Checklist

- [ ] Added `https://your-app-name.vercel.app/api/auth/callback/google` to Google Console
- [ ] Replaced `your-app-name` with your actual Vercel app name
- [ ] Verified `GOOGLE_CLIENT_ID` is correct in Vercel environment variables
- [ ] Verified `GOOGLE_CLIENT_SECRET` is correct in Vercel environment variables
- [ ] Verified `NEXTAUTH_URL` matches your Vercel domain in Vercel environment variables
- [ ] Saved changes in Google Cloud Console
- [ ] Waited 1-2 minutes for changes to propagate
- [ ] Redeployed on Vercel
- [ ] Tested sign-in with Google

## Still Not Working?

1. **Check the exact error** in browser console
2. **Verify the redirect URI** in Google Console matches exactly:
   - Protocol: `https://` (not `http://`)
   - Domain: Your exact Vercel domain
   - Path: `/api/auth/callback/google`
   - No trailing slash
3. **Check Vercel environment variables:**
   - `NEXTAUTH_URL` must match your Vercel domain
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be correct
4. **Check Vercel function logs:**
   - Vercel Dashboard → Deployments → Click deployment → Functions tab
5. **Wait a few minutes** - Google changes can take a moment to propagate
6. **Verify you're editing the correct OAuth client** in Google Cloud Console

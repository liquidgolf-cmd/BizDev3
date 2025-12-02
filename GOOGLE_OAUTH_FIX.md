# Fix Google OAuth Redirect URI Mismatch Error

## The Problem
Error 400: `redirect_uri_mismatch` means the redirect URI in Google Cloud Console doesn't match what NextAuth is sending.

## The Solution

### Step 1: Find Your Correct Redirect URI

NextAuth uses this format for Google OAuth:
- **Local development**: `http://localhost:3000/api/auth/callback/google`
- **Production (Vercel)**: `https://your-app-name.vercel.app/api/auth/callback/google`

### Step 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (the one you're using for this app)
5. Click **Edit** (pencil icon)
6. Under **Authorized redirect URIs**, add these URIs:

#### For Local Development:
```
http://localhost:3000/api/auth/callback/google
```

#### For Production (Vercel):
```
https://your-app-name.vercel.app/api/auth/callback/google
```

**Important**: Replace `your-app-name` with your actual Vercel app name!

7. Click **Save**

### Step 3: Verify Environment Variables

Make sure these are set correctly:

**Local (.env.local):**
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
```

**Vercel (Environment Variables):**
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Step 4: Common Issues

1. **Missing protocol**: Make sure to include `http://` or `https://`
2. **Trailing slash**: Don't add a trailing slash (no `/` at the end)
3. **Wrong port**: Local development must use port 3000 (or whatever port you're using)
4. **Case sensitivity**: URIs are case-sensitive
5. **Multiple environments**: Add both local AND production URIs to Google Console

### Step 5: Test

1. Clear browser cache/cookies for localhost
2. Restart your dev server: `npm run dev`
3. Try signing in with Google again

## Quick Checklist

- [ ] Added `http://localhost:3000/api/auth/callback/google` to Google Console
- [ ] Added your Vercel URL `https://your-app.vercel.app/api/auth/callback/google` to Google Console
- [ ] Verified `GOOGLE_CLIENT_ID` is correct in `.env.local`
- [ ] Verified `GOOGLE_CLIENT_SECRET` is correct in `.env.local`
- [ ] Verified `NEXTAUTH_URL` matches your current environment
- [ ] Saved changes in Google Console
- [ ] Restarted dev server

## Still Not Working?

1. **Check the exact error** in browser console
2. **Verify the redirect URI** NextAuth is using matches exactly (including protocol, port, path)
3. **Wait a few minutes** - Google changes can take a moment to propagate
4. **Check Google Console** - Make sure you're editing the correct OAuth client


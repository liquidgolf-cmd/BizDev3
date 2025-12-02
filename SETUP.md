# Quick Setup Guide

## Fixing the "Failed to start project" Error

The error you're seeing is because **NextAuth requires an `AUTH_SECRET` environment variable**.

### Quick Fix:

1. **Create a `.env.local` file** in the `bizdev-app` directory (if it doesn't exist)

2. **Add this line** to `.env.local`:
   ```env
   AUTH_SECRET=ZEH2YaXnnA89+B4D5qmmM5kEzkUoS5qG+KTNTxN6/tI=
   ```
   
   Or generate your own with:
   ```bash
   openssl rand -base64 32
   ```

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

### Complete Environment Variables Needed

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add:
- `AUTH_SECRET` (required for NextAuth)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (for Google OAuth)
- All Firebase configuration variables
- `ANTHROPIC_API_KEY` (for Claude AI)

### Common Issues:

1. **"Server configuration problem"** → Missing `AUTH_SECRET`
2. **"Unauthorized" errors** → Missing Google OAuth credentials
3. **Firebase errors** → Missing Firebase environment variables

### Testing:

After setting up `.env.local`, restart the dev server and try:
- Sign in with Google
- Start a new coaching session

If you still see errors, check the browser console and terminal for specific error messages.


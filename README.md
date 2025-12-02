# BizDev - AI-Powered Web Project Planning

A Business Development web app that helps users create strategic web project outlines through AI coaching sessions, then generates Cursor-ready build briefs.

## Features

- **AI Coaching Agent**: Guided discovery sessions using Claude Sonnet 4.5 to understand project requirements
- **Project Management**: Create, view, and manage multiple projects
- **Cursor Brief Generation**: Download markdown files ready for use in Cursor IDE
- **Google OAuth**: Secure authentication with Google
- **Firebase Integration**: Real-time data storage with Firestore

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Anthropic Claude API (Sonnet 4.5)

## Deployment

This application is designed to run exclusively on Vercel. All setup and configuration is done through the Vercel dashboard.

### 1. Connect to Vercel

1. Push your code to GitHub (repository: https://github.com/liquidgolf-cmd/BizDev3)
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" and select the `BizDev3` repository
4. Vercel will auto-detect Next.js - click "Deploy"

### 2. Environment Variables

Add all environment variables in Vercel Dashboard → Settings → Environment Variables:

```env
# NextAuth (REQUIRED)
AUTH_SECRET=your-secret-key-here

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

# NextAuth URL (Set to your Vercel domain)
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Important:** Add variables to **Production**, **Preview**, and **Development** environments.

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication (Email/Password and Google providers)
4. Set up Firebase Admin SDK:
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Extract credentials for Vercel environment variables
5. Deploy Firestore security rules using the `firestore.rules` file

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`
   - Replace `your-app-name` with your actual Vercel app name
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel environment variables

### 5. Deploy

After adding all environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Project Structure

```
bizdev-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx
├── components/             # React components
│   ├── coaching/          # Coaching UI components
│   ├── dashboard/         # Dashboard components
│   └── providers/         # Context providers
├── lib/                    # Utilities
│   ├── firebase/          # Firebase config & helpers
│   ├── anthropic/         # Claude API client
│   ├── agents/            # Coaching agent logic
│   └── services/          # Business logic services
├── types/                  # TypeScript definitions
├── hooks/                  # Custom React hooks
└── public/                 # Static assets
```


## Usage

1. **Sign In**: Use Google OAuth or Email/Password to authenticate
2. **Start Coaching**: Click "New Project" to begin a coaching session
3. **Answer Questions**: The AI coach will guide you through discovery
4. **Review Outline**: Once generated, review and approve or request revisions
5. **Download Brief**: After approval, download the Cursor-ready build brief
6. **Use in Cursor**: Open the brief file in Cursor IDE to build your project

## API Routes

- `POST /api/coaching/start` - Start new coaching session
- `POST /api/coaching/[sessionId]/chat` - Send message to coach
- `POST /api/coaching/[sessionId]/approve` - Approve outline and create project
- `POST /api/coaching/[sessionId]/revise` - Request outline revision
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `GET /api/projects/[id]/cursor-brief` - Download Cursor brief

## License

MIT

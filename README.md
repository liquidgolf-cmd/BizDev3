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

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Firebase Admin SDK:
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Add the credentials to your `.env.local`

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## Usage

1. **Sign In**: Use Google OAuth to authenticate
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

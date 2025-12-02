import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase/config';

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
  throw new Error(
    'AUTH_SECRET or NEXTAUTH_SECRET environment variable is required. ' +
    'Generate one with: openssl rand -base64 32'
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!firebaseAuth) {
          throw new Error('Firebase Auth not initialized');
        }

        try {
          // Try to sign in with email/password
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            credentials.email as string,
            credentials.password as string
          );

          const user = userCredential.user;
          
          return {
            id: user.uid,
            email: user.email!,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            image: user.photoURL || undefined,
          };
        } catch (error: any) {
          // If user doesn't exist, return null (don't create account here)
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  trustHost: true, // Required for Vercel deployment
  debug: process.env.NODE_ENV === 'development',
});


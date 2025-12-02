import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

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
  },
  trustHost: true, // Required for Vercel deployment
  debug: process.env.NODE_ENV === 'development',
});


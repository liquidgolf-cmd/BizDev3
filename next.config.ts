import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply CSP to all routes except auth routes (which need more permissive CSP for OAuth)
        source: '/:path((?!auth|api/auth).)*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.gstatic.com https://*.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' 'unsafe-inline' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com",
              "frame-src 'self' https://accounts.google.com https://*.google.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // More permissive CSP for auth pages to allow Google OAuth
        source: '/auth/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'sha256-5hKvs6nIqAAqpN3fHGmSkewwrK1XUZ/P5X5n9twEN+8=' https://accounts.google.com https://apis.google.com https://www.gstatic.com https://*.googleapis.com https://*.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' 'unsafe-inline' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://*.google.com",
              "frame-src 'self' https://accounts.google.com https://*.google.com https://*.googleapis.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // API auth routes - very permissive for OAuth callbacks
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.gstatic.com https://*.googleapis.com https://*.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' 'unsafe-inline' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://*.google.com",
              "frame-src 'self' https://accounts.google.com https://*.google.com https://*.googleapis.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

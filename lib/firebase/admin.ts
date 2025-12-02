import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function initializeAdmin() {
  // Return existing app if already initialized
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized by Firebase Admin
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    adminDb = getFirestore(adminApp);
    return adminApp;
  }

  // Check for required environment variables
  if (
    !process.env.FIREBASE_ADMIN_PROJECT_ID ||
    !process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    !process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  ) {
    console.error('Firebase Admin environment variables are missing');
    return null;
  }

  // Only initialize on server-side
  if (typeof window !== 'undefined') {
    return null;
  }

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    };

    adminApp = initializeApp({
      credential: cert(serviceAccount as any),
    });

    adminDb = getFirestore(adminApp);
    return adminApp;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    return null;
  }
}

// Lazy initialization - initialize when accessed
export function getAdminApp(): App | null {
  return initializeAdmin();
}

export function getAdminDb(): Firestore | null {
  if (!adminDb) {
    initializeAdmin();
  }
  return adminDb;
}

// For backward compatibility
export { adminDb, adminApp };


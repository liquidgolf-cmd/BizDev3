import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

// Only initialize if credentials are available (not during build)
if (
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  typeof window === 'undefined' // Server-side only
) {
  if (getApps().length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    };

    adminApp = initializeApp({
      credential: cert(serviceAccount as any),
    });
  } else {
    adminApp = getApps()[0];
  }

  adminDb = getFirestore(adminApp);
}

export { adminDb, adminApp };


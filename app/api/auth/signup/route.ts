import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase/admin';
import { createUser as createUserInDb } from '@/lib/firebase/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Initialize Firebase Admin (lazy initialization)
    const adminApp = getAdminApp();
    if (!adminApp) {
      console.error('Firebase Admin initialization failed. Check environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Create user in Firebase Auth using Admin SDK
    const auth = getAuth(adminApp);
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name || email.split('@')[0],
    });

    // Create user record in Firestore
    const now = new Date();
    await createUserInDb({
      id: userRecord.uid,
      email: userRecord.email!,
      name: name || userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        name: name || userRecord.displayName || userRecord.email?.split('@')[0],
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    let errorMessage = 'Failed to create account';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email is already registered';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}


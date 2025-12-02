import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase/admin';
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

    if (!adminApp) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
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
    await createUserInDb({
      id: userRecord.uid,
      email: userRecord.email!,
      name: name || userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
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


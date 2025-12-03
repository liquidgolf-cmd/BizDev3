import { getAdminDb } from './admin';
import { Timestamp } from 'firebase-admin/firestore';

function getDb() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized. Please check FIREBASE_ADMIN environment variables in Vercel.');
  }
  return adminDb;
}
import { Project } from '@/types/project';
import { CoachingSession, CoachMessage } from '@/types/coaching';
import { User } from '@/types/user';

// Helper to convert Firestore timestamps (works with both Admin SDK and client SDK)
const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) {
    return new Date();
  }
  // Admin SDK Timestamp
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  // Already a Date
  if (timestamp instanceof Date) {
    return timestamp;
  }
  // String date
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  // Firestore Timestamp object (seconds and nanoseconds)
  if (timestamp.seconds !== undefined) {
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
  }
  return new Date();
};

// Collections
export const projectsCollection = 'projects';
export const sessionsCollection = 'coaching_sessions';
export const usersCollection = 'users';

// User operations
export async function getUser(userId: string): Promise<User | null> {
  const db = getDb();
  const userRef = db.collection(usersCollection).doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return null;
  }
  const data = userSnap.data();
  return {
    ...data,
    id: userSnap.id,
    createdAt: convertTimestamp(data?.createdAt),
    updatedAt: convertTimestamp(data?.updatedAt),
  } as User;
}

export async function createUser(user: User): Promise<void> {
  const db = getDb();
  const userRef = db.collection(usersCollection).doc(user.id);
  await userRef.set({
    ...user,
    createdAt: Timestamp.fromDate(user.createdAt),
    updatedAt: Timestamp.fromDate(user.updatedAt),
  });
}

// Project operations
export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const db = getDb();
  const projectRef = db.collection(projectsCollection).doc();
  const now = new Date();
  const newProject: Project = {
    ...project,
    id: projectRef.id,
    createdAt: now,
    updatedAt: now,
  };
  
  await projectRef.set({
    ...newProject,
    createdAt: Timestamp.fromDate(newProject.createdAt),
    updatedAt: Timestamp.fromDate(newProject.updatedAt),
  });
  
  return newProject;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const db = getDb();
  const projectRef = db.collection(projectsCollection).doc(projectId);
  const projectSnap = await projectRef.get();
  
  if (!projectSnap.exists) {
    return null;
  }
  
  const data = projectSnap.data();
  return {
    ...data,
    id: projectSnap.id,
    createdAt: convertTimestamp(data?.createdAt),
    updatedAt: convertTimestamp(data?.updatedAt),
  } as Project;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const db = getDb();
  const querySnapshot = await db.collection(projectsCollection)
    .where('userId', '==', userId)
    .orderBy('updatedAt', 'desc')
    .get();
  
  return querySnapshot.docs.map(docSnapshot => {
    const data = docSnapshot.data();
    return {
      ...data,
      id: docSnapshot.id,
      createdAt: convertTimestamp(data?.createdAt),
      updatedAt: convertTimestamp(data?.updatedAt),
    } as Project;
  });
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
  const db = getDb();
  const projectRef = db.collection(projectsCollection).doc(projectId);
  await projectRef.update({
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  const db = getDb();
  const projectRef = db.collection(projectsCollection).doc(projectId);
  await projectRef.delete();
}

// Coaching session operations

/**
 * Create a new coaching session in Firestore
 * 
 * Supports both legacy web project coaching and new multi-coach business strategy coaching:
 * - Legacy: outline, extractedContext
 * - New: coachType, coachingStyle, stage, businessProfile, plan
 * 
 * All fields are optional for backward compatibility with existing sessions.
 * Complex objects (businessProfile, plan) are automatically serialized by Firestore.
 */
export async function createSession(session: Omit<CoachingSession, 'id' | 'createdAt' | 'updatedAt'>, customId?: string): Promise<CoachingSession> {
  const db = getDb();
  const sessionRef = customId 
    ? db.collection(sessionsCollection).doc(customId)
    : db.collection(sessionsCollection).doc();
  const now = new Date();
  const newSession: CoachingSession = {
    ...session,
    id: sessionRef.id,
    createdAt: now,
    updatedAt: now,
  };
  
  // Prepare data for Firestore (convert Date objects to Timestamps)
  const firestoreData: any = {
    ...newSession,
    messages: newSession.messages.map(msg => ({
      ...msg,
      timestamp: Timestamp.fromDate(msg.timestamp),
    })),
    createdAt: Timestamp.fromDate(newSession.createdAt),
    updatedAt: Timestamp.fromDate(newSession.updatedAt),
  };
  
  // Note: Firestore automatically handles serialization of complex objects:
  // - businessProfile (BusinessProfile object)
  // - plan (BusinessPlan object)
  // - outline (ProjectOutline object)
  // - extractedContext (ProjectContext object)
  // These don't need special handling - Firestore stores them as nested objects
  
  await sessionRef.set(firestoreData);
  
  return newSession;
}

/**
 * Get a coaching session from Firestore
 * 
 * Returns session with all fields, handling backward compatibility:
 * - Legacy sessions without new fields will have undefined/null values
 * - Complex objects (businessProfile, plan) are automatically deserialized by Firestore
 * - Timestamps are converted to Date objects
 */
export async function getSession(sessionId: string): Promise<CoachingSession | null> {
  try {
    const db = getDb();
    const sessionRef = db.collection(sessionsCollection).doc(sessionId);
    const sessionSnap = await sessionRef.get();
    
    if (!sessionSnap.exists) {
      return null;
    }
    
    const data = sessionSnap.data();
    if (!data) {
      return null;
    }
    
    // Convert Firestore data to CoachingSession format
    // Handle backward compatibility: old sessions may not have new fields
    return {
      ...data,
      id: sessionSnap.id,
      messages: (data?.messages || []).map((msg: any) => ({
        ...msg,
        timestamp: convertTimestamp(msg.timestamp),
      })),
      // Legacy fields (for backward compatibility)
      outline: data?.outline || null,
      extractedContext: data?.extractedContext || null,
      // New multi-coach fields (undefined if not present in old sessions)
      coachType: data?.coachType || undefined,
      coachingStyle: data?.coachingStyle || undefined,
      stage: data?.stage || undefined,
      businessProfile: data?.businessProfile || undefined,
      plan: data?.plan || null,
      status: data?.status || 'in_progress',
      createdAt: convertTimestamp(data?.createdAt),
      updatedAt: convertTimestamp(data?.updatedAt),
    } as CoachingSession;
  } catch (error: any) {
    console.error('Error getting session:', error);
    throw new Error(`Failed to get session: ${error.message}`);
  }
}

/**
 * Update a coaching session in Firestore
 * 
 * Supports partial updates of any session field:
 * - Messages: Automatically converts Date timestamps to Firestore Timestamps
 * - Complex objects (businessProfile, plan, outline): Automatically serialized by Firestore
 * - Stage transitions: Updates stage field
 * - Coach switching: Updates coachType and/or coachingStyle
 * 
 * Note: Firestore automatically handles nested object updates.
 * If you update businessProfile or plan, the entire object is replaced (not merged).
 */
export async function updateSession(sessionId: string, updates: Partial<CoachingSession>): Promise<void> {
  const db = getDb();
  const sessionRef = db.collection(sessionsCollection).doc(sessionId);
  
  // Prepare update data
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  
  // Convert message timestamps if messages are being updated
  if (updates.messages) {
    updateData.messages = updates.messages.map((msg: CoachMessage) => ({
      ...msg,
      timestamp: Timestamp.fromDate(msg.timestamp),
    }));
  }
  
  // Note: Complex objects (businessProfile, plan, outline, extractedContext)
  // are automatically serialized by Firestore - no special handling needed
  
  await sessionRef.update(updateData);
}


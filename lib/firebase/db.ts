import { adminDb } from './admin';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

function getDb() {
  if (!db) {
    throw new Error('Firebase not initialized. Please set Firebase environment variables.');
  }
  return db;
}
import { Project } from '@/types/project';
import { CoachingSession, CoachMessage } from '@/types/coaching';
import { User } from '@/types/user';

// Helper to convert Firestore timestamps
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};

// Collections
export const projectsCollection = 'projects';
export const sessionsCollection = 'coaching_sessions';
export const usersCollection = 'users';

// User operations
export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(getDb(), usersCollection, userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
}

export async function createUser(user: User): Promise<void> {
  const userRef = doc(getDb(), usersCollection, user.id);
  await setDoc(userRef, user);
}

// Project operations
export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const projectRef = doc(collection(getDb(), projectsCollection));
  const now = new Date();
  const newProject: Project = {
    ...project,
    id: projectRef.id,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(projectRef, {
    ...newProject,
    createdAt: Timestamp.fromDate(newProject.createdAt),
    updatedAt: Timestamp.fromDate(newProject.updatedAt),
  });
  
  return newProject;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const projectRef = doc(getDb(), projectsCollection, projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (!projectSnap.exists()) {
    return null;
  }
  
  const data = projectSnap.data();
  return {
    ...data,
    id: projectSnap.id,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  } as Project;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const q = query(
    collection(getDb(), projectsCollection),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnapshot => {
    const data = docSnapshot.data();
    return {
      ...data,
      id: docSnapshot.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as Project;
  });
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
  const projectRef = doc(getDb(), projectsCollection, projectId);
  await updateDoc(projectRef, {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  const projectRef = doc(getDb(), projectsCollection, projectId);
  await deleteDoc(projectRef);
}

// Coaching session operations
export async function createSession(session: Omit<CoachingSession, 'id' | 'createdAt' | 'updatedAt'>, customId?: string): Promise<CoachingSession> {
  const sessionRef = customId ? doc(getDb(), sessionsCollection, customId) : doc(collection(getDb(), sessionsCollection));
  const now = new Date();
  const newSession: CoachingSession = {
    ...session,
    id: sessionRef.id,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(sessionRef, {
    ...newSession,
    messages: newSession.messages.map(msg => ({
      ...msg,
      timestamp: Timestamp.fromDate(msg.timestamp),
    })),
    createdAt: Timestamp.fromDate(newSession.createdAt),
    updatedAt: Timestamp.fromDate(newSession.updatedAt),
  });
  
  return newSession;
}

export async function getSession(sessionId: string): Promise<CoachingSession | null> {
  const sessionRef = doc(getDb(), sessionsCollection, sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (!sessionSnap.exists()) {
    return null;
  }
  
  const data = sessionSnap.data();
  return {
    ...data,
    id: sessionSnap.id,
    messages: data.messages.map((msg: any) => ({
      ...msg,
      timestamp: convertTimestamp(msg.timestamp),
    })),
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  } as CoachingSession;
}

export async function updateSession(sessionId: string, updates: Partial<CoachingSession>): Promise<void> {
  const sessionRef = doc(getDb(), sessionsCollection, sessionId);
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  
  if (updates.messages) {
    updateData.messages = updates.messages.map((msg: CoachMessage) => ({
      ...msg,
      timestamp: Timestamp.fromDate(msg.timestamp),
    }));
  }
  
  await updateDoc(sessionRef, updateData);
}


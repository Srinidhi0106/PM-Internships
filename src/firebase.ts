import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { User, Internship, Application } from './types';
import { INITIAL_INTERNSHIPS } from './data/initialData';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth with localStorage & memory persistence to completely avoid iframe IndexedDB "Database is closing/hidden" errors
export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: [browserLocalPersistence, inMemoryPersistence]
    });
  } catch (_e) {
    try {
      return getAuth(app);
    } catch (err) {
      console.warn('Firebase Auth fallback initialized:', err);
      return getAuth(app);
    }
  }
})();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with database ID from configuration
export const db = (() => {
  try {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } catch (_e) {
    try {
      return initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      }, firebaseConfig.firestoreDatabaseId);
    } catch (_err) {
      return getFirestore(app);
    }
  }
})();

// Non-blocking connection check with graceful fallback
async function testFirestoreConnection() {
  try {
    const testDoc = doc(db, '_health', 'ping');
    await getDoc(testDoc);
  } catch (error) {
    // Graceful offline fallback - Firestore automatically caches and operates in offline mode
    if (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable') || error.message.includes('closing') || error.message.includes('hidden'))) {
      // Offline mode active
    }
  }
}

// Check connection asynchronously after startup
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testFirestoreConnection();
  }, 2000);
}

// Clean undefined values before writing to Firestore
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        clean[key] = sanitizeForFirestore(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

/** Save or update user profile document in Firestore `users/{uid}` */
export async function saveUserToFirestore(userData: User): Promise<void> {
  if (!userData || !userData.id) return;
  try {
    const userRef = doc(db, 'users', userData.id);
    const payload = sanitizeForFirestore({
      ...userData,
      updatedAt: new Date().toISOString()
    });
    await setDoc(userRef, payload, { merge: true });
  } catch (err) {
    console.error('Error saving user to Firestore:', err);
  }
}

/** Google Sign-In helper using Firebase Auth popup */
export async function loginWithGoogle(
  selectedRole: 'STUDENT' | 'COMPANY' | 'ADMIN' = 'STUDENT',
  extraProps: Partial<User> = {}
): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  const uid = fbUser.uid;

  // Check if profile exists in Firestore
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  let userProfile: User;

  const realDisplayName = extraProps.name || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Google Candidate');

  if (snap.exists()) {
    userProfile = snap.data() as User;
    if (extraProps.name) userProfile.name = extraProps.name;
    if (extraProps.college) userProfile.college = extraProps.college;
    if (extraProps.branch) userProfile.branch = extraProps.branch;
    if (extraProps.phone) userProfile.phone = extraProps.phone;
    if (extraProps.aadhaar) userProfile.aadhaar = extraProps.aadhaar;
    if (extraProps.companyName) userProfile.companyName = extraProps.companyName;
    await setDoc(userRef, sanitizeForFirestore(userProfile), { merge: true });
  } else {
    // Create new profile for Google account with supplied form extraProps
    userProfile = {
      id: uid,
      name: realDisplayName,
      email: fbUser.email || extraProps.email || '',
      role: selectedRole,
      college: selectedRole === 'STUDENT' ? (extraProps.college || 'IIT Delhi') : undefined,
      branch: selectedRole === 'STUDENT' ? (extraProps.branch || 'Computer Science & Engineering') : undefined,
      cgpa: selectedRole === 'STUDENT' ? (extraProps.cgpa || 8.5) : undefined,
      skills: selectedRole === 'STUDENT' ? (extraProps.skills || ['Python', 'React', 'Machine Learning', 'SQL']) : undefined,
      companyName: selectedRole === 'COMPANY' ? (extraProps.companyName || 'Corporate Partner') : undefined,
      phone: extraProps.phone || undefined,
      aadhaar: extraProps.aadhaar || undefined,
      xp: selectedRole === 'STUDENT' ? 1200 : 0,
      level: selectedRole === 'STUDENT' ? 'Verified Candidate' : 'Verified Partner',
      streakDays: 1,
      ...extraProps
    };
    await setDoc(userRef, sanitizeForFirestore(userProfile));
  }

  return userProfile;
}

/** Email Register helper */
export async function registerWithEmail(
  email: string,
  pass: string,
  name: string,
  role: 'STUDENT' | 'COMPANY' | 'ADMIN',
  extraProps: Partial<User> = {}
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  const uid = cred.user.uid;

  const newUser: User = {
    id: uid,
    name: name || (role === 'STUDENT' ? 'Registered Student' : role === 'COMPANY' ? 'Recruiter' : 'Officer'),
    email: email,
    role: role,
    college: role === 'STUDENT' ? (extraProps.college || 'Government University') : undefined,
    branch: role === 'STUDENT' ? (extraProps.branch || 'Engineering') : undefined,
    cgpa: role === 'STUDENT' ? (extraProps.cgpa || 8.0) : undefined,
    skills: role === 'STUDENT' ? (extraProps.skills || ['Communication', 'Python', 'Problem Solving']) : undefined,
    companyName: role === 'COMPANY' ? (extraProps.companyName || 'Corporate Partner') : undefined,
    xp: role === 'STUDENT' ? 500 : 0,
    level: 'New Registrant',
    streakDays: 1,
    ...extraProps
  };

  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, sanitizeForFirestore(newUser));

  return newUser;
}

/** Email Login helper */
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  const uid = cred.user.uid;

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as User;
  } else {
    const fallbackUser: User = {
      id: uid,
      name: cred.user.displayName || (email ? email.split('@')[0] : 'User'),
      email: email,
      role: 'STUDENT',
      college: 'National University',
      branch: 'Computer Science',
      cgpa: 8.2,
      skills: ['Python', 'SQL', 'Web Dev'],
      xp: 600,
      level: 'Registered Member',
      streakDays: 1
    };
    await setDoc(userRef, sanitizeForFirestore(fallbackUser));
    return fallbackUser;
  }
}

/** Logout Firebase helper */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/** Subscribe to Real-Time Internships Collection in Firestore */
export function subscribeToFirestoreInternships(onData: (internships: Internship[]) => void) {
  const colRef = collection(db, 'internships');

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_INTERNSHIPS);
        // Async background seed
        for (const item of INITIAL_INTERNSHIPS) {
          const itemRef = doc(db, 'internships', item.id);
          setDoc(itemRef, item).catch(() => {});
        }
      } else {
        const list: Internship[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Internship);
        });
        list.sort((a, b) => (b.postedAt || b.postedDate || '').localeCompare(a.postedAt || a.postedDate || ''));
        onData(list);
      }
    },
    (error) => {
      // Offline fallback: provide initial dataset so user experience is smooth
      if (error && (error.code === 'unavailable' || error.message.includes('offline'))) {
        console.info('Firestore offline - using cached / initial internships dataset.');
      } else {
        console.warn('Firestore internships snapshot notification:', error?.message);
      }
      onData(INITIAL_INTERNSHIPS);
    }
  );
}

/** Add a new internship document to Firestore */
export async function saveInternshipToFirestore(newRole: Internship): Promise<void> {
  try {
    const itemRef = doc(db, 'internships', newRole.id);
    await setDoc(itemRef, sanitizeForFirestore(newRole));
  } catch (err) {
    console.error('Error adding internship to Firestore:', err);
  }
}

/** Subscribe to Real-Time Applications Collection in Firestore */
export function subscribeToFirestoreApplications(onData: (applications: Application[]) => void) {
  const colRef = collection(db, 'applications');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Application[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Application);
      });
      onData(list);
    },
    (error) => {
      if (error && (error.code === 'unavailable' || error.message.includes('offline'))) {
        console.info('Firestore offline - using local state for applications.');
      } else {
        console.warn('Firestore applications snapshot notification:', error?.message);
      }
    }
  );
}

/** Submit a new student application to Firestore */
export async function saveApplicationToFirestore(appData: Application): Promise<void> {
  try {
    const appRef = doc(db, 'applications', appData.id);
    await setDoc(appRef, sanitizeForFirestore(appData));
  } catch (err) {
    console.error('Error saving application to Firestore:', err);
  }
}

/** Update Application Status in Firestore */
export async function updateApplicationStatusInFirestore(appId: string, status: 'SHORTLISTED' | 'REJECTED' | 'PENDING'): Promise<void> {
  try {
    const appRef = doc(db, 'applications', appId);
    await updateDoc(appRef, { status });
  } catch (err) {
    console.error('Error updating application status in Firestore:', err);
  }
}

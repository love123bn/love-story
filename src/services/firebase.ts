import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';

// Default / fallback Firebase config template
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const FIREBASE_CONFIG_STORAGE_KEY = 'love_app_firebase_custom_config';

export function getSavedFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading custom firebase config', e);
  }

  // Check import.meta.env
  const metaEnv = (import.meta as any)?.env;
  if (metaEnv?.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: metaEnv.VITE_FIREBASE_API_KEY,
      authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: metaEnv.VITE_FIREBASE_APP_ID || '',
    };
  }

  return null;
}

export function saveCustomFirebaseConfig(config: FirebaseConfig | null) {
  if (config) {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  }
}

class FirebaseService {
  private app: FirebaseApp | null = null;
  public auth: Auth | null = null;
  public db: Firestore | null = null;
  public isInitialized: boolean = false;
  private authSubscribers: ((user: User | null) => void)[] = [];

  constructor() {
    this.init();
  }

  public init(customConfig?: FirebaseConfig): boolean {
    const config = customConfig || getSavedFirebaseConfig();
    if (!config || !config.apiKey || !config.projectId) {
      this.isInitialized = false;
      return false;
    }

    try {
      if (getApps().length > 0) {
        this.app = getApp();
      } else {
        this.app = initializeApp(config);
      }
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.isInitialized = true;

      onAuthStateChanged(this.auth, (user) => {
        this.authSubscribers.forEach((cb) => cb(user));
      });

      return true;
    } catch (err) {
      console.warn('Firebase initialization notice:', err);
      this.isInitialized = false;
      return false;
    }
  }

  public onAuth(callback: (user: User | null) => void) {
    this.authSubscribers.push(callback);
    if (this.auth?.currentUser) {
      callback(this.auth.currentUser);
    }
    return () => {
      this.authSubscribers = this.authSubscribers.filter((cb) => cb !== callback);
    };
  }

  public async loginWithGoogle(): Promise<User | null> {
    if (!this.isInitialized || !this.auth) {
      throw new Error('Firebase chưa được cấu hình. Vui lòng mở Cài Đặt và nhập mã Firebase Config của bạn (chỉ mất 1 phút để tạo miễn phí trên Firebase Console)!');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  public async logout(): Promise<void> {
    if (!this.auth) return;
    await fbSignOut(this.auth);
  }

  // Sync couple general settings
  public async syncCoupleToCloud(coupleCode: string, data: any) {
    if (!this.db) return;
    try {
      const docRef = doc(this.db, 'couples', coupleCode);
      await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
    } catch (e) {
      console.error('Error syncing couple to cloud:', e);
    }
  }

  // Listen to remote couple updates in real-time
  public listenToCouple(coupleCode: string, callback: (data: any) => void) {
    if (!this.db) return () => {};
    const docRef = doc(this.db, 'couples', coupleCode);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (err) => console.warn('Firestore couple listen err:', err));
  }

  // Listen to real-time chat messages
  public listenToMessages(coupleCode: string, callback: (messages: any[]) => void) {
    if (!this.db) return () => {};
    const colRef = collection(this.db, 'couples', coupleCode, 'messages');
    const q = query(colRef, orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      callback(msgs);
    }, (err) => console.warn('Firestore messages listen err:', err));
  }

  // Send real-time chat message
  public async sendMessage(coupleCode: string, message: any) {
    if (!this.db) return;
    const colRef = collection(this.db, 'couples', coupleCode, 'messages');
    await addDoc(colRef, {
      ...message,
      timestamp: Date.now()
    });
  }

  // Listen to diary entries
  public listenToDiaries(coupleCode: string, callback: (diaries: any[]) => void) {
    if (!this.db) return () => {};
    const colRef = collection(this.db, 'couples', coupleCode, 'diaries');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      callback(items);
    }, (err) => console.warn('Firestore diaries listen err:', err));
  }

  public async saveDiary(coupleCode: string, diary: any) {
    if (!this.db) return;
    const colRef = collection(this.db, 'couples', coupleCode, 'diaries');
    if (diary.id) {
      const docRef = doc(this.db, 'couples', coupleCode, 'diaries', diary.id);
      await setDoc(docRef, diary, { merge: true });
    } else {
      await addDoc(colRef, { ...diary, createdAt: Date.now() });
    }
  }

  public async deleteDiary(coupleCode: string, diaryId: string) {
    if (!this.db) return;
    const docRef = doc(this.db, 'couples', coupleCode, 'diaries', diaryId);
    await deleteDoc(docRef);
  }
}

export const firebaseService = new FirebaseService();

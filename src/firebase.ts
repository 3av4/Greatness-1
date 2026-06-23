// ============================================================
//  موقع العظمة - Firebase Configuration & Data Layer
// ============================================================
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit,
  writeBatch,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChIjMBJJo-OR6TvN_FQ5NDpXMVPHgMWFs",
  authDomain: "greatness-website.firebaseapp.com",
  projectId: "greatness-website",
  storageBucket: "greatness-website.firebasestorage.app",
  messagingSenderId: "804075909906",
  appId: "1:804075909906:web:e38a2aa83a71b74c36f9cb",
  measurementId: "G-NEYENZ01DB",
};

let app: any;
let db: any;
let storage: any;
let analytics: any;
let auth: any;
let firebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  signInAnonymously(auth).catch((err) => {
    console.warn("Anonymous auth failed", err);
  });
  analyticsSupported()
    .then((ok) => {
      if (ok) analytics = getAnalytics(app);
    })
    .catch(() => {});
  firebaseReady = true;
} catch (err) {
  console.warn("Firebase init failed, falling back to local mode", err);
}

export { firebaseReady, db, storage, analytics, auth };
export {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit,
  writeBatch,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
};

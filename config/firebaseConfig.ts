import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { initializeAuth, onAuthStateChanged } from 'firebase/auth';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const appStorage = createAsyncStorage('app');
const persistence = getReactNativePersistence(appStorage);
export const auth = initializeAuth(app, {
  persistence
});

onAuthStateChanged (auth, (user) => {
  if (user) {
    // User is signed in, you can access user information here.
    console.log("User signed in:", user);
  } else {
    // User is signed out.
    console.log("User signed out");
  }
});
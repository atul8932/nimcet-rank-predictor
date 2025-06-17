// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAU9Xc689PfEqJfqmT8gKO8bcINJ4KtTEc",
  authDomain: "nimcet-rank-predictor.firebaseapp.com",
  projectId: "nimcet-rank-predictor",
  storageBucket: "nimcet-rank-predictor.firebasestorage.app",
  messagingSenderId: "748145022328",
  appId: "1:748145022328:web:129105782a8f40710fe48d",
};

// Initialize only if not already initialized
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firestore if needed
export const db = getFirestore(app);

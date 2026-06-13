// src/Firebase.js
// Firebase config is fetched at runtime from the backend
// so no secrets ever appear in the frontend bundle.

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let app;
let db;

try {
  // GET /api/config/firebase  — served by the backend from .env vars
  const response = await fetch(`${BACKEND_URL}/api/config/firebase`);
  if (!response.ok) throw new Error("Failed to fetch Firebase config");

  const firebaseConfig = await response.json();
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db  = getFirestore(app);
} catch (error) {
  console.error("[Firebase] Could not load config from backend:", error.message);
  console.error(
    "[Firebase] Make sure the backend is running at",
    BACKEND_URL
  );
}

export { app, db };

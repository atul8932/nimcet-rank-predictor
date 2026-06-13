// src/Firebase.js
// Firebase config is fetched from the backend at runtime.
// Retries up to 5 times with exponential backoff to handle
// Render free-tier cold-start delays (can take 30-50 s).

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch with automatic retry and exponential back-off.
 * @param {string} url
 * @param {number} retries   — max attempts (default 6)
 * @param {number} delayMs   — initial delay between retries (doubles each time)
 */
async function fetchWithRetry(url, retries = 6, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(
        `[Firebase] Backend not ready yet (attempt ${attempt}/${retries}). ` +
        `Retrying in ${delayMs / 1000}s… (Render may be waking up)`
      );
      await new Promise(r => setTimeout(r, delayMs));
      delayMs = Math.min(delayMs * 1.5, 15000); // cap at 15 s
    }
  }
}

let app;
let db;

try {
  const res          = await fetchWithRetry(`${BACKEND_URL}/api/config/firebase`);
  const firebaseConfig = await res.json();
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db  = getFirestore(app);
  console.info("[Firebase] Initialized successfully.");
} catch (err) {
  console.error("[Firebase] Could not reach backend after multiple retries:", err.message);
  console.error("[Firebase] Backend URL:", BACKEND_URL);
  // db remains undefined — pages will redirect to "/" if db is not available
}

export { app, db };

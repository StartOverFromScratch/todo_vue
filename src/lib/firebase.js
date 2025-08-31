import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
// --- Debug: show environment flags ---
console.log('[FB] DEV:', import.meta.env.DEV,
            'USE_EMU:', import.meta.env.VITE_USE_FIREBASE_EMULATOR)

// --- Connect to emulators in development when flag is true ---
if (import.meta.env.DEV && String(import.meta.env.VITE_USE_FIREBASE_EMULATOR) === 'true') {
  console.log('[FB] Connecting to emulators (Firestore:8080, Auth:9099)')
  try {
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
  } catch (e) {
    console.warn('[FB] Firestore emulator connect failed:', e)
  }
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  } catch (e) {
    console.warn('[FB] Auth emulator connect failed:', e)
  }
} else {
  console.log('[FB] Using production Firebase backends')
}

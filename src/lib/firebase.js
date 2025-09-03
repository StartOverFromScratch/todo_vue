import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import {
  getAuth, connectAuthEmulator,
  GoogleAuthProvider, signInWithPopup, signInWithCredential,
  setPersistence, browserLocalPersistence
} from 'firebase/auth'

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
// 任意：セッション維持を明示（リロード後もログイン継続）
setPersistence(auth, browserLocalPersistence).catch(() => {})

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

// === Google サインイン（本番/エミュ両対応）===
// const googleProvider = new GoogleAuthProvider()
export async function signInWithGoogle() {
  const useEmu = import.meta.env.DEV && String(import.meta.env.VITE_USE_FIREBASE_EMULATOR) === 'true'
  if (useEmu) {
    // Auth Emulator では外部ポップアップ不可。strict JSON 形式の fake id_token を渡す
    const fakeIdToken = JSON.stringify({
      sub: crypto.randomUUID(),
      email: 'emu-google@example.com',
      email_verified: true,
      name: 'Emu Google User',
      picture: 'https://example.com/avatar.png'
    })
    const cred = GoogleAuthProvider.credential(fakeIdToken)
    return signInWithCredential(auth, cred)
  } else {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }
}

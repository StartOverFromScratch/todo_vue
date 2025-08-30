import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore'

const colRef = () => collection(db, 'todos')

export async function listTodos(ownerId){
  const q = ownerId
    ? query(colRef(), where('ownerId','==', ownerId), orderBy('createdAt','desc'))
    : query(colRef(), orderBy('createdAt','desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addTodo(title, ownerId){
  const now = Date.now()
  const ref = await addDoc(colRef(), { title, done:false, createdAt: now, ownerId: ownerId || null })
  return { id: ref.id, title, done:false, createdAt: now, ownerId: ownerId || null }
}

export async function toggleTodo(id, done){
  await updateDoc(doc(db, 'todos', id), { done })
}

export async function removeTodo(id){
  await deleteDoc(doc(db, 'todos', id))
}

export function subscribeTodos(ownerId, cb){
  const q = ownerId
    ? query(colRef(), where('ownerId','==', ownerId), orderBy('createdAt','desc'))
    : query(colRef(), orderBy('createdAt','desc'))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    cb(items)
  })
}

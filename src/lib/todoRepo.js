import { db } from './firebase'
import {
  collection, addDoc, getDocs, doc, deleteDoc, updateDoc,
  onSnapshot,query, orderBy
} from 'firebase/firestore'

const colRef = () => collection(db, 'todos')

export async function listTodos(){
  const q = query(colRef(), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addTodo(title){
  const now = Date.now()
  const ref = await addDoc(colRef(), { title, done:false, createdAt: now })
  return { id: ref.id, title, done:false, createdAt: now }
}

export async function toggleTodo(id, done){
  await updateDoc(doc(db, 'todos', id), { done })
}

export async function removeTodo(id){
  await deleteDoc(doc(db, 'todos', id))
}

export function subscribeTodos(cb){
  const q = query(colRef(), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    cb(items)
  })
}

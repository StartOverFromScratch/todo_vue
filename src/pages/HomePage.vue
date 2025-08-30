<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

const s = useTodoStore()

const user = ref(null)
const email = ref('')
const pass = ref('')

const text = ref('')
const add = async () => { await s.add(text.value, user.value?.uid || null); text.value = '' }

const doLogin = async () => { await signInWithEmailAndPassword(auth, email.value, pass.value); email.value=''; pass.value='' }
const doSignup = async () => { await createUserWithEmailAndPassword(auth, email.value, pass.value); email.value=''; pass.value='' }
const doLogout = async () => { await signOut(auth) }

onMounted(() => {
  // 認証状態を監視し、ユーザー毎のTodoだけを購読
  onAuthStateChanged(auth, (u) => {
    user.value = u
    s.stopWatch()
    if (u) s.startWatch(u.uid)
  })
})
onBeforeUnmount(() => s.stopWatch())
</script>

<template>
  <nav style="display:flex; gap:12px; align-items:center; margin:12px 0">
    <router-link to="/">Home</router-link>
    <router-link to="/stats">Stats</router-link>
    <span style="margin-left:auto" />
    <template v-if="user">
      <span>こんにちは、{{ user.email }}</span>
      <button type="button" @click="doLogout">ログアウト</button>
    </template>
  </nav>

  <template v-if="user">
    <h1>Todo</h1>
    <input v-model="text" placeholder="やること">
    <button type="button" @click="add">追加</button>

    <ul>
      <li v-for="t in s.items" :key="t.id">
        <label>
          <input type="checkbox" :checked="t.done" @change="s.toggle(t.id)" />
          <span :style="{textDecoration: t.done ? 'line-through' : 'none'}">{{ t.title }}</span>
        </label>
        <button @click="s.remove(t.id)">x</button>
      </li>
    </ul>

    <p>合計 {{ s.allCount }} / 完了 {{ s.doneCount }}</p>
    <router-link to="/stats">統計へ</router-link>
  </template>

  <template v-else>
    <h1>ログイン</h1>
    <p style="margin:8px 0">メール / パスワードでログイン、または新規登録してください。</p>
    <div style="display:flex; flex-direction:column; gap:8px; max-width:320px">
      <input placeholder="email" v-model="email" />
      <input placeholder="password" type="password" v-model="pass" />
      <div style="display:flex; gap:8px">
        <button type="button" @click="doLogin">ログイン</button>
        <button type="button" @click="doSignup">新規登録</button>
      </div>
    </div>
  </template>
</template>

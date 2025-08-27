<!-- src/App.vue -->
<script setup>
// import { ref } from 'vue'
// const text = ref('')
// const todos = ref([])
// function add() {
//   if (!text.value.trim()) return
//   todos.value.push({ id: crypto.randomUUID(), title: text.value, done: false })
//   text.value = ''
// }
// function toggle(id){ const t=todos.value.find(x=>x.id===id); if(t) t.done=!t.done }
// function remove(id){ todos.value = todos.value.filter(x=>x.id!==id) }
</script>

<!-- <template>
  <h1>Todo</h1>
  <input v-model="text" placeholder="やること">
  <button @click="add">追加</button>

  <ul>
    <li v-for="t in todos" :key="t.id">
      <label><input type="checkbox" :checked="t.done" @change="toggle(t.id)" /> {{ t.title }}</label>
      <button @click="remove(t.id)">x</button>
    </li>
  </ul>
</template> -->
<template>
  <nav style="display:flex; gap:12px; margin:12px 0">
    <router-link to="/">Home</router-link>
    <router-link to="/stats">Stats</router-link>
  </nav>
  <router-view />
</template>

<script setup>
// import { ref } from 'vue'
// import { ref, onMounted } from 'vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTodoStore } from '../stores/todoStore'
const s = useTodoStore()
const text = ref('')
// const add = () => { s.add(text.value); text.value = '' }
const add = async () => { await s.add(text.value); text.value = '' }

// onMounted(() => { s.fetch() })
onMounted(() => s.startWatch())
onBeforeUnmount(() => s.stopWatch())
</script>

<template>
  <h1>Todo</h1>
  <input v-model="text" placeholder="やること">
  <button @click="add">追加</button>

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

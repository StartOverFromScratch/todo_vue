<script setup>
import { useTodoStore } from '../stores/todoStore'
const s = useTodoStore()
</script>

<template>
  <h1>統計</h1>
  <p>総件数：{{ s.allCount }}</p>
  <p>完了件数：{{ s.doneCount }}</p>
  <p>未完了一覧：</p>
  <ul>
    <li v-for="t in s.undone" :key="t.id">{{ t.title }}</li>
  </ul>
  <router-link to="/">戻る</router-link>
</template>

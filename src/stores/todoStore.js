import { defineStore } from 'pinia'
import { listTodos, addTodo, subscribeTodos, toggleTodo, removeTodo } from '../lib/todoRepo'
let unsub = null
export const useTodoStore = defineStore('todo', {
  state: () => ({ items: [], isWatching: false, adding: false }),
  actions: {
    startWatch(){
      if (unsub) return
      this.isWatching = true
      unsub = subscribeTodos(items => { this.items = items })
    },
    stopWatch(){
      if (unsub){ unsub(); unsub = null }
      this.isWatching = false
    },
    async fetch(){ this.items = await listTodos() },
    async add(title){
      const t = title?.trim(); if(!t) return
      if (this.adding) return          // 連打ガード
      this.adding = true
      try {
        const created = await addTodo(t)
        // 監視中は onSnapshot が配列を最新化するのでローカルでいじらない
        if (!this.isWatching) {
          this.items.unshift(created)
        }
      } finally {
        this.adding = false
      }
    },
    async toggle(id){
      const x = this.items.find(i => i.id === id); if(!x) return
      await toggleTodo(id, !x.done); x.done = !x.done
    },
    async remove(id){
      await removeTodo(id)
      this.items = this.items.filter(i => i.id !== id)
    }
  },
  getters: {
    allCount:(s)=>s.items.length,
    doneCount:(s)=>s.items.filter(i=>i.done).length,
    undone:(s)=>s.items.filter(i=>!i.done)
  }
})




import { defineStore } from 'pinia'
import { listTodos, addTodo, subscribeTodos, toggleTodo, removeTodo } from '../lib/todoRepo'
let unsub = null
export const useTodoStore = defineStore('todo', {
  state: () => ({ items: [] }),
  actions: {
    startWatch(){
      if (unsub) return
      unsub = subscribeTodos(items => { this.items = items })
    },
    stopWatch(){
      if (unsub){ unsub(); unsub = null }
    },
    async fetch(){ this.items = await listTodos() },
    async add(title){
      const t = title?.trim(); if(!t) return
      const created = await addTodo(t)
      this.items.unshift(created)
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

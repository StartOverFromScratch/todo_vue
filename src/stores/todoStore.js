import { defineStore } from 'pinia'

const load = () => {
  try { return JSON.parse(localStorage.getItem('todos') || '[]') } catch { return [] }
}
const save = (items) => localStorage.setItem('todos', JSON.stringify(items))

export const useTodoStore = defineStore('todo', {
  state: () => ({ items: load() }),
  actions: {
    add(title){
      const t = title?.trim()
      if(!t) return
      this.items.push({ id: crypto.randomUUID(), title: t, done: false, createdAt: Date.now() })
      save(this.items)
    },
    toggle(id){
      const x = this.items.find(i => i.id === id)
      if(x){ x.done = !x.done; save(this.items) }
    },
    remove(id){
      this.items = this.items.filter(i => i.id !== id)
      save(this.items)
    },
    clear(){
      this.items = []; save(this.items)
    }
  },
  getters: {
    allCount: (s) => s.items.length,
    doneCount: (s) => s.items.filter(i => i.done).length,
    undone:    (s) => s.items.filter(i => !i.done),
  }
})

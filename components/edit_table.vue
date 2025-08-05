<script setup>
import { ref, reactive, watch } from 'vue'

const type_list = ["A","B","C","D"]

const dataItems = ref([
  {"id":1,"type":'A','name':'Fred Really Long Name That only gets longer','note':'Short note'},
  {"id":2,"type":'D','name':'Harold','note':'This is a really long note'}
])

const tailwindScript = document.createElement('script')
tailwindScript.setAttribute('src', 'https://cdn.tailwindcss.com')
document.head.appendChild(tailwindScript)

const editingItem = reactive({"id":null})
const startEditing = (item) => {
  if (editingItem && (item.id===editingItem.id)){
    return
  }

  Object.assign(editingItem, item)
}
const isEditing = (id) => {
  return id===editingItem.id
}

const activeTableRow = (item) => {
  if (editingItem && item.id===editingItem.id) {
    return 'tr-active'
  } else {
    return 'tr-inactive'
  }

}

// Watch the editItem for changes
watch(editingItem, (newItem, oldItem) => {
  dataItems.value.forEach(item => {
    if (item.id===newItem.id){
      Object.assign(item, newItem)
    }
  })
})

</script>

<style scoped>
.tr-active {background-color: rgba(0,150,50,0.25);}
.tr-inactive {}
</style>

<template>
  <div class="p-2">
  <table class="border-collapse table-auto min-w-full">
    <thead class="text-left text-xs uppercase"><tr>
      <th class="text-center">id</th>
      <th class="text-center">type</th>
      <th class="">name</th>
      <th class="">note</th>
      <th class="">actions</th>
    </tr></thead>
    <tbody class="text-center text-xs">
      <tr v-for="item in dataItems" :key="item.id" @click="startEditing(item)"
      :class="activeTableRow(item)">
        <td class="border border-slate-400 p-1 w-8">
          {{ item.id }}
        </td>
        <td class="border border-slate-400 p-1 w-10">
          <span v-if="!isEditing(item.id)">{{ item.type}}</span>
          <select v-else v-model="editingItem.type" class="bg-transparent text-center w-full h-full">
              <option v-for="val in type_list" :key="val" :value="val">{{ val }}</option>
          </select>
        </td>
        <td class="border border-slate-400 p-1 text-left w-28 truncate">
          <div v-if="!isEditing(item.id)" class="w-28 truncate">{{ item.name}}</div>
          <input v-else v-model="editingItem.name" type="text" class="bg-transparent w-full h-full">
        </td>
        <td class="border border-slate-400 p-1 text-left truncate">
          <span v-if="!isEditing(item.id)">{{ item.note}}</span>
          <input v-else v-model="editingItem.note" type="text" class="bg-transparent w-full h-full">
        </td>
        <td class="border border-slate-400 p-1 text-left ">
          X---Y
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<template>
  <div class="node">
    <div class="node-left">
      <span class="drag-handle">⋮⋮</span>
      <span :class="['badge', node.type]">{{ label }}</span>
      <strong class="node-title">{{ node.title }}</strong>
      <span class="chip">{{ node.hours }}h</span>
      <span class="chip small">{{ formatPersons(node.persons) }}</span>
    </div>
    <div class="node-actions">
      <button class="icon-btn" @click="addChild">＋</button>
      <button class="icon-btn" @click="startEdit">✎</button>
      <button class="icon-btn" @click="remove">🗑</button>
    </div>
    <div v-if="editing" class="editor">
      <input v-model="form.title" />
      <select v-model="form.type">
        <option value="page">ページ</option>
        <option value="link">リンク</option>
        <option value="form">フォーム</option>
      </select>
      <input type="number" v-model.number="form.hours" step="1" min="0" />
      <input type="number" v-model.number="form.persons" step="0.1" min="0" />
      <div>
        <button class="btn" @click="applyEdit">保存</button>
        <button class="btn" @click="cancelEdit">キャンセル</button>
      </div>
    </div>

    <ul v-if="node.children && node.children.length" class="children">
      <li v-for="c in node.children" :key="c.id">
        <NodeItem :node="c" @add="$emit('add', $event)" @edit="$emit('edit', $event)" @remove="$emit('remove', $event)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SiteNode } from '~/composables/useStructure'

const props = defineProps<{ node: SiteNode }>()
const emit = defineEmits(['add', 'edit', 'remove'])

const editing = ref(false)
const form = ref({
  title: props.node.title,
  type: props.node.type,
  hours: props.node.hours,
  persons: props.node.persons ?? 0
})

function addChild() {
  emit('add', props.node.id)
}

function startEdit() {
  form.value = {
    title: props.node.title,
    type: props.node.type,
    hours: props.node.hours,
    persons: props.node.persons ?? 0
  }
  editing.value = true
}

function applyEdit() {
  emit('edit', props.node.id, { ...form.value })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}

function remove() {
  if (confirm('削除しますか？')) {
    emit('remove', props.node.id)
  }
}

function formatPersons(p?: number) {
  if (!p && p !== 0) return ''
  if (p >= 1) return `${p}人日`
  return `${p}人日`
}

const label = computed(() => {
  if (props.node.type === 'page') return 'ページ'
  if (props.node.type === 'link') return 'リンク'
  return 'フォーム'
})
</script>

<style scoped>
.node { padding: 12px; border-radius:8px; background:#fff; margin-bottom:8px; box-shadow: 0 0 0 1px rgba(0,0,0,0.02); }
.node-left { display:flex; align-items:center; gap:8px; }
.node-title { margin-left:6px; }
.drag-handle { color:#9aa0a6; cursor:grab; }
.badge { padding:4px 8px; border-radius:999px; font-size:12px; color:#fff; }
.badge.page { background: linear-gradient(90deg,#8ab6ff,#7a9cff); }
.badge.link { background: linear-gradient(90deg,#8bf5b7,#48d07f); }
.badge.form { background: linear-gradient(90deg,#e6b8ff,#d58efb); }
.chip { background:#f3f4f6; padding:4px 8px; border-radius:6px; font-size:13px; margin-left:6px; }
.chip.small { font-size:12px; padding:3px 6px; }
.node-actions { float:right; display:flex; gap:6px; }
.icon-btn { background:transparent; border:0; cursor:pointer; font-size:14px; padding:6px; }
.editor { margin-top:8px; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.editor input[type="number"] { width:80px; }
.children { margin-left: 18px; margin-top:8px; list-style:none; padding:0; }
</style>

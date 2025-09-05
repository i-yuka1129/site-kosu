<template>
  <div class="structure">
    <ul class="node-list">
      <li v-for="n in nodes" :key="n.id">
        <NodeItem :node="n" @add="onAdd" @edit="onEdit" @remove="onRemove" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { SiteNode } from '~/composables/useStructure'
import NodeItem from './NodeItem.vue'

const props = defineProps<{ nodes: SiteNode[] }>()
const emit = defineEmits(['add', 'edit', 'remove'])

function onAdd(parentId: string | null) {
  emit('add', parentId)
}
function onEdit(id: string, patch: any) {
  emit('edit', id, patch)
}
function onRemove(id: string) {
  emit('remove', id)
}
</script>

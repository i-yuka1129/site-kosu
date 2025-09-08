<template>
  <div class="container">
    <div class="main">
      <div class="card">
        <div class="card-header">
          <h2>サイト構成図</h2>
          <div>
            <button class="btn primary" @click="addRoot">+ ルートページを追加</button>
          </div>
        </div>
        <SiteStructure :nodes="nodes" @add="addNode" @edit="editNode" @remove="removeNode" />
      </div>
    </div>

    <aside class="sidebar">
      <SidebarSummary :nodes="nodes" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useStructure } from '~/composables/useStructure'
import SiteStructure from '~/components/SiteStructure.vue'
import SidebarSummary from '~/components/SidebarSummary.vue'

const { nodes, addNode, editNode, removeNode, addRoot } = useStructure()
</script>

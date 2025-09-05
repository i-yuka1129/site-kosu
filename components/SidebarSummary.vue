<template>
  <div class="card small">
    <h3>工数サマリー</h3>
    <div class="summary-row">
      <div>総工数（時間）</div>
      <div class="value">{{ totalHours }}時間</div>
    </div>
    <div class="summary-row">
      <div>総工数（人日）</div>
      <div class="value">{{ personDays }}人日</div>
    </div>
    <hr />
    <div class="counts">
      <div>ページ数 <strong>{{ counts.pages }}</strong></div>
      <div>リンク数 <strong>{{ counts.links }}</strong></div>
      <div>フォーム数 <strong>{{ counts.forms }}</strong></div>
    </div>
  </div>

  <div class="card small">
    <h3>凡例</h3>
    <div class="legend">
      <div><span class="legend-badge page">ページ</span> 8h〜 / 1人日〜</div>
      <div><span class="legend-badge link">リンク</span> 2h〜 / 0.3人日〜</div>
      <div><span class="legend-badge form">フォーム</span> 16h〜 / 2人日〜</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SiteNode } from '~/composables/useStructure'
import { useStructure } from '~/composables/useStructure'

const props = defineProps<{ nodes: SiteNode[] }>()
// reuse functions from composable
const s = useStructure()
// Because useStructure creates its own sample, we only use helper functions by duplicating small logic here:
function totalHours(list: SiteNode[]) {
  let sum = 0
  for (const n of list) {
    sum += n.hours ?? 0
    if (n.children) sum += totalHours(n.children)
  }
  return sum
}
function counts(list: SiteNode[]) {
  let pages = 0, links = 0, forms = 0
  function rec(arr: SiteNode[]) {
    for (const n of arr) {
      if (n.type === 'page') pages++
      if (n.type === 'link') links++
      if (n.type === 'form') forms++
      if (n.children) rec(n.children)
    }
  }
  rec(list)
  return { pages, links, forms }
}

const totalHours = computed(() => totalHours(props.nodes))
const personDays = computed(() => (Math.round((totalHours.value / 8) * 10) / 10).toFixed(1))
const counts = computed(() => counts(props.nodes))
</script>

<style scoped>
.card.small { padding:16px; margin-bottom:12px; }
.summary-row { display:flex; justify-content:space-between; margin:8px 0; }
.value { background:#f8fafb; padding:6px 10px; border-radius:8px; }
.counts div { margin:6px 0; display:flex; justify-content:space-between; }
.legend { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
.legend-badge { padding:6px 10px; border-radius:8px; color:#fff; }
.legend-badge.page { background: linear-gradient(90deg,#8ab6ff,#7a9cff); }
.legend-badge.link { background: linear-gradient(90deg,#8bf5b7,#48d07f); }
.legend-badge.form { background: linear-gradient(90deg,#e6b8ff,#d58efb); }
</style>

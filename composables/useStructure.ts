import { reactive, computed } from 'vue'

export type NodeType = 'page' | 'link' | 'form'
export type SiteNode = {
  id: string
  type: NodeType
  title: string
  hours: number
  persons?: number
  children?: SiteNode[]
}

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9)
}

const sample: SiteNode[] = [
  {
    id: uid('n_'),
    type: 'page',
    title: 'トップページ',
    hours: 8,
    persons: 1,
    children: [
      {
        id: uid('n_'),
        type: 'page',
        title: '会社概要',
        hours: 6,
        persons: 0.8
      },
      {
        id: uid('n_'),
        type: 'form',
        title: 'お問い合わせフォーム',
        hours: 16,
        persons: 2
      }
    ]
  }
]

export function useStructure() {
  const nodes = reactive<SiteNode[]>(sample)

  function addRoot() {
    nodes.push({
      id: uid('n_'),
      type: 'page',
      title: '新規ページ',
      hours: 8,
      persons: 1,
      children: []
    })
  }

  function addNode(parentId: string | null, node?: Partial<SiteNode>) {
    const newNode: SiteNode = {
      id: uid('n_'),
      type: (node?.type as NodeType) ?? 'page',
      title: node?.title ?? '新規項目',
      hours: node?.hours ?? 8,
      persons: node?.persons ?? 1,
      children: []
    }
    if (!parentId) {
      nodes.push(newNode)
      return
    }
    const parent = findNodeById(nodes, parentId)
    if (parent) {
      parent.children = parent.children ?? []
      parent.children.push(newNode)
    }
  }

  function editNode(id: string, patch: Partial<SiteNode>) {
    const n = findNodeById(nodes, id)
    if (n) {
      if (patch.title !== undefined) n.title = patch.title
      if (patch.hours !== undefined) n.hours = patch.hours
      if (patch.persons !== undefined) n.persons = patch.persons
      if (patch.type !== undefined) n.type = patch.type
    }
  }

  function removeNode(id: string) {
    removeNodeById(nodes, id)
  }

  function findNodeById(list: SiteNode[], id: string): SiteNode | null {
    for (const n of list) {
      if (n.id === id) return n
      if (n.children) {
        const found = findNodeById(n.children, id)
        if (found) return found
      }
    }
    return null
  }

  function removeNodeById(list: SiteNode[], id: string): boolean {
    const idx = list.findIndex((x) => x.id === id)
    if (idx >= 0) {
      list.splice(idx, 1)
      return true
    }
    for (const n of list) {
      if (n.children) {
        const removed = removeNodeById(n.children, id)
        if (removed) return true
      }
    }
    return false
  }

  function totalHours(list: SiteNode[] = nodes): number {
    let sum = 0
    for (const n of list) {
      sum += n.hours ?? 0
      if (n.children) sum += totalHours(n.children)
    }
    return sum
  }

  function counts(list: SiteNode[] = nodes) {
    let pages = 0
    let links = 0
    let forms = 0
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

  return {
    nodes,
    addRoot,
    addNode,
    editNode,
    removeNode,
    totalHours,
    counts
  }
}

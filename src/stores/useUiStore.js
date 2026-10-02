import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const COLLAPSED_KEY = 'rc-sidebar-collapsed'

function readCollapsed() {
  try { return localStorage.getItem(COLLAPSED_KEY) === '1' } catch { return false }
}

export const useUiStore = defineStore('ui', () => {
  // Desktop (lg+) icon-rail mode — persisted per browser
  const sidebarCollapsed = ref(readCollapsed())

  function toggleSidebarCollapsed() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  watch(sidebarCollapsed, (val) => {
    try { localStorage.setItem(COLLAPSED_KEY, val ? '1' : '0') } catch {}
  })

  // ── Activity modal + details drawer (mounted once in AppLayout) ─────────
  // prefill: { recordType?, vendors?, reseller?, endUsers?, followUpOf? }
  const activityModal = ref({ open: false, prefill: null })
  function openActivityModal(prefill = null) {
    activityDrawerId.value = null
    activityModal.value = { open: true, prefill }
  }
  function closeActivityModal() {
    activityModal.value = { open: false, prefill: null }
  }

  const activityDrawerId = ref(null)
  function openActivity(id) { activityDrawerId.value = id }
  function closeActivity() { activityDrawerId.value = null }

  // ── Toasts ───────────────────────────────────────────────────────────────
  const toasts = ref([])
  function toast(message, tone = 'success') {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, tone })
    setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id) }, 4000)
  }

  return {
    sidebarCollapsed, toggleSidebarCollapsed,
    activityModal, openActivityModal, closeActivityModal,
    activityDrawerId, openActivity, closeActivity,
    toasts, toast,
  }
})

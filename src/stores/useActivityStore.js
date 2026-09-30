import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Activity store — manages activity list, filters, and creation.
 *
 * TODO: Replace all mock data and fetch calls with real API endpoints.
 * Suggested endpoints:
 *   GET  /api/activities?scope=my|team&page=1&per=25&from=&to=&type=&vendor=
 *   POST /api/activities          — create
 *   PUT  /api/activities/:id      — update
 *   GET  /api/activities/:id      — detail
 */

export const ACTIVITY_TYPES = [
  'Sales',
  'Pre-Sales',
  'Marketing',
]

export const RECORD_TYPES = [
  'Completed',
  'Upcoming',
  'In Progress',
]

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ACTIVITIES = [
  {
    id: 'act_001',
    type: 'Sales',
    date: '2026-09-25',
    vendor: 'CrowdStrike',
    reseller: 'Ignition Technology',
    endUsers: ['Acme Corp'],
    description: 'Demo of Falcon platform to CISO team. Strong interest in EDR module.',
    nextStep: 'Follow up with pricing proposal by end of week.',
    recordType: 'Completed',
    pipelineValue: 45000,
    points: 50,
    createdBy: 'Nikola Gavric',
    createdAt: '2026-09-25T09:30:00Z',
  },
  {
    id: 'act_002',
    type: 'Pre-Sales',
    date: '2026-09-28',
    vendor: 'Abnormal AI',
    reseller: 'Ignition Technology',
    endUsers: ['BetaCorp'],
    description: 'Technical discovery call. Reviewed email security posture.',
    nextStep: 'Schedule POC environment setup.',
    recordType: 'Upcoming',
    pipelineValue: 22000,
    points: 30,
    createdBy: 'Nikola Gavric',
    createdAt: '2026-09-28T14:00:00Z',
  },
]

export const useActivityStore = defineStore('activity', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const activities = ref([...MOCK_ACTIVITIES])
  const loading = ref(false)
  const scope = ref('my') // 'my' | 'team'
  const filter = ref({
    type: null,       // null | 'Sales' | 'Pre-Sales' | 'Marketing'
    from: null,
    to: null,
    search: '',
  })

  // ── Getters ───────────────────────────────────────────────────────────────
  const filtered = computed(() => {
    return activities.value.filter((a) => {
      if (filter.value.type && a.type !== filter.value.type) return false
      if (filter.value.search) {
        const q = filter.value.search.toLowerCase()
        if (!a.vendor.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  })

  const stats = computed(() => ({
    total: filtered.value.length,
    topType: (() => {
      const counts = {}
      filtered.value.forEach((a) => { counts[a.type] = (counts[a.type] ?? 0) + 1 })
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    })(),
    pipelineInfluenced: filtered.value.reduce((s, a) => s + (a.pipelineValue ?? 0), 0),
  }))

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * TODO: Replace with GET /api/activities
   */
  async function fetchActivities() {
    loading.value = true
    await new Promise((r) => setTimeout(r, 400))
    // activities.value = await apiGet('/api/activities', { scope: scope.value, ...filter.value })
    loading.value = false
  }

  /**
   * TODO: Replace with POST /api/activities
   */
  async function createActivity(payload) {
    loading.value = true
    await new Promise((r) => setTimeout(r, 500))

    const newActivity = {
      id: 'act_' + Date.now(),
      ...payload,
      createdBy: 'Nikola Gavric',
      createdAt: new Date().toISOString(),
      points: 50,
    }
    activities.value.unshift(newActivity)
    loading.value = false
    return newActivity
  }

  function setScope(val) { scope.value = val }
  function setFilter(partial) { Object.assign(filter.value, partial) }
  function resetFilter() { filter.value = { type: null, from: null, to: null, search: '' } }

  return {
    activities,
    filtered,
    stats,
    loading,
    scope,
    filter,
    fetchActivities,
    createActivity,
    setScope,
    setFilter,
    resetFilter,
  }
})

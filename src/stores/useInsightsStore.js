import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useActivityStore } from '@/stores/useActivityStore'
import { useRaceStore, getPeriodRange } from '@/stores/useRaceStore'
import { useDirectoryStore } from '@/stores/useDirectoryStore'

/**
 * Insights store — everything the Home page shows below the race.
 *
 * Two global filters drive the whole page:
 *   - period → useRaceStore().period (week / month / quarter / year)
 *   - scope  → here ('my' | 'team' | 'all'), persisted per browser
 *
 * TODO: replace client-side aggregation with GET /api/insights?scope=&period=
 */

export const SCOPES = ['my', 'team', 'all']

// TODO: comes from the user's team in the API
const TEAM = [
  'Luka Petrovic', 'Lukas Brenner', 'Tom Whitaker',
  'Ciaran Doyle', 'James Holloway', 'Jonas Reiter',
]

export const RECORD_TYPES = ['Sales', 'Pre-Sales', 'Marketing']

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY = 86_400_000

function readScope() {
  try { const v = localStorage.getItem('rc-home-scope'); return SCOPES.includes(v) ? v : null } catch { return null }
}

/** Buckets for the trend chart of a period: label + [start, end). */
function bucketsFor(period, start, end) {
  if (period === 'week') {
    return DAYS.map((label, i) => ({ label, start: new Date(start.getTime() + i * DAY), end: new Date(start.getTime() + (i + 1) * DAY) }))
  }
  if (period === 'month') {
    const out = []
    for (let d = new Date(start), i = 1; d < end; i++) {
      const next = new Date(Math.min(d.getTime() + 7 * DAY, end.getTime()))
      out.push({ label: `W${i}`, start: new Date(d), end: next })
      d = next
    }
    return out
  }
  // quarter → its 3 months, year → 12 months
  const out = []
  for (let d = new Date(start); d < end; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    out.push({ label: MONTHS[d.getMonth()], start: new Date(d), end: new Date(d.getFullYear(), d.getMonth() + 1, 1) })
  }
  return out
}

function tally(list, pick) {
  const map = {}
  list.forEach((a) => [].concat(pick(a) ?? []).forEach((k) => { if (k) map[k] = (map[k] ?? 0) + 1 }))
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }))
}

function pctChange(curr, prev) {
  if (!prev) return curr ? null : 0 // null = "new" (no previous data)
  return Math.round(((curr - prev) / prev) * 100)
}

export const useInsightsStore = defineStore('insights', () => {
  const auth = useAuthStore()
  const activityStore = useActivityStore()
  const race = useRaceStore()
  const directory = useDirectoryStore()

  // ── Scope (persisted) ─────────────────────────────────────────────────────
  // Managers land on their team, everyone else on their own numbers.
  const scope = ref(readScope() ?? (auth.user?.role === 'Manager' ? 'team' : 'my'))
  watch(scope, (v) => { try { localStorage.setItem('rc-home-scope', v) } catch {} })
  function setScope(v) { if (SCOPES.includes(v)) scope.value = v }

  const scopeLabel = computed(() => ({ my: 'My activity', team: 'My team', all: 'Everyone' }[scope.value]))

  function inScope(a) {
    if (scope.value === 'my') return a.createdBy === auth.user?.name
    if (scope.value === 'team') return TEAM.includes(a.createdBy)
    return true
  }

  function between(list, start, end) {
    return list.filter((a) => { const d = new Date(a.date); return d >= start && d < end })
  }

  // ── Current + previous period ─────────────────────────────────────────────
  const range = computed(() => getPeriodRange(race.period, race.now))
  const prevRange = computed(() => getPeriodRange(race.period, new Date(range.value.start.getTime() - 1)))

  const scoped = computed(() => activityStore.activities.filter(inScope))
  const activities = computed(() => between(scoped.value, range.value.start, range.value.end))
  const previous = computed(() => between(scoped.value, prevRange.value.start, prevRange.value.end))

  const sum = (list, f) => list.reduce((s, a) => s + (a[f] ?? 0), 0)

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = computed(() => {
    const curr = activities.value
    const prev = previous.value
    const contributors = new Set(curr.map((a) => a.createdBy)).size
    return {
      activities: { value: curr.length, delta: pctChange(curr.length, prev.length) },
      pipeline: { value: sum(curr, 'pipelineValue'), delta: pctChange(sum(curr, 'pipelineValue'), sum(prev, 'pipelineValue')) },
      topType: tally(curr, (a) => a.recordType)[0]?.name ?? null,
      contributors,
    }
  })

  // ── Trend ─────────────────────────────────────────────────────────────────
  const trend = computed(() => {
    const buckets = bucketsFor(race.period, range.value.start, range.value.end).map((b) => ({
      ...b,
      count: between(activities.value, b.start, b.end).length,
      isFuture: b.start > race.now,
      isCurrent: b.start <= race.now && race.now < b.end,
    }))
    const max = Math.max(1, ...buckets.map((b) => b.count))
    return buckets.map((b) => ({ ...b, height: Math.round((b.count / max) * 100) }))
  })

  // ── Breakdowns ────────────────────────────────────────────────────────────
  const byType = computed(() => RECORD_TYPES.map((type) => ({
    type,
    count: activities.value.filter((a) => a.recordType === type).length,
  })))

  const byStatus = computed(() => ({
    completed: activities.value.filter((a) => a.stage === 'Completed').length,
    upcoming: activities.value.filter((a) => a.stage !== 'Completed').length,
  }))

  const partners = computed(() => ({
    vendors: tally(activities.value, (a) => a.vendors.map(directory.name)),
    resellers: tally(activities.value, (a) => a.reseller && directory.name(a.reseller)),
    endUsers: tally(activities.value, (a) => a.endUsers.map(directory.name)),
  }))

  /** Team / All only — who contributes what in this period. */
  const contributors = computed(() => {
    const map = {}
    activities.value.forEach((a) => {
      map[a.createdBy] ??= { name: a.createdBy, activities: 0, pipeline: 0, points: 0 }
      map[a.createdBy].activities += 1
      map[a.createdBy].pipeline += a.pipelineValue ?? 0
      map[a.createdBy].points += a.points ?? 0
    })
    const rows = Object.values(map).sort((a, b) => b.activities - a.activities || b.pipeline - a.pipeline)
    const max = Math.max(1, ...rows.map((r) => r.activities))
    return rows.map((r) => ({ ...r, isMe: r.name === auth.user?.name, share: Math.round((r.activities / max) * 100) }))
  })

  const recent = computed(() => [...activities.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5))

  // ── Export ────────────────────────────────────────────────────────────────
  function exportCSV() {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows = [
      ['Date', 'Record type', 'Activity type', 'Vendors', 'Reseller', 'End users', 'Stage', 'Pipeline value', 'Points', 'Created by'],
      ...activities.value.map((a) => [a.date, a.recordType, a.activityType, a.vendors.map(directory.name).join('; '), a.reseller ? directory.name(a.reseller) : '', a.endUsers.map(directory.name).join('; '), a.stage, a.pipelineValue ?? '', a.points ?? '', a.createdBy]),
    ]
    const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `race-control-${scope.value}-${race.period}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    scope,
    scopeLabel,
    setScope,
    activities,
    kpis,
    trend,
    byType,
    byStatus,
    partners,
    contributors,
    recent,
    exportCSV,
  }
})

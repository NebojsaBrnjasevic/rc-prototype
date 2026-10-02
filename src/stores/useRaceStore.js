import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useActivityStore } from '@/stores/useActivityStore'

/**
 * Race store — period races (week / month / quarter / year) and standings.
 *
 * Race points are scored per period and reset when the period ends.
 * Lifetime XP (auth.user.points) is separate and drives the level.
 *
 * TODO: Replace MOCK_STANDINGS with GET /api/races/:period/standings
 * The current user's race points are derived from their own activities
 * in the activity store so the UI stays consistent until the API exists.
 */

export const RACE_PERIODS = ['week', 'month', 'quarter', 'year']

const PERIOD_META = {
  week:    { label: 'Week',    labelShort: 'Week',  race: 'Weekly race',    thisLabel: 'this week' },
  month:   { label: 'Month',   labelShort: 'Month', race: 'Monthly race',   thisLabel: 'this month' },
  quarter: { label: 'Quarter', labelShort: 'Qtr',   race: 'Quarterly race', thisLabel: 'this quarter' },
  year:    { label: 'Year',    labelShort: 'Year',  race: 'Yearly race',    thisLabel: 'this year' },
}

// Mirrors production (the production app) leaderboard data.
const MOCK_STANDINGS = {
  week: [
    { name: 'Lukas Brenner', level: 5,  activities: 13, points: 1700 },
    { name: 'Tom Whitaker',        level: 4,  activities: 2,  points: 400 },
    { name: 'Ciaran Doyle',          level: 10, activities: 3,  points: 400 },
    { name: 'James Holloway',        level: 15, activities: 2,  points: 300 },
    { name: 'Jonas Reiter',        level: 4,  activities: 1,  points: 200 },
  ],
  month: [
    { name: 'Tom Whitaker', level: 4, activities: 1, points: 200 },
  ],
  quarter: [
    { name: 'Tom Whitaker', level: 4, activities: 1, points: 200 },
  ],
  year: [
    { name: 'Hannah Clarke',    level: 22, activities: 282, points: 32900 },
    { name: 'Oliver Bennett',    level: 22, activities: 254, points: 32500 },
    { name: 'Pieter de Vries',  level: 21, activities: 207, points: 25750 },
    { name: 'Freja Lindqvist',     level: 16, activities: 133, points: 18700 },
    { name: 'Sam Fletcher', level: 15, activities: 120, points: 14750 },
  ],
}

const DAY = 86_400_000

/** Start (inclusive) and end (exclusive) of the period containing `now`. */
export function getPeriodRange(period, now = new Date()) {
  const y = now.getFullYear()
  const m = now.getMonth()
  if (period === 'week') {
    const dow = (now.getDay() + 6) % 7 // Monday = 0
    const start = new Date(y, m, now.getDate() - dow)
    return { start, end: new Date(start.getTime() + 7 * DAY) }
  }
  if (period === 'month') return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) }
  if (period === 'quarter') {
    const q = Math.floor(m / 3) * 3
    return { start: new Date(y, q, 1), end: new Date(y, q + 3, 1) }
  }
  return { start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1) }
}

export const useRaceStore = defineStore('race', () => {
  const auth = useAuthStore()
  const activityStore = useActivityStore()

  // ── State ─────────────────────────────────────────────────────────────────
  const period = ref('week')
  const now = ref(new Date())
  // Keep countdowns / progress fresh without a per-component timer
  setInterval(() => { now.value = new Date() }, 30_000)

  function setPeriod(p) {
    if (RACE_PERIODS.includes(p)) period.value = p
  }

  // ── Period meta (labels, progress, days left) ─────────────────────────────
  const periods = computed(() => RACE_PERIODS.map((key) => {
    const { start, end } = getPeriodRange(key, now.value)
    const elapsed = Math.round(((now.value - start) / (end - start)) * 100)
    return {
      key,
      ...PERIOD_META[key],
      start,
      end,
      elapsed,
      daysLeft: Math.max(0, Math.floor((end - now.value) / DAY)),
    }
  }))

  const current = computed(() => periods.value.find((p) => p.key === period.value))

  // ── Current user's activity in the selected period ────────────────────────
  function activitiesIn(key) {
    const { start, end } = getPeriodRange(key, now.value)
    return activityStore.activities.filter((a) => {
      const d = new Date(a.date)
      return a.createdBy === auth.user?.name && d >= start && d < end
    })
  }

  const myActivities = computed(() => activitiesIn(period.value))

  const myStats = computed(() => {
    const list = myActivities.value
    const counts = {}
    list.forEach((a) => { counts[a.type] = (counts[a.type] ?? 0) + 1 })
    return {
      activities: list.length,
      points: list.reduce((s, a) => s + (a.points ?? 0), 0),
      pipeline: list.reduce((s, a) => s + (a.pipelineValue ?? 0), 0),
      topType: Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
    }
  })

  // ── Standings (others + me, ranked) ───────────────────────────────────────
  const standings = computed(() => {
    const me = auth.user
      ? [{
          name: auth.user.name,
          level: auth.levelInfo.level,
          activities: myStats.value.activities,
          points: myStats.value.points,
          isMe: true,
        }]
      : []
    const rows = [...(MOCK_STANDINGS[period.value] ?? []), ...me.filter((r) => r.points > 0)]
      .sort((a, b) => b.points - a.points)
    const leaderPts = rows[0]?.points ?? 0
    return rows.map((r, i) => ({
      ...r,
      rank: i + 1,
      gap: leaderPts - r.points,
      share: leaderPts ? Math.round((r.points / leaderPts) * 100) : 0,
    }))
  })

  const leader = computed(() => standings.value[0] ?? null)
  const me = computed(() => standings.value.find((r) => r.isMe) ?? null)

  /** Rows shown under the leader on the Metrics page (P2–P5). */
  const chasingPack = computed(() => standings.value.slice(1, 5))

  /** Who the user needs to pass next, if anyone. */
  const nextTarget = computed(() => {
    if (!me.value || me.value.rank === 1) return null
    return standings.value[me.value.rank - 2]
  })

  return {
    now,
    period,
    periods,
    current,
    setPeriod,
    myActivities,
    myStats,
    standings,
    leader,
    me,
    chasingPack,
    nextTarget,
  }
})

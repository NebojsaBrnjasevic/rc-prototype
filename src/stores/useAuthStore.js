import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DEMO_LOGIN } from '@/data/demoLogin'

/**
 * Mock auth store — replace with real API calls when integrating with backend.
 *
 * The mock user mirrors what was observed in the Race Control audit:
 * - Luka Petrovic, Admin, 710 lifetime points (→ Level 3, derived — see levelInfo)
 */

// Lifetime XP needed to reach each level (index 0 = Level 1).
// Single source of truth — never store `level` separately.
export const LEVEL_THRESHOLDS = [0, 200, 500, 900, 1400, 2000, 2700, 3500, 4400, 5400]

/** Derive level + progress from lifetime points. */
export function getLevelInfo(points = 0) {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  const start = LEVEL_THRESHOLDS[level - 1] ?? 0
  const end = LEVEL_THRESHOLDS[level] ?? start + 1000
  return {
    level,
    nextLevel: level + 1,
    points,
    levelStart: start,
    levelEnd: end,
    pct: Math.min(100, Math.round(((points - start) / (end - start)) * 100)),
    toNext: Math.max(0, end - points),
  }
}
const MOCK_USER = {
  id: 'usr_001',
  name: 'Luka Petrovic',
  email: 'luka.petrovic@northstar.example',
  initials: 'NG',
  isAdmin: true,
  points: 710,
  territory: 'Northstar Distribution UK',
  memberSince: '2026-07-01',
  streak: 0,
  // Security
  mfaEnabled: true,
  passkeysEnabled: false,
}

export const useAuthStore = defineStore('auth', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const user = ref(null)
  const token = ref(localStorage.getItem('rc-token') ?? null)

  // ── Getters ───────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const levelInfo = computed(() => getLevelInfo(user.value?.points ?? 0))

  // Daily bonus — TODO: server-authoritative (GET/POST /api/rewards/daily)
  const DAILY_BONUS_POINTS = 50
  const dailyBonusAvailable = ref(true)
  function claimDailyBonus() {
    if (!dailyBonusAvailable.value) return
    addPoints(DAILY_BONUS_POINTS)
    dailyBonusAvailable.value = false
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  // Two-step sign-in: credentials → verification code. The session only
  // starts after the code is verified.
  const pendingEmail = ref(null)

  /**
   * Step 1 — TODO: POST /api/auth/login { email, password } → { mfaRequired: true }
   * Mock: accepts any credentials.
   */
  async function signIn(email, password) {
    await new Promise((r) => setTimeout(r, 600))
    if (!email || !password) return { success: false, error: 'Enter your email and password' }
    pendingEmail.value = email
    return { success: true, mfaRequired: true }
  }

  /**
   * Step 2 — TODO: POST /api/auth/verify { email, code } → { token, user }
   * Mock: the demo code from src/data/demoLogin.js is accepted.
   */
  async function verifyCode(code) {
    await new Promise((r) => setTimeout(r, 600))
    if (code !== DEMO_LOGIN.code) return { success: false, error: "That code didn't work. Check it and try again." }
    const mockToken = 'mock_token_' + Date.now()
    token.value = mockToken
    user.value = { ...MOCK_USER, email: pendingEmail.value ?? MOCK_USER.email }
    localStorage.setItem('rc-token', mockToken)
    pendingEmail.value = null
    return { success: true }
  }

  /** TODO: POST /api/auth/resend */
  async function resendCode() {
    await new Promise((r) => setTimeout(r, 400))
    return { success: true }
  }

  function cancelSignIn() { pendingEmail.value = null }

  /** TODO: POST /api/access-requests — mock only */
  async function requestAccess() {
    await new Promise((r) => setTimeout(r, 700))
    return { success: true }
  }

  /**
   * Restore session from stored token on app load.
   * TODO: validate token against backend (GET /api/auth/me)
   */
  async function restoreSession() {
    if (!token.value) return
    // TODO: const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token.value}` } })
    user.value = { ...MOCK_USER }
  }

  function signOut() {
    user.value = null
    token.value = null
    localStorage.removeItem('rc-token')
  }

  /**
   * Add points to the current user (called after activity creation).
   * TODO: This should be server-authoritative; update from API response.
   */
  function addPoints(amount) {
    if (user.value) user.value.points += amount
  }

  return {
    user,
    token,
    isAuthenticated,
    levelInfo,
    dailyBonusAvailable,
    dailyBonusPoints: DAILY_BONUS_POINTS,
    claimDailyBonus,
    signIn,
    verifyCode,
    resendCode,
    cancelSignIn,
    requestAccess,
    pendingEmail,
    restoreSession,
    signOut,
    addPoints,
  }
})

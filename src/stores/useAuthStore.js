import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Mock auth store — replace with real API calls when integrating with backend.
 *
 * The mock user mirrors what was observed in the Race Control audit:
 * - Nikola Gavric, Admin, Level 3, 600 points
 */
const MOCK_USER = {
  id: 'usr_001',
  name: 'Nikola Gavric',
  email: 'nikola.gavric@devtechgroup.com',
  initials: 'NG',
  isAdmin: true,
  level: 3,
  points: 600,
  territory: 'Ignition Technology UK',
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

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * TODO: Replace with real API call to your auth endpoint.
   * Currently accepts any credentials and returns the mock user.
   */
  async function signIn(email, password) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600))

    // TODO: POST /api/auth/login { email, password }
    // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    // const data = await res.json()

    const mockToken = 'mock_token_' + Date.now()
    token.value = mockToken
    user.value = { ...MOCK_USER, email }
    localStorage.setItem('rc-token', mockToken)

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
    signIn,
    restoreSession,
    signOut,
    addPoints,
  }
})

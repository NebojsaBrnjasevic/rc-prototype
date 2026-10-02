<template>
  <AppLayout>
    <!-- Identity -->
    <section class="relative overflow-hidden card p-6 mb-5">
      <span class="pointer-events-none absolute -right-20 -top-28 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgb(var(--rc-reward-fill)/0.14),transparent_70%)]" aria-hidden="true" />
      <div class="relative flex flex-col sm:flex-row sm:items-center gap-5">
        <AppAvatar :name="auth.user?.name ?? ''" size="xl" class="!w-20 !h-20 !text-2xl !rounded-2xl" />
        <div class="flex-1 min-w-0">
          <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">{{ auth.user?.name }}</h1>
          <p class="text-base text-fg-2 mt-1">{{ auth.user?.email }}</p>
          <div class="flex flex-wrap items-center gap-2 mt-3">
            <AppBadge v-if="auth.user?.isAdmin" color="brand" :pill="false">Admin</AppBadge>
            <AppBadge :pill="false">{{ auth.user?.territory }}</AppBadge>
            <AppBadge :pill="false">Member since {{ memberSince }}</AppBadge>
          </div>
        </div>
        <AppButton variant="secondary" :tag="RouterLink" to="/settings">
          <Cog6ToothIcon class="w-[18px] h-[18px]" />Settings
        </AppButton>
      </div>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
      <div class="space-y-5 min-w-0">
        <!-- Level & rewards -->
        <section aria-labelledby="level-title" class="rounded-panel border border-reward-fill/30 bg-reward-fill/[0.06] p-6">
          <div class="flex items-start justify-between gap-4 mb-5">
            <div>
              <p class="text-overline text-reward">Lifetime XP</p>
              <h2 id="level-title" class="font-display font-bold text-num-xl text-reward tabular mt-1">
                {{ auth.levelInfo.points.toLocaleString() }}<span class="text-base text-reward/70"> pts</span>
              </h2>
            </div>
            <span class="h-12 px-4 rounded-2xl bg-reward-fill text-reward-on font-display font-bold text-xl flex items-center">Lv {{ auth.levelInfo.level }}</span>
          </div>
          <AppXpBar :level="auth.levelInfo.level" :value="auth.levelInfo.pct" :current="auth.levelInfo.points" :max="auth.levelInfo.levelEnd">
            <p class="text-[13px] text-reward/80">{{ auth.levelInfo.toNext.toLocaleString() }} XP to Level {{ auth.levelInfo.nextLevel }}</p>
          </AppXpBar>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div class="flex items-center gap-3 rounded-2xl bg-surface-1/70 p-4">
              <span class="w-10 h-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center"><FireIcon class="w-5 h-5" /></span>
              <div>
                <p class="font-display font-bold text-xl tabular">{{ auth.user?.streak ?? 0 }} days</p>
                <p class="text-[13px] text-fg-2">{{ (auth.user?.streak ?? 0) ? 'Current streak' : 'Log an activity today to start a streak' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-2xl bg-surface-1/70 p-4">
              <AppRewardBox
                :available="auth.dailyBonusAvailable"
                :points="auth.dailyBonusPoints"
                :animate="false"
                :dot="false"
                @claim="auth.claimDailyBonus()"
              />
              <div>
                <p class="text-[15px] font-extrabold">Daily bonus</p>
                <p class="text-[13px] text-fg-2">{{ auth.dailyBonusAvailable ? `+${auth.dailyBonusPoints} pts — click the box to claim` : 'Claimed — back tomorrow' }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- My numbers -->
        <section aria-labelledby="numbers-title">
          <div class="flex items-center justify-between mb-3">
            <h2 id="numbers-title" class="font-display font-semibold text-xl">My numbers</h2>
            <RouterLink to="/activity" class="text-sm font-bold text-brand hover:text-brand-hover flex items-center gap-1">My activities <ChevronRightIcon class="w-4 h-4" /></RouterLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard label="Activities" :value="mine.length" sublabel="All time" />
            <StatCard label="Pipeline" :value="gbp(pipeline)" sublabel="All time" />
            <StatCard label="Top activity type" :value="topType" :sublabel="topType ? 'All time' : 'Shows once you log activities'" />
          </div>
        </section>

        <!-- Race -->
        <section aria-labelledby="race-title" class="card p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <span class="w-12 h-12 rounded-[14px] bg-brand/10 text-brand flex items-center justify-center flex-shrink-0"><TrophyIcon class="w-6 h-6" /></span>
          <div class="flex-1">
            <h2 id="race-title" class="text-lg font-extrabold">{{ race.current.race }}</h2>
            <p class="text-sm text-fg-2 mt-1">
              <template v-if="race.me">You're <span class="font-extrabold text-brand">P{{ race.me.rank }}</span> with {{ race.me.points.toLocaleString() }} race points.</template>
              <template v-else>You're not on the board {{ race.current.thisLabel }} yet.</template>
              Ends in {{ race.current.daysLeft }} days.
            </p>
          </div>
          <AppButton variant="secondary" :tag="RouterLink" to="/race">View standings</AppButton>
        </section>
      </div>

      <!-- Security -->
      <aside class="space-y-5 xl:sticky-aside">
        <section aria-labelledby="security-title" class="card p-6">
          <h2 id="security-title" class="font-display font-semibold text-lg mb-4 flex items-center gap-2"><ShieldCheckIcon class="w-5 h-5 text-brand" />Security</h2>
          <ul class="space-y-3">
            <li class="flex items-center gap-3 rounded-2xl bg-surface-2 p-4">
              <DevicePhoneMobileIcon class="w-5 h-5 text-fg-2 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-bold">Authenticator app</p>
                <p class="text-[13px] text-fg-muted">Two-factor authentication</p>
              </div>
              <AppBadge :color="auth.user?.mfaEnabled ? 'success' : 'neutral'" dot>{{ auth.user?.mfaEnabled ? 'Active' : 'Off' }}</AppBadge>
            </li>
            <li class="flex items-center gap-3 rounded-2xl bg-surface-2 p-4">
              <FingerPrintIcon class="w-5 h-5 text-fg-2 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-bold">Passkeys</p>
                <p class="text-[13px] text-fg-muted">Sign in with Face ID, Touch ID or a security key</p>
              </div>
              <!-- TODO: WebAuthn registration flow -->
              <AppButton variant="secondary" size="sm" @click="ui.toast('Passkey setup isn\'t available in the prototype yet')">
                <PlusIcon class="w-4 h-4" />Add
              </AppButton>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Cog6ToothIcon, FireIcon, ChevronRightIcon, TrophyIcon, ShieldCheckIcon, DevicePhoneMobileIcon, FingerPrintIcon, PlusIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/useAuthStore'
import { useActivityStore } from '@/stores/useActivityStore'
import { useRaceStore } from '@/stores/useRaceStore'
import { useUiStore } from '@/stores/useUiStore'
import { gbp } from '@/utils/activity'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppXpBar from '@/components/ui/AppXpBar.vue'
import AppRewardBox from '@/components/ui/AppRewardBox.vue'
import StatCard from '@/components/ui/StatCard.vue'

const auth = useAuthStore()
const activityStore = useActivityStore()
const race = useRaceStore()
const ui = useUiStore()

const memberSince = computed(() =>
  auth.user?.memberSince ? new Date(auth.user.memberSince).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—')

const mine = computed(() => activityStore.activities.filter((a) => a.createdBy === auth.user?.name))
const pipeline = computed(() => mine.value.reduce((s, a) => s + (a.pipelineValue ?? 0), 0))
const topType = computed(() => {
  const m = {}
  mine.value.forEach((a) => { m[a.activityType] = (m[a.activityType] ?? 0) + 1 })
  return Object.entries(m).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null
})
</script>

<template>
  <AppLayout>
    <div class="max-w-3xl">
      <div class="mb-6">
        <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">Settings</h1>
        <p class="mt-2 text-base text-fg-2">Changes save automatically on this device.</p>
      </div>

      <!-- Appearance -->
      <section aria-labelledby="appearance-title" class="card p-6 mb-5">
        <h2 id="appearance-title" class="font-display font-semibold text-xl mb-5">Appearance</h2>
        <div class="space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p class="text-[15px] font-bold">Theme</p>
              <p class="text-[13px] text-fg-muted">Dark is the default for Race Control.</p>
            </div>
            <AppSegmentControl :model-value="themeStore.isDark ? 'dark' : 'light'" :options="themeOptions" aria-label="Theme" @update:model-value="setTheme" />
          </div>
          <div class="border-t border-line" aria-hidden="true" />
          <label class="flex items-center justify-between gap-4 cursor-pointer">
            <span>
              <span class="block text-[15px] font-bold">Compact sidebar</span>
              <span class="block text-[13px] text-fg-muted">Show icons only on large screens. You can also use the arrow on the sidebar edge.</span>
            </span>
            <AppToggle :model-value="uiStore.sidebarCollapsed" aria-label="Compact sidebar" @update:model-value="uiStore.toggleSidebarCollapsed()" />
          </label>
        </div>
      </section>

      <!-- Home -->
      <section aria-labelledby="home-title" class="card p-6 mb-5">
        <h2 id="home-title" class="font-display font-semibold text-xl mb-5">Home</h2>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="text-[15px] font-bold">Default view</p>
            <p class="text-[13px] text-fg-muted">Whose numbers Home shows when you land on it.</p>
          </div>
          <AppSegmentControl :model-value="insights.scope" :options="scopeOptions" aria-label="Default Home view" @update:model-value="setScope" />
        </div>
      </section>

      <!-- Notifications -->
      <section aria-labelledby="notif-title" class="card p-6 mb-5">
        <h2 id="notif-title" class="font-display font-semibold text-xl mb-1">Notifications</h2>
        <p class="text-[13px] text-fg-muted mb-5">Email and in-app. <!-- TODO: persist via PUT /api/me/preferences --></p>
        <ul class="divide-y divide-line">
          <li v-for="n in notifications" :key="n.key">
            <label class="flex items-center justify-between gap-4 py-4 cursor-pointer">
              <span class="flex items-start gap-3">
                <component :is="n.icon" class="w-5 h-5 text-brand mt-0.5 flex-shrink-0" />
                <span>
                  <span class="block text-[15px] font-bold">{{ n.label }}</span>
                  <span class="block text-[13px] text-fg-muted">{{ n.hint }}</span>
                </span>
              </span>
              <AppToggle v-model="prefs[n.key]" :aria-label="n.label" @update:model-value="saved(n.label)" />
            </label>
          </li>
        </ul>
      </section>

      <!-- Account -->
      <section aria-labelledby="account-title" class="card p-6">
        <h2 id="account-title" class="font-display font-semibold text-xl mb-5">Account</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="rounded-2xl bg-surface-2 p-4">
            <dt class="text-overline text-fg-muted">Name</dt>
            <dd class="text-[15px] font-bold mt-1">{{ auth.user?.name }}</dd>
          </div>
          <div class="rounded-2xl bg-surface-2 p-4">
            <dt class="text-overline text-fg-muted">Email</dt>
            <dd class="text-[15px] font-bold mt-1 truncate">{{ auth.user?.email }}</dd>
          </div>
        </dl>
        <p class="text-[13px] text-fg-muted mt-4 flex items-center gap-2">
          <InformationCircleIcon class="w-4 h-4 flex-shrink-0" />Name and email come from your company account and can't be changed here.
        </p>
        <div class="flex flex-wrap gap-3 mt-5">
          <AppButton variant="secondary" :tag="RouterLink" to="/profile">View profile</AppButton>
          <AppButton variant="ghost" class="!text-danger hover:!bg-danger/10" @click="signOut">
            <ArrowRightOnRectangleIcon class="w-[18px] h-[18px]" />Sign out
          </AppButton>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  SunIcon, MoonIcon, TrophyIcon, GiftIcon, EnvelopeIcon, ExclamationTriangleIcon, InformationCircleIcon, ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUiStore } from '@/stores/useUiStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useInsightsStore } from '@/stores/useInsightsStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppSegmentControl from '@/components/ui/AppSegmentControl.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const themeStore = useThemeStore()
const uiStore = useUiStore()
const auth = useAuthStore()
const insights = useInsightsStore()

const themeOptions = [
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
]
const scopeOptions = [
  { value: 'my', label: 'My activity' },
  { value: 'team', label: 'Team' },
  { value: 'all', label: 'All' },
]

const notifications = [
  { key: 'overtaken', label: 'Race updates', hint: 'When someone passes you or you move up the standings', icon: TrophyIcon },
  { key: 'bonus', label: 'Daily bonus reminder', hint: 'A nudge if you haven\'t claimed today\'s bonus by 4pm', icon: GiftIcon },
  { key: 'weekly', label: 'Weekly summary', hint: 'Your race result and activity recap every Monday', icon: EnvelopeIcon },
  ...(auth.user?.isAdmin ? [{ key: 'syncFailures', label: 'Salesforce sync failures', hint: 'Admins only — when activities fail to sync', icon: ExclamationTriangleIcon }] : []),
]
const prefs = reactive({ overtaken: true, bonus: true, weekly: true, syncFailures: true })

function setTheme(v) { themeStore.setDark(v === 'dark'); saved('Theme') }
function setScope(v) { insights.setScope(v); saved('Default view') }
function saved(what) { uiStore.toast(`${what} saved`) }

function signOut() {
  auth.signOut()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur-md flex-shrink-0">

    <div class="flex items-center h-[72px] px-4 sm:px-8 gap-2.5">

      <!-- Mobile hamburger (sidebar is a rail from md up) -->
      <div class="md:hidden">
        <button
          class="icon-btn"
          @click="uiStore.toggleSidebar()"
          aria-label="Open navigation"
        >
          <Bars3Icon class="w-5 h-5" />
        </button>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Right actions -->
      <div class="flex items-center gap-2.5">

        <!-- Daily bonus — animated until claimed -->
        <AppRewardBox
          v-if="auth.isAuthenticated"
          :available="auth.dailyBonusAvailable"
          :points="auth.dailyBonusPoints"
          @claim="auth.claimDailyBonus()"
        />

        <!-- Weekly race status -->
        <RouterLink
          v-if="auth.isAuthenticated && week"
          to="/race"
          class="hidden sm:flex items-center gap-2.5 h-11 px-3.5 rounded-control bg-surface-1 border border-line text-sm font-bold hover:bg-surface-2 transition-colors"
        >
          <span class="w-2 h-2 rounded-full bg-success ring-4 ring-success/20" aria-hidden="true" />
          Weekly race
          <span class="font-mono text-brand">{{ weekLeft }}</span>
        </RouterLink>

        <!-- Points + Level + XP -->
        <RouterLink
          v-if="auth.isAuthenticated"
          to="/profile"
          class="flex items-center gap-3 h-11 px-3.5 rounded-control bg-surface-1 border border-line hover:bg-surface-2 transition-colors"
          :aria-label="`${auth.levelInfo.points} points, level ${auth.levelInfo.level}`"
        >
          <span class="w-[22px] h-[22px] rounded-full bg-reward-fill text-reward-on text-[11px] font-extrabold flex items-center justify-center shadow-[inset_0_0_0_3px_#C98A0B]" aria-hidden="true">P</span>
          <span class="font-display font-bold text-[15px] text-reward tabular">{{ auth.levelInfo.points.toLocaleString() }}</span>
          <span class="hidden md:block w-px h-5 bg-line" aria-hidden="true" />
          <span class="hidden md:block text-[13px] font-extrabold">Lv {{ auth.levelInfo.level }}</span>
          <AppXpBar
            class="hidden md:flex !w-16"
            :level="auth.levelInfo.level"
            :value="auth.levelInfo.pct"
            :show-labels="false"
            size="sm"
          />
        </RouterLink>

        <!-- Theme toggle -->
        <AppTooltip :text="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'" position="bottom">
          <button
            class="icon-btn"
            @click="themeStore.toggle()"
            aria-label="Toggle theme"
          >
            <SunIcon v-if="themeStore.isDark" class="w-4 h-4" />
            <MoonIcon v-else class="w-4 h-4" />
          </button>
        </AppTooltip>

        <!-- User menu -->
        <div class="relative" ref="menuRef">
          <button
            class="flex items-center gap-2 pl-1.5 pr-2 h-11 rounded-control hover:bg-surface-2 transition-colors"
            @click="menuOpen = !menuOpen"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
          >
            <AppAvatar :name="auth.user?.name ?? ''" size="sm" />
            <span class="hidden lg:flex flex-col items-start text-left leading-tight max-w-[140px]">
              <span class="text-sm font-bold truncate max-w-full">{{ auth.user?.name ?? 'User' }}</span>
              <span class="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted mt-0.5">
                {{ auth.user?.isAdmin ? 'Admin' : 'Member' }}
              </span>
            </span>
            <ChevronDownIcon class="w-4 h-4 text-fg-muted transition-transform" :class="menuOpen ? 'rotate-180' : ''" />
          </button>

          <Transition name="dropdown-fade">
            <div
              v-if="menuOpen"
              class="absolute right-0 top-full mt-1 w-56 rounded-xl border border-line bg-surface-1 shadow-lg overflow-hidden"
            >
              <div class="px-4 py-3 border-b border-line">
                <p class="text-sm font-bold truncate">{{ auth.user?.name }}</p>
                <p class="text-[13px] text-fg-muted truncate">{{ auth.user?.email }}</p>
              </div>
              <div class="py-1">
                <RouterLink to="/profile"   class="dropdown-item" @click="menuOpen = false"><UserIcon class="w-4 h-4" /> My Profile</RouterLink>
                <RouterLink to="/settings"  class="dropdown-item" @click="menuOpen = false"><Cog6ToothIcon class="w-4 h-4" /> Settings</RouterLink>
                <RouterLink to="/changelog" class="dropdown-item" @click="menuOpen = false"><ClipboardDocumentListIcon class="w-4 h-4" /> Changelog</RouterLink>
                <RouterLink v-if="auth.user?.isAdmin" to="/admin" class="dropdown-item" @click="menuOpen = false"><ShieldCheckIcon class="w-4 h-4" /> Admin Panel</RouterLink>
              </div>
              <div class="py-1 border-t border-line">
                <button class="dropdown-item w-full text-danger" @click="onSignOut">
                  <ArrowRightOnRectangleIcon class="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUiStore } from '@/stores/useUiStore'
import { useRaceStore } from '@/stores/useRaceStore'
import AppXpBar from '@/components/ui/AppXpBar.vue'
import AppRewardBox from '@/components/ui/AppRewardBox.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const themeStore = useThemeStore()
const uiStore = useUiStore()
const router = useRouter()

const race = useRaceStore()

const menuOpen = ref(false)
const menuRef = ref(null)

// Weekly race countdown — "3d 14h"
const week = computed(() => race.periods.find((p) => p.key === 'week'))
const weekLeft = computed(() => {
  const ms = Math.max(0, week.value.end - race.now)
  const d = Math.floor(ms / 86_400_000)
  const h = Math.floor((ms % 86_400_000) / 3_600_000)
  return `${String(d).padStart(2, '0')}d ${String(h).padStart(2, '0')}h`
})

function onSignOut() {
  menuOpen.value = false
  auth.signOut()
  router.push('/login')
}

function onClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.icon-btn {
  @apply w-11 h-11 flex items-center justify-center rounded-control
    text-fg-2 bg-surface-1 border border-line
    hover:bg-surface-2 hover:text-fg
    transition-colors;
}
.dropdown-item {
  @apply flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-fg-2
    hover:bg-surface-2 hover:text-fg transition-colors cursor-pointer;
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

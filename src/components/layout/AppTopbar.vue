<template>
  <!--
    Desktop: single row — Logo | Nav | Actions
    Mobile:  two rows  — [Logo | Actions] / [Nav]
  -->
  <header class="fixed top-0 left-0 right-0 z-40 border-b
    bg-white/90 backdrop-blur-md border-surface-light-border
    dark:bg-surface-dark-base/95 dark:border-surface-dark-border">

    <!-- Row 1: Logo + Actions (always visible) -->
    <div class="flex items-center h-14 px-4 gap-2">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center flex-shrink-0 mr-4 sm:mr-8">
        <span class="hidden sm:block font-bold tracking-widest uppercase text-sm text-gray-900 dark:text-white whitespace-nowrap">RACE CONTR</span>
        <img src="@/assets/logo.png" alt="Race Control" class="w-6 h-6 object-contain mx-px" />
        <span class="hidden sm:block font-bold tracking-widest uppercase text-sm text-gray-900 dark:text-white">L</span>
      </RouterLink>

      <!-- Desktop nav (hidden on mobile — shown in row 2) -->
      <nav class="hidden sm:flex items-center gap-1 flex-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="nav-link--active"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- Spacer on mobile -->
      <div class="flex-1 sm:hidden" />

      <!-- Right actions (always visible) -->
      <div class="flex items-center gap-1">

        <!-- Daily Reward -->
        <div class="relative" ref="rewardRef" v-if="auth.isAuthenticated">
          <button
            class="relative icon-btn"
            :class="dailyRewardAvailable ? 'text-reward' : ''"
            @click="onClaimReward"
            @mouseenter="rewardPopoverOpen = true"
            @mouseleave="rewardPopoverOpen = false"
            aria-label="Daily Reward"
          >
            <GiftIcon class="w-4 h-4" :class="dailyRewardAvailable ? 'reward-bounce' : ''" />
            <!-- notification dot -->
            <span
              v-if="dailyRewardAvailable"
              class="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger ring-2 ring-white dark:ring-surface-dark-base"
            />
          </button>

          <!-- Popover -->
          <Transition name="dropdown-fade">
            <div
              v-if="rewardPopoverOpen && dailyRewardAvailable"
              class="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl p-3 pointer-events-none z-50
                bg-white border-surface-light-border
                dark:bg-surface-dark-raised dark:border-surface-dark-border"
            >
              <!-- Arrow -->
              <div class="absolute -top-1.5 right-3 w-3 h-3 rotate-45 border-l border-t
                bg-white border-surface-light-border
                dark:bg-surface-dark-raised dark:border-surface-dark-border" />
              <p class="text-xs font-semibold text-gray-900 dark:text-white">Daily Reward Available! 🎁</p>
              <p class="text-xs text-subtle mt-0.5">Click to claim your points</p>
            </div>
          </Transition>
        </div>

        <!-- Points + Level -->
        <RouterLink
          v-if="auth.isAuthenticated"
          to="/profile"
          class="hidden md:flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold text-reward hover:bg-reward/10 transition-colors"
        >
          <StarIcon class="w-3.5 h-3.5" />
          <span class="tabular-nums">{{ auth.user?.points?.toLocaleString() ?? 0 }}</span>
          <span class="text-subtle">· Lv.{{ auth.user?.level ?? 1 }}</span>
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

        <!-- Admin (only for admins) -->
        <AppTooltip v-if="auth.user?.isAdmin" text="Admin Panel" position="bottom">
          <RouterLink to="/admin" class="icon-btn" aria-label="Admin Panel">
            <Cog6ToothIcon class="w-4 h-4" />
          </RouterLink>
        </AppTooltip>

        <!-- Guide -->
        <AppTooltip text="How-To Guide" position="bottom">
          <RouterLink to="/guide" class="icon-btn" aria-label="How-To Guide">
            <BookOpenIcon class="w-4 h-4" />
          </RouterLink>
        </AppTooltip>

        <!-- User menu -->
        <div class="relative" ref="menuRef">
          <button
            class="flex items-center gap-1.5 pl-1.5 pr-1 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-dark-overlay transition-colors"
            @click="menuOpen = !menuOpen"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
          >
            <AppAvatar :name="auth.user?.name ?? ''" size="sm" />
            <span class="hidden md:block text-xs font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
              {{ auth.user?.name ?? 'User' }}
            </span>
            <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400 transition-transform" :class="menuOpen ? 'rotate-180' : ''" />
          </button>

          <Transition name="dropdown-fade">
            <div
              v-if="menuOpen"
              class="absolute right-0 top-full mt-1 w-52 rounded-xl border shadow-lg overflow-hidden
                bg-white border-surface-light-border
                dark:bg-surface-dark-raised dark:border-surface-dark-border"
            >
              <div class="px-3 py-2.5 border-b border-surface-light-border dark:border-surface-dark-border">
                <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ auth.user?.name }}</p>
                <p class="text-xs text-subtle truncate">{{ auth.user?.email }}</p>
              </div>
              <div class="py-1">
                <RouterLink to="/profile"   class="dropdown-item" @click="menuOpen = false"><UserIcon class="w-4 h-4" /> My Profile</RouterLink>
                <RouterLink to="/settings"  class="dropdown-item" @click="menuOpen = false"><Cog6ToothIcon class="w-4 h-4" /> Settings</RouterLink>
                <RouterLink to="/changelog" class="dropdown-item" @click="menuOpen = false"><ClipboardDocumentListIcon class="w-4 h-4" /> Changelog</RouterLink>
                <RouterLink v-if="auth.user?.isAdmin" to="/admin" class="dropdown-item" @click="menuOpen = false"><ShieldCheckIcon class="w-4 h-4" /> Admin Panel</RouterLink>
              </div>
              <div class="py-1 border-t border-surface-light-border dark:border-surface-dark-border">
                <button class="dropdown-item w-full text-danger" @click="onSignOut">
                  <ArrowRightOnRectangleIcon class="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Row 2: Mobile nav (hidden on sm+) -->
    <nav class="flex sm:hidden items-center gap-1 px-3 pb-2 overflow-x-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link flex-shrink-0"
        active-class="nav-link--active"
      >
        <component :is="item.icon" class="w-4 h-4" />
        {{ item.label }}
      </RouterLink>
    </nav>

  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useThemeStore } from '@/stores/useThemeStore'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'
import {
  HomeIcon,
  BoltIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  StarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  GiftIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

const menuOpen = ref(false)
const menuRef = ref(null)
const rewardRef = ref(null)
const rewardPopoverOpen = ref(false)

// TODO: drive from API — true when user hasn't claimed today's reward
const dailyRewardAvailable = ref(true)

function onClaimReward() {
  if (!dailyRewardAvailable.value) return
  rewardPopoverOpen.value = false
  // TODO: call real reward API
  auth.addPoints(50)
  dailyRewardAvailable.value = false
}

const navItems = [
  { to: '/',           label: 'Home',      icon: HomeIcon },
  { to: '/activity',   label: 'Activity',  icon: BoltIcon },
  { to: '/directory',  label: 'Directory', icon: BuildingOffice2Icon },
  { to: '/dashboards', label: 'Dashboard', icon: ChartBarIcon },
]

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
.nav-link {
  @apply px-4 h-9 flex items-center gap-2 text-sm font-medium rounded-lg
    text-gray-600 dark:text-gray-400
    hover:text-gray-900 dark:hover:text-white
    hover:bg-gray-100 dark:hover:bg-surface-dark-overlay
    transition-colors;
}
.nav-link--active {
  @apply text-brand-400 bg-brand-400/10 ring-1 ring-brand-400/50;
}
.icon-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-lg
    text-gray-500 dark:text-gray-400
    hover:bg-gray-100 dark:hover:bg-surface-dark-overlay
    hover:text-gray-700 dark:hover:text-gray-200
    transition-colors;
}
.dropdown-item {
  @apply flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300
    hover:bg-gray-50 dark:hover:bg-surface-dark-overlay transition-colors cursor-pointer;
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

/* Daily reward bounce animation */
.reward-bounce {
  animation: reward-bounce 1.4s ease-in-out infinite;
  transform-origin: bottom center;
}
@keyframes reward-bounce {
  0%, 100% { transform: translateY(0)  rotate(0deg);   }
  15%       { transform: translateY(-5px) rotate(-8deg); }
  30%       { transform: translateY(0)  rotate(6deg);   }
  45%       { transform: translateY(-3px) rotate(-4deg); }
  60%       { transform: translateY(0)  rotate(2deg);   }
  75%       { transform: translateY(-1px) rotate(0deg); }
}
</style>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 border-b
    bg-white/80 backdrop-blur-md border-surface-light-border
    dark:bg-surface-dark-base/90 dark:border-surface-dark-border">

    <!-- Left: Logo -->
    <RouterLink to="/" class="flex items-center gap-2 mr-8 flex-shrink-0">
      <!-- Replace with actual SVG logo when available -->
      <div class="w-7 h-7 rounded-lg bg-brand-400 flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      <span class="text-sm font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
        Race Control
      </span>
    </RouterLink>

    <!-- Center: Main nav -->
    <nav class="flex items-center gap-1 flex-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        active-class="nav-link--active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- Right: actions -->
    <div class="flex items-center gap-1 ml-4">

      <!-- Points + Level (only when authenticated) -->
      <RouterLink
        v-if="auth.isAuthenticated"
        to="/profile"
        class="hidden md:flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold
          text-reward hover:bg-reward/10 transition-colors"
        title="Your points and level"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="tabular-nums">{{ auth.user?.points?.toLocaleString() ?? 0 }}</span>
        <span class="text-subtle">· Lv.{{ auth.user?.level ?? 1 }}</span>
      </RouterLink>

      <!-- Theme toggle -->
      <AppTooltip :text="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'" position="bottom">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500
            hover:bg-gray-100 dark:hover:bg-surface-dark-overlay dark:text-gray-400
            hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          @click="themeStore.toggle()"
          aria-label="Toggle theme"
        >
          <!-- Sun (shown in dark mode to switch to light) -->
          <svg v-if="themeStore.isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <!-- Moon (shown in light mode to switch to dark) -->
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
      </AppTooltip>

      <!-- Settings / Admin — FIX: gear icon goes to Settings, not Admin -->
      <!--
        UX NOTE: In the original app, the gear icon navigated to the Admin panel.
        Here it correctly links to /settings (user preferences).
        Admin access is via the user dropdown menu below.
      -->
      <AppTooltip text="Settings" position="bottom">
        <RouterLink
          to="/settings"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500
            hover:bg-gray-100 dark:hover:bg-surface-dark-overlay dark:text-gray-400
            hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Settings"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </RouterLink>
      </AppTooltip>

      <!-- How-To Guide — book icon (correct convention) -->
      <AppTooltip text="How-To Guide" position="bottom">
        <RouterLink
          to="/guide"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500
            hover:bg-gray-100 dark:hover:bg-surface-dark-overlay dark:text-gray-400
            hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="How-To Guide"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </RouterLink>
      </AppTooltip>

      <!-- User menu dropdown -->
      <div class="relative" ref="menuRef">
        <button
          class="flex items-center gap-2 pl-2 pr-1 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-dark-overlay transition-colors"
          @click="menuOpen = !menuOpen"
          aria-haspopup="true"
          :aria-expanded="menuOpen"
        >
          <AppAvatar :name="auth.user?.name ?? ''" size="sm" />
          <span class="hidden md:block text-xs font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
            {{ auth.user?.name ?? 'User' }}
          </span>
          <svg class="w-3.5 h-3.5 text-gray-400 transition-transform" :class="menuOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Dropdown -->
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
              <RouterLink to="/profile" class="dropdown-item" @click="menuOpen = false">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                My Profile
              </RouterLink>

              <RouterLink to="/settings" class="dropdown-item" @click="menuOpen = false">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Settings
              </RouterLink>

              <RouterLink to="/changelog" class="dropdown-item" @click="menuOpen = false">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Changelog
              </RouterLink>

              <!-- Admin — only shown to admin users -->
              <RouterLink
                v-if="auth.user?.isAdmin"
                to="/admin"
                class="dropdown-item"
                @click="menuOpen = false"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Admin Panel
              </RouterLink>
            </div>

            <div class="py-1 border-t border-surface-light-border dark:border-surface-dark-border">
              <button
                class="dropdown-item w-full text-danger dark:text-danger"
                @click="onSignOut"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useThemeStore } from '@/stores/useThemeStore'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'

const auth = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

const menuOpen = ref(false)
const menuRef = ref(null)

const navItems = [
  { to: '/',           label: 'Home' },
  { to: '/activity',   label: 'Activity' },
  { to: '/directory',  label: 'Directory' },
  { to: '/dashboards', label: 'Dashboard' },
]

function onSignOut() {
  menuOpen.value = false
  auth.signOut()
  router.push('/login')
}

// Close dropdown on outside click
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
  @apply px-3 h-8 flex items-center text-sm font-medium rounded-lg
    text-gray-600 dark:text-gray-400
    hover:text-gray-900 dark:hover:text-white
    hover:bg-gray-100 dark:hover:bg-surface-dark-overlay
    transition-colors;
}
.nav-link--active {
  @apply text-gray-900 dark:text-white bg-gray-100 dark:bg-surface-dark-overlay;
}
.dropdown-item {
  @apply flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300
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
</style>

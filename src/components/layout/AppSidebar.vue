<template>
  <!-- Mobile backdrop -->
  <Transition name="backdrop-fade">
    <div
      v-if="uiStore.sidebarOpen"
      class="fixed inset-0 bg-black/50 z-20 md:hidden"
      @click="uiStore.closeSidebar()"
    />
  </Transition>

  <!-- Sidebar: full (w-64) on mobile drawer + lg, icon rail (w-16) on md.
       On lg the user can collapse it to the rail too (uiStore.sidebarCollapsed). -->
  <aside
    :class="[
      'fixed left-0 top-0 bottom-0 z-30 flex flex-col',
      'bg-surface-1 dark:bg-[#08171F] border-r border-line',
      'transition-all duration-200 ease-out',
      c.width,
      uiStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <RouterLink
      to="/"
      :class="['flex items-center px-4 md:px-[19px] h-[72px] flex-shrink-0 transition-all duration-200 ease-out', c.logoPad, c.logoGap]"
      @click="uiStore.closeSidebar()"
    >
      <!-- Logo grows when the sidebar is a rail (no wordmark next to it) -->
      <img :src="logoUrl" alt="" :class="['w-auto flex-shrink-0 transition-[height] duration-200 ease-out', c.logoImg]" width="20" height="28" />
      <span :class="['font-display font-bold text-[15px] tracking-[0.02em]', LABEL, c.label]">
        RACE CONTROL
      </span>
    </RouterLink>

    <!-- Collapse / expand (lg+) — sits on the sidebar's right edge -->
    <button
      type="button"
      class="hidden lg:flex absolute -right-3.5 top-[22px] w-7 h-7 rounded-full items-center justify-center bg-surface-2 border border-line text-fg-2 hover:text-fg hover:bg-surface-3 shadow-sm transition-colors"
      :aria-label="uiStore.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :aria-expanded="!uiStore.sidebarCollapsed"
      :title="uiStore.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="uiStore.toggleSidebarCollapsed()"
    >
      <ChevronLeftIcon :class="['w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200', uiStore.sidebarCollapsed && 'rotate-180']" />
    </button>

    <!-- Nav groups -->
    <nav aria-label="Main" :class="['flex-1 overflow-y-auto px-4 md:px-2 py-2 space-y-5', c.navPad]">
      <div v-for="group in visibleGroups" :key="group.title" class="space-y-1">
        <p :class="c.groupTitle" class="px-3 pb-1.5 overflow-hidden whitespace-nowrap transition-all duration-200 ease-out text-[11px] font-extrabold uppercase tracking-[0.1em] text-fg-muted">
          {{ group.title }}
        </p>
        <div :class="c.rail" class="mx-2 mb-2 border-t border-line animate-fade-in" aria-hidden="true" />
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :class="navItemClass(item)"
          :aria-current="isActive(item) ? 'page' : undefined"
          :title="item.label"
          @click="uiStore.closeSidebar()"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span :class="[LABEL, c.label]">{{ item.label }}</span>
          <span
            v-if="item.tag"
            :class="c.tag"
            class="ml-auto h-[22px] rounded-md bg-surface-3 font-mono text-[11px] font-bold text-brand items-center overflow-hidden whitespace-nowrap transition-all duration-200 ease-out"
          >{{ item.tag }}</span>
        </RouterLink>
      </div>
    </nav>

    <!-- Bottom: tools (Design System) · daily bonus. The user lives in the topbar menu. -->
    <div :class="['p-4 md:p-2 space-y-3 flex-shrink-0', c.bottomPad]">
      <template v-if="footerItems.length">
        <div class="mx-2 border-t border-line" aria-hidden="true" />
        <nav aria-label="Tools" class="space-y-1">
          <RouterLink
            v-for="item in footerItems"
            :key="item.to"
            :to="item.to"
            :class="navItemClass(item)"
            :aria-current="isActive(item) ? 'page' : undefined"
            :title="item.label"
            @click="uiStore.closeSidebar()"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span :class="[LABEL, c.label]">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </template>

      <!-- Full card (mobile drawer + lg) -->
      <div
        v-if="auth.isAuthenticated"
        class="rounded-2xl p-4 border overflow-hidden transition-all duration-200 ease-out"
        :class="[c.card, auth.dailyBonusAvailable
          ? 'bg-reward-fill/[0.08] border-reward-fill/35'
          : 'bg-surface-2 border-line']"
      >
        <div class="flex items-center gap-2.5">
          <span
            class="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            :class="auth.dailyBonusAvailable ? 'bg-reward-fill text-reward-on' : 'bg-surface-3 text-fg-muted'"
          >
            <GiftIcon class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <p class="text-[15px] font-extrabold">Daily bonus</p>
            <p class="text-[13px]" :class="auth.dailyBonusAvailable ? 'text-reward' : 'text-fg-muted'">
              {{ auth.dailyBonusAvailable ? `+${auth.dailyBonusPoints} pts ready` : 'Claimed — back tomorrow' }}
            </p>
          </div>
        </div>
        <AppButton
          v-if="auth.dailyBonusAvailable"
          variant="reward"
          size="sm"
          full-width
          class="mt-3"
          @click="auth.claimDailyBonus()"
        >Claim bonus</AppButton>
      </div>

      <!-- Icon-only (md rail). Topbar box already animates, so this one stays still. -->
      <div v-if="auth.isAuthenticated" :class="c.railFlex" class="justify-center animate-fade-in">
        <AppRewardBox
          :available="auth.dailyBonusAvailable"
          :points="auth.dailyBonusPoints"
          :animate="false"
          :dot="false"
          placement="right"
          @claim="auth.claimDailyBonus()"
        />
      </div>

    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from '@/stores/useUiStore'
import { useRaceStore } from '@/stores/useRaceStore'
import AppButton from '@/components/ui/AppButton.vue'
import AppRewardBox from '@/components/ui/AppRewardBox.vue'
import logoUrl from '@/assets/logo.svg'
import {
  HomeIcon,
  BoltIcon,
  BuildingOffice2Icon,
  TrophyIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  SwatchIcon,
  GiftIcon,
  ChevronLeftIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const auth = useAuthStore()
const uiStore = useUiStore()
const race = useRaceStore()

// Week race always shows its countdown in the nav, whatever tab Metrics has open
const weekDaysLeft = computed(() => race.periods.find((p) => p.key === 'week')?.daysLeft)

const groups = computed(() => [
  {
    title: 'Workspace',
    items: [
      { to: '/',           label: 'Home',       icon: HomeIcon },
      { to: '/activity',   label: 'Activity',   icon: BoltIcon },
      { to: '/directory',  label: 'Directory',  icon: BuildingOffice2Icon },
    ],
  },
  {
    title: 'Compete',
    items: [
      { to: '/race',    label: 'Race',    icon: TrophyIcon, tag: weekDaysLeft.value > 0 ? `${weekDaysLeft.value}d` : '<1d' },
      { to: '/profile', label: 'Profile', icon: UserCircleIcon },
    ],
  },
  {
    title: 'Admin',
    items: [
      { to: '/admin', label: 'Admin', icon: ShieldCheckIcon, adminOnly: true },
      { to: '/guide', label: 'Guide', icon: BookOpenIcon },
    ],
  },
])

// Pinned to the bottom of the sidebar, apart from the main nav
const footerItems = computed(() =>
  [{ to: '/ds', label: 'Design System', icon: SwatchIcon, adminOnly: true }]
    .filter((i) => !i.adminOnly || auth.user?.isAdmin)
)

const visibleGroups = computed(() =>
  groups.value
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.adminOnly || auth.user?.isAdmin) }))
    .filter((g) => g.items.length)
)

function isActive(item) {
  return item.to === '/' ? route.path === '/' : route.path.startsWith(item.to)
}

// Responsive class sets. md is always the icon rail; lg is full unless collapsed.
// On lg, labels stay in the DOM and animate width/opacity so collapsing feels fluid
// (display toggles can't transition). Full literal strings so Tailwind's scanner sees them.
const LABEL = 'overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out'

const c = computed(() => uiStore.sidebarCollapsed
  ? {
      width: 'w-64 md:w-16',
      label: 'block md:hidden lg:block lg:max-w-0 lg:opacity-0',
      tag: 'flex px-2 md:hidden lg:flex lg:max-w-0 lg:px-0 lg:opacity-0',
      groupTitle: 'block md:hidden lg:block lg:max-h-0 lg:pb-0 lg:opacity-0',
      card: 'block md:hidden lg:block lg:max-h-0 lg:p-0 lg:border-0 lg:opacity-0',
      rail: 'hidden md:block',
      railFlex: 'hidden md:flex',
      logoImg: 'h-7 md:h-9',
      logoGap: 'gap-2.5 md:gap-0',
      itemGap: 'gap-3 md:gap-0',
      logoPad: '',
      navPad: '',
      bottomPad: '',
      justify: '',
    }
  : {
      width: 'w-64 md:w-16 lg:w-64',
      label: 'block md:hidden lg:block lg:max-w-[180px] lg:opacity-100',
      tag: 'flex px-2 md:hidden lg:flex lg:max-w-[48px] lg:opacity-100',
      groupTitle: 'block md:hidden lg:block lg:max-h-8 lg:opacity-100',
      card: 'block md:hidden lg:block lg:max-h-[220px] lg:opacity-100',
      rail: 'hidden md:block lg:hidden',
      railFlex: 'hidden md:flex lg:hidden',
      logoImg: 'h-7 md:h-9 lg:h-7',
      logoGap: 'gap-2.5 md:gap-0 lg:gap-2.5',
      itemGap: 'gap-3 md:gap-0 lg:gap-3',
      logoPad: 'lg:px-6',
      navPad: 'lg:px-4',
      bottomPad: 'lg:p-4',
      justify: 'lg:justify-start',
    })

function navItemClass(item) {
  return [
    'flex items-center h-11 px-3 md:justify-center rounded-xl text-[15px] font-bold transition-all duration-200 ease-out',
    c.value.justify,
    c.value.itemGap,
    isActive(item)
      ? 'bg-surface-2 text-fg ring-1 ring-inset ring-line [&>svg]:text-brand'
      : 'text-fg-2 hover:bg-surface-2 hover:text-fg',
  ]
}
</script>

<style scoped>
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.2s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}
</style>

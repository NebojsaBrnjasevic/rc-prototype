<template>
  <!-- Phones only (below md): 5-slot tab bar — Home · Activity · Log · Race · More.
       The sidebar takes over from md up. -->
  <nav
    aria-label="Main"
    class="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-1/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
  >
    <ul class="grid grid-cols-5 h-[68px]">
      <li v-for="item in left" :key="item.to">
        <RouterLink :to="item.to" :class="tabClass(isActive(item))" :aria-current="isActive(item) ? 'page' : undefined">
          <component :is="item.icon" class="w-6 h-6" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>

      <!-- Main action, raised above the bar -->
      <li class="flex justify-center">
        <button
          type="button"
          class="-mt-6 w-[60px] h-[60px] rounded-full bg-brand text-brand-on flex items-center justify-center ring-[6px] ring-page shadow-[0_10px_30px_-6px_rgb(var(--rc-brand)/0.8)] active:scale-95 transition-transform"
          aria-label="Log activity"
          @click="ui.openActivityModal()"
        >
          <PlusIcon class="w-7 h-7 stroke-[2.5]" />
        </button>
      </li>

      <li>
        <RouterLink to="/race" :class="tabClass(isActive(race))" :aria-current="isActive(race) ? 'page' : undefined">
          <span class="relative">
            <TrophyIcon class="w-6 h-6" />
            <span class="absolute -top-1.5 left-4 h-4 px-1 rounded-[5px] bg-surface-3 font-mono text-[10px] font-bold leading-4 text-brand">{{ raceTag }}</span>
          </span>
          <span>Race</span>
        </RouterLink>
      </li>

      <li>
        <button
          type="button"
          :class="tabClass(moreOpen || moreActive)"
          aria-haspopup="dialog"
          :aria-expanded="moreOpen"
          @click="moreOpen = true"
        >
          <span class="relative">
            <Squares2X2Icon class="w-6 h-6" />
            <span
              v-if="auth.dailyBonusAvailable"
              class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-reward-fill ring-2 ring-surface-1"
              aria-hidden="true"
            />
          </span>
          <span>More</span>
        </button>
      </li>
    </ul>
  </nav>

  <!-- More: bottom sheet with the rest of the nav + daily bonus -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="moreOpen" class="md:hidden fixed inset-0 z-[60] flex flex-col justify-end" @keydown.esc="moreOpen = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden="true" @click="moreOpen = false" />

        <div
          ref="sheet"
          role="dialog"
          aria-modal="true"
          aria-label="More"
          tabindex="-1"
          class="sheet-panel relative rounded-t-[28px] bg-surface-1 border-t border-line px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] outline-none max-h-[85vh] overflow-y-auto"
        >
          <div class="mx-auto mb-4 w-10 h-1.5 rounded-full bg-line" aria-hidden="true" />

          <ul class="space-y-1">
            <li v-for="item in more" :key="item.to">
              <RouterLink
                :to="item.to"
                :class="[
                  'flex items-center gap-3 h-12 px-3 rounded-xl text-[15px] font-bold',
                  isActive(item) ? 'bg-surface-2 text-fg ring-1 ring-inset ring-line [&>svg]:text-brand' : 'text-fg-2',
                ]"
                :aria-current="isActive(item) ? 'page' : undefined"
              >
                <component :is="item.icon" class="w-5 h-5" />
                {{ item.label }}
                <ChevronRightIcon class="w-4 h-4 ml-auto text-fg-muted" />
              </RouterLink>
            </li>
          </ul>

          <!-- Daily bonus -->
          <div
            :class="[
              'mt-4 rounded-2xl p-4 border flex items-center gap-3',
              auth.dailyBonusAvailable ? 'bg-reward-fill/[0.08] border-reward-fill/35' : 'bg-surface-2 border-line',
            ]"
          >
            <span
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="auth.dailyBonusAvailable ? 'bg-reward-fill text-reward-on' : 'bg-surface-3 text-fg-muted'"
            >
              <GiftIcon class="w-5 h-5" />
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-[15px] font-extrabold">Daily bonus</p>
              <p class="text-[13px]" :class="auth.dailyBonusAvailable ? 'text-reward' : 'text-fg-muted'">
                {{ auth.dailyBonusAvailable ? `+${auth.dailyBonusPoints} pts ready` : 'Claimed — back tomorrow' }}
              </p>
            </div>
            <AppButton v-if="auth.dailyBonusAvailable" variant="reward" size="sm" @click="auth.claimDailyBonus()">Claim</AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { PlusIcon, TrophyIcon, Squares2X2Icon, GiftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from '@/stores/useUiStore'
import AppButton from '@/components/ui/AppButton.vue'
import { useNav } from './useNav'

const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()
const { groups, footerItems, raceTag, isActive } = useNav()

const IN_BAR = ['/', '/activity', '/race']
const all = computed(() => [...groups.value.flatMap((g) => g.items), ...footerItems.value])
const left = computed(() => all.value.filter((i) => i.to === '/' || i.to === '/activity'))
const race = { to: '/race' }
const more = computed(() => all.value.filter((i) => !IN_BAR.includes(i.to)))
const moreActive = computed(() => more.value.some(isActive))

const moreOpen = ref(false)
const sheet = ref(null)
watch(() => route.fullPath, () => { moreOpen.value = false })
watch(moreOpen, async (open) => {
  if (open) { await nextTick(); sheet.value?.focus() }
})

function tabClass(active) {
  return [
    'w-full h-full flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors',
    active ? 'text-brand' : 'text-fg-muted active:text-fg',
  ]
}
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity .2s ease; }
.sheet-enter-active .sheet-panel, .sheet-leave-active .sheet-panel { transition: transform .25s cubic-bezier(.2, .8, .2, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet-panel, .sheet-leave-to .sheet-panel { transform: translateY(100%); }
</style>

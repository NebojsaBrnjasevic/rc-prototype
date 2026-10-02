<template>
  <div class="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-4 right-4 z-[70] flex flex-col gap-2 w-[min(360px,calc(100vw-32px))]" aria-live="polite" role="status">
    <TransitionGroup name="toast">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        :class="[
          'flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] bg-surface-1',
          t.tone === 'reward' ? 'border-reward-fill/40' : t.tone === 'danger' ? 'border-danger/40' : 'border-success/40',
        ]"
      >
        <span :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', TONE[t.tone] ?? TONE.success]">
          <component :is="ICON[t.tone] ?? CheckIcon" class="w-[18px] h-[18px]" />
        </span>
        <p class="text-sm font-bold flex-1">{{ t.message }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CheckIcon, TrophyIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useUiStore } from '@/stores/useUiStore'

const ui = useUiStore()
const TONE = { success: 'bg-success/15 text-success', reward: 'bg-reward-fill text-reward-on', danger: 'bg-danger/15 text-danger' }
const ICON = { success: CheckIcon, reward: TrophyIcon, danger: ExclamationTriangleIcon }
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>

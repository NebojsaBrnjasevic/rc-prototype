<template>
  <div ref="root" class="relative inline-flex">
    <slot name="trigger" :open="open" :toggle="toggle" />
    <Transition name="pop">
      <div
        v-if="open"
        role="dialog"
        :aria-label="label"
        :class="[
          'absolute z-40 top-full mt-2 rounded-2xl border border-line bg-surface-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-5',
          align === 'end' ? 'right-0' : 'left-0',
          widthClass,
        ]"
        @keydown.esc.stop="close"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/** Click-to-open panel (filters, menus). Closes on outside click and Esc. */
defineProps({
  label: { type: String, default: null },
  /** 'start' | 'end' */
  align: { type: String, default: 'start' },
  widthClass: { type: String, default: 'w-80' },
})

const root = ref(null)
const open = ref(false)
const toggle = () => { open.value = !open.value }
const close = () => { open.value = false }

function onDoc(e) { if (open.value && root.value && !root.value.contains(e.target)) close() }
onMounted(() => document.addEventListener('mousedown', onDoc))
onUnmounted(() => document.removeEventListener('mousedown', onDoc))

defineExpose({ close })
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: opacity 0.15s ease, translate 0.15s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; translate: 0 -4px; }
</style>

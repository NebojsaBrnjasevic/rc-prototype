<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue" class="fixed inset-0 z-[60] flex justify-end" @keydown.esc.stop="close">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden="true" @mousedown="close" />

        <aside
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :class="['drawer-panel relative w-full h-full bg-surface-1 border-l border-line shadow-2xl flex flex-col outline-none', widthClass]"
        >
          <header class="flex items-start gap-3 px-6 py-5 border-b border-line flex-shrink-0">
            <div class="flex-1 min-w-0">
              <slot name="header">
                <h2 :id="titleId" class="font-display font-semibold text-xl">{{ title }}</h2>
                <p v-if="subtitle" class="text-sm text-fg-2 mt-1">{{ subtitle }}</p>
              </slot>
            </div>
            <button
              type="button"
              class="w-9 h-9 flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors flex-shrink-0"
              aria-label="Close"
              @click="close"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-6 py-5 scroll-thin">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="px-6 py-4 border-t border-line flex items-center gap-3 flex-shrink-0">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

/** Side panel for details and secondary forms (activity details, New reseller…). */
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  /** 'md' (480px) | 'lg' (640px) */
  width: { type: String, default: 'md' },
  titleId: { type: String, default: () => `drawer-${Math.random().toString(36).slice(2, 7)}` },
})
const emit = defineEmits(['update:modelValue', 'close'])

const panel = ref(null)
let lastFocus = null

const widthClass = computed(() => ({ md: 'max-w-[480px]', lg: 'max-w-[640px]' }[props.width] ?? 'max-w-[480px]'))

function close() {
  emit('update:modelValue', false)
  emit('close')
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    lastFocus = document.activeElement
    await nextTick()
    panel.value?.focus()
  } else {
    lastFocus?.focus?.()
  }
})
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.22s ease;
}
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>

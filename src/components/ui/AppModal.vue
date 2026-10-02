<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
        @mousedown.self="onBackdropClick"
        @keydown.esc.stop="close"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" @mousedown="onBackdropClick" />

        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :class="[
            'modal-panel relative z-10 w-full bg-surface-1 border border-line rounded-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] flex flex-col max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)] outline-none',
            sizeClass,
          ]"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 px-6 py-4 border-b border-line flex-shrink-0">
            <slot name="header">
              <h2 :id="titleId" class="font-display font-semibold text-xl flex-1">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="w-9 h-9 flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors flex-shrink-0"
              aria-label="Close"
              @click="close"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5 scroll-thin">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-line flex items-center justify-end gap-3 flex-shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  /** 'sm' | 'md' | 'lg' | 'xl' */
  size: { type: String, default: 'md' },
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdrop: { type: Boolean, default: true },
  /** id for aria-labelledby when you render your own title in #header */
  titleId: { type: String, default: () => `modal-${Math.random().toString(36).slice(2, 7)}` },
})

const emit = defineEmits(['update:modelValue', 'close'])

const panel = ref(null)
let lastFocus = null

const sizeClass = computed(() => ({
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}[props.size] ?? 'max-w-xl'))

function close() {
  emit('update:modelValue', false)
  emit('close')
}
function onBackdropClick() {
  if (props.closeOnBackdrop) close()
}

// Focus the dialog on open, give focus back on close
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: translateY(8px) scale(0.98);
}
</style>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @mousedown.self="onBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

        <!-- Panel -->
        <div
          role="dialog"
          :aria-label="title"
          aria-modal="true"
          :class="[
            'relative z-10 w-full bg-white dark:bg-surface-dark-raised rounded-2xl shadow-2xl flex flex-col overflow-hidden',
            sizeClass,
          ]"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-surface-light-border dark:border-surface-dark-border">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-surface-dark-overlay dark:hover:text-gray-200 transition-colors"
              @click="$emit('update:modelValue', false)"
              aria-label="Close"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <slot />
          </div>

          <!-- Footer (optional) -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-surface-light-border dark:border-surface-dark-border flex items-center justify-end gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  /** 'sm' | 'md' | 'lg' | 'xl' */
  size: { type: String, default: 'md' },
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

const sizeClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}[props.size] ?? 'max-w-lg'))

function onBackdropClick() {
  if (props.closeOnBackdrop) emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

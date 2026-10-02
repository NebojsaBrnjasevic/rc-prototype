<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    class="grid gap-1.5 p-1.5 rounded-2xl bg-page/60 border border-line"
    :style="{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }"
    @keydown="onKeydown"
  >
    <button
      v-for="(tab, i) in tabs"
      :key="tab.value"
      :ref="(el) => (buttons[i] = el)"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :tabindex="modelValue === tab.value ? 0 : -1"
      class="min-w-0 min-h-[56px] px-2 sm:px-3.5 py-2 rounded-[11px] flex flex-col justify-center gap-1.5 text-left transition-colors cursor-pointer"
      :class="modelValue === tab.value
        ? 'bg-surface-3 ring-1 ring-inset ring-brand'
        : 'hover:bg-surface-2'"
      @click="select(tab.value)"
    >
      <span class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2 w-full min-w-0">
        <span :class="['text-[13px] sm:text-sm font-extrabold truncate', modelValue === tab.value ? 'text-fg' : 'text-fg-2']">
          <span class="sm:hidden">{{ tab.labelShort ?? tab.label }}</span><span class="hidden sm:inline">{{ tab.label }}</span>
        </span>
        <span
          v-if="tab.meta"
          :class="['font-mono text-[11px] sm:text-xs font-bold whitespace-nowrap truncate', modelValue === tab.value ? 'text-brand' : 'text-fg-muted']"
        >
          <span class="sm:hidden">{{ tab.metaShort ?? tab.meta }}</span><span class="hidden sm:inline">{{ tab.meta }}</span>
        </span>
      </span>
      <span
        v-if="tab.progress !== undefined"
        class="block w-full h-1 rounded-full bg-surface-3 overflow-hidden"
        role="presentation"
      >
        <span
          class="block h-full rounded-full transition-all duration-500"
          :class="modelValue === tab.value ? 'bg-brand' : 'bg-line'"
          :style="{ width: `${Math.max(2, Math.min(100, tab.progress))}%` }"
        />
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/**
 * Period switcher that doubles as a progress indicator.
 * Each tab shows its label, a meta string (e.g. "3d left") and how much
 * of the period has elapsed — replaces separate "period progress" bars.
 */
const props = defineProps({
  modelValue: { type: String, required: true },
  /** [{ value, label, labelShort?, meta?, metaShort?, progress? (0–100) }] — *Short used below sm */
  tabs:       { type: Array, required: true },
  ariaLabel:  { type: String, default: 'Period' },
})
const emit = defineEmits(['update:modelValue'])

const buttons = ref([])

function select(value) {
  emit('update:modelValue', value)
}

// Arrow keys move between tabs (WAI-ARIA tabs pattern)
function onKeydown(e) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
  e.preventDefault()
  const idx = props.tabs.findIndex((t) => t.value === props.modelValue)
  const last = props.tabs.length - 1
  const next = { ArrowLeft: idx <= 0 ? last : idx - 1, ArrowRight: idx >= last ? 0 : idx + 1, Home: 0, End: last }[e.key]
  select(props.tabs[next].value)
  buttons.value[next]?.focus()
}
</script>

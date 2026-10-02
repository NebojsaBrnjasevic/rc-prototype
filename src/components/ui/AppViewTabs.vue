<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    class="flex gap-1 border-b border-line overflow-x-auto overflow-y-hidden"
    @keydown="onKeydown"
  >
    <button
      v-for="(tab, i) in tabs"
      :id="`${idPrefix}-tab-${tab.value}`"
      :key="tab.value"
      :ref="(el) => (buttons[i] = el)"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :aria-controls="`${idPrefix}-panel-${tab.value}`"
      :tabindex="modelValue === tab.value ? 0 : -1"
      class="relative h-12 px-4 -mb-px flex items-center gap-2 text-[15px] font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer"
      :class="modelValue === tab.value
        ? 'border-brand text-fg'
        : 'border-transparent text-fg-2 hover:text-fg hover:border-line'"
      @click="select(tab.value)"
    >
      <component
        :is="tab.icon"
        v-if="tab.icon && typeof tab.icon !== 'string'"
        :class="['w-[18px] h-[18px]', modelValue === tab.value ? 'text-brand' : '']"
      />
      <span v-else-if="tab.icon">{{ tab.icon }}</span>
      {{ tab.label }}
      <span
        v-if="tab.count !== undefined && tab.count !== null"
        :class="['min-w-[22px] h-[22px] px-1.5 rounded-md text-xs font-extrabold tabular flex items-center justify-center', COUNT_TONE[tab.tone ?? 'neutral']]"
      >{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/**
 * Underline tabs for switching views of the same page.
 * Pair each tab with a panel: <div role="tabpanel" :id="`${idPrefix}-panel-${value}`"
 * :aria-labelledby="`${idPrefix}-tab-${value}`">.
 */
const props = defineProps({
  modelValue: { type: String, required: true },
  /** [{ value, label, icon?, count?, tone?: 'neutral' | 'brand' | 'warning' | 'danger' }] */
  tabs:       { type: Array,  required: true },
  ariaLabel:  { type: String, default: null },
  /** Prefix for tab/panel ids (aria-controls) */
  idPrefix:   { type: String, default: 'tabs' },
})
const emit = defineEmits(['update:modelValue'])

const COUNT_TONE = {
  neutral: 'bg-surface-3 text-fg-2',
  brand:   'bg-brand/15 text-brand',
  warning: 'bg-warning/15 text-warning',
  danger:  'bg-danger/15 text-danger',
}

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

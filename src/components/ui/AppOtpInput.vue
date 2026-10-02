<template>
  <div role="group" :aria-label="label" class="flex justify-center gap-2 sm:gap-2.5" @paste.prevent="onPaste">
    <input
      v-for="(d, i) in digits"
      :key="i"
      :ref="(el) => (inputs[i] = el)"
      :value="d"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      :autocomplete="i === 0 ? 'one-time-code' : 'off'"
      :aria-label="`Digit ${i + 1} of ${length}`"
      :aria-invalid="error || undefined"
      :disabled="disabled"
      :class="[
        'w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border text-center font-mono font-bold text-2xl tabular bg-surface-2 text-fg outline-none transition-all',
        'focus:ring-2 focus:ring-brand focus:border-brand focus:bg-surface-3',
        error ? 'border-danger' : d ? 'border-brand/50' : 'border-line',
        'disabled:opacity-50',
      ]"
      @focus="onFocus(i)"
      @click="onClick"
      @input="onInput(i, $event)"
      @keydown.backspace="onBackspace(i, $event)"
      @keydown.left.prevent="focusAt(i - 1)"
      @keydown.right.prevent="focusAt(i + 1)"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

/**
 * One-time code input — one box per digit.
 * Auto-advances, Backspace goes back, paste fills every box, arrow keys move.
 * `autofill` (prototype only): clicking a box while empty fills this code.
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  length:     { type: Number, default: 6 },
  label:      { type: String, default: 'Verification code' },
  error:      { type: Boolean, default: false },
  disabled:   { type: Boolean, default: false },
  autofill:   { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'complete'])

const inputs = ref([])
const digits = computed(() => Array.from({ length: props.length }, (_, i) => props.modelValue[i] ?? ''))

function set(value) {
  const clean = value.replace(/\D/g, '').slice(0, props.length)
  emit('update:modelValue', clean)
  if (clean.length === props.length) emit('complete', clean)
  return clean
}

async function focusAt(i) {
  await nextTick()
  inputs.value[Math.max(0, Math.min(props.length - 1, i))]?.focus()
}

function onFocus(i) {
  inputs.value[i]?.select()
}

// Prototype autofill on an explicit click only — not on programmatic focus
function onClick() {
  if (props.autofill && !props.modelValue) {
    set(props.autofill)
    focusAt(props.length - 1)
  }
}

function onInput(i, e) {
  const typed = e.target.value.replace(/\D/g, '')
  const arr = digits.value.slice()
  arr[i] = typed.slice(-1)
  const next = set(arr.join(''))
  e.target.value = arr[i]
  if (typed && i < props.length - 1) focusAt(Math.min(next.length, i + 1))
}

function onBackspace(i, e) {
  if (digits.value[i]) return // default clears this box
  e.preventDefault()
  const arr = digits.value.slice()
  arr[i - 1] = ''
  set(arr.join(''))
  focusAt(i - 1)
}

function onPaste(e) {
  const text = e.clipboardData?.getData('text') ?? ''
  const clean = set(text)
  focusAt(clean.length)
}

defineExpose({ focus: () => focusAt(0) })
</script>

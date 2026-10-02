<template>
  <div ref="root" class="relative">
    <!-- Single select with a value: the value IS the field (no "add another" look) -->
    <div
      v-if="showSelectedField"
      :class="[
        'flex items-center gap-2 h-11 pl-2 pr-1.5 rounded-control border bg-surface-2',
        error ? 'border-danger' : 'border-line',
      ]"
    >
      <span :class="['inline-flex items-center h-7 px-2.5 rounded-lg text-[13px] font-bold min-w-0', TONE[tone]]">
        <span class="truncate">{{ selectedOptions[0].label }}</span>
      </span>
      <span v-if="selectedOptions[0].meta" class="text-xs text-fg-muted truncate hidden sm:block">{{ selectedOptions[0].meta }}</span>
      <button
        :id="inputId"
        type="button"
        class="ml-auto h-8 px-2.5 rounded-lg text-[13px] font-bold text-brand hover:bg-brand/10"
        :aria-label="`Change ${selectedOptions[0].label}`"
        @click="startChange"
      >Change</button>
      <button
        type="button"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-3"
        :aria-label="`Remove ${selectedOptions[0].label}`"
        @click="remove(selectedOptions[0].value)"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>

    <div v-else class="relative">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-fg-muted pointer-events-none" />
      <input
        :id="inputId"
        ref="input"
        v-model="query"
        type="text"
        role="combobox"
        autocomplete="off"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-activedescendant="open && active >= 0 ? `${listId}-${active}` : undefined"
        :aria-invalid="error || undefined"
        :placeholder="placeholder"
        :class="[
          'w-full h-11 pl-10 pr-3 rounded-control border bg-surface-2 text-sm text-fg placeholder:text-fg-muted outline-none transition-all',
          'focus:ring-2 focus:ring-brand focus:border-brand',
          error ? 'border-danger' : 'border-line',
        ]"
        @focus="openList"
        @input="openList"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="pickActive"
        @keydown.esc="closeList"
        @blur="onBlur"
      />
    </div>

    <!-- Results — v-if so nothing lingers over the fields below once closed -->
    <ul
      v-if="open"
      :id="listId"
      role="listbox"
      :aria-multiselectable="multiple || undefined"
      class="absolute z-30 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto scroll-thin rounded-2xl border border-line bg-surface-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-1.5"
    >
      <li
        v-for="(opt, i) in results"
        :id="`${listId}-${i}`"
        :key="opt.value"
        role="option"
        :aria-selected="isSelected(opt.value)"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm',
          i === active ? 'bg-surface-3' : 'hover:bg-surface-2',
        ]"
        @mousedown.prevent="pick(opt)"
        @mouseenter="active = i"
      >
        <span class="flex-1 min-w-0">
          <span class="block font-bold truncate">{{ opt.label }}</span>
          <span v-if="opt.meta" class="block text-xs text-fg-muted truncate">{{ opt.meta }}</span>
        </span>
        <CheckIcon v-if="isSelected(opt.value)" class="w-4 h-4 text-brand flex-shrink-0" />
      </li>
      <li v-if="!results.length" class="px-3 py-3 text-sm text-fg-muted">
        <template v-if="query.trim().length < minChars">Type at least {{ minChars }} characters to search</template>
        <template v-else>No results for “{{ query }}”</template>
      </li>
    </ul>

    <!-- Selected chips (multiple only — single shows its value inside the field) -->
    <div v-if="multiple && selectedOptions.length" class="flex flex-wrap gap-1.5 mt-2">
      <span
        v-for="opt in selectedOptions"
        :key="opt.value"
        :class="['inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-lg text-[13px] font-bold', TONE[tone]]"
      >
        {{ opt.label }}
        <button
          type="button"
          class="w-5 h-5 rounded-md flex items-center justify-center hover:bg-black/20"
          :aria-label="`Remove ${opt.label}`"
          @click="remove(opt.value)"
        >
          <XMarkIcon class="w-3.5 h-3.5" />
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

/**
 * Searchable picker (single or multiple) with selected values shown as chips.
 * options: [{ value, label, meta? }] — filtered client-side by label.
 */
const props = defineProps({
  modelValue: { type: [Array, String, null], default: null },
  options:    { type: Array, required: true },
  multiple:   { type: Boolean, default: false },
  placeholder:{ type: String, default: 'Search…' },
  /** Characters needed before results show (production uses 3 for companies) */
  minChars:   { type: Number, default: 0 },
  /** Chip colour: 'vendor' | 'reseller' | 'endUser' | 'neutral' */
  tone:       { type: String, default: 'neutral' },
  error:      { type: Boolean, default: false },
  inputId:    { type: String, default: () => `cb-${Math.random().toString(36).slice(2, 7)}` },
})
const emit = defineEmits(['update:modelValue'])

const TONE = {
  vendor:   'bg-presales/15 text-presales',
  reseller: 'bg-brand/15 text-brand',
  endUser:  'bg-warning/15 text-warning',
  neutral:  'bg-surface-3 text-fg',
}

const listId = `${props.inputId}-list`
const root = ref(null)
const input = ref(null)
const query = ref('')
const open = ref(false)
const active = ref(-1)

const selectedValues = computed(() =>
  props.multiple ? (props.modelValue ?? []) : props.modelValue ? [props.modelValue] : [])

const selectedOptions = computed(() =>
  selectedValues.value.map((v) => props.options.find((o) => o.value === v)).filter(Boolean))

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < props.minChars) return []
  return props.options.filter((o) => !q || o.label.toLowerCase().includes(q)).slice(0, 50)
})

const isSelected = (v) => selectedValues.value.includes(v)

// Single select: show the chosen value in the field until the user asks to change it
const changing = ref(false)
const showSelectedField = computed(() => !props.multiple && selectedOptions.value.length > 0 && !changing.value)
async function startChange() {
  changing.value = true
  await nextTick()
  input.value?.focus()
}

function openList() { open.value = true; active.value = results.value.length ? 0 : -1 }
function closeList() { open.value = false; active.value = -1 }
function onBlur() { setTimeout(() => { closeList(); changing.value = false; query.value = '' }, 100) }

function move(d) {
  if (!open.value) openList()
  const n = results.value.length
  if (n) active.value = (active.value + d + n) % n
}

function pick(opt) {
  if (props.multiple) {
    const next = isSelected(opt.value)
      ? selectedValues.value.filter((v) => v !== opt.value)
      : [...selectedValues.value, opt.value]
    emit('update:modelValue', next)
    query.value = ''
  } else {
    emit('update:modelValue', opt.value)
    query.value = ''
    changing.value = false
    closeList()
  }
}
function pickActive() { if (results.value[active.value]) pick(results.value[active.value]) }

function remove(v) {
  emit('update:modelValue', props.multiple ? selectedValues.value.filter((x) => x !== v) : null)
}

defineExpose({ focus: () => input.value?.focus() })
</script>

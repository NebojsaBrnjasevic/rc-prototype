<template>
  <div :class="['rounded-xl flex items-center justify-center font-semibold flex-shrink-0 uppercase select-none', sizeClass, colorClass]">
    <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover rounded-xl" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  src: { type: String, default: null },
  size: { type: String, default: 'md' }, // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
})

const sizeClass = computed(() => ({
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
}[props.size] ?? 'w-9 h-9 text-sm'))

// Deterministic color from name — avoids flicker on re-render
const palette = [
  'bg-brand/20 text-brand',
  'bg-violet-500/20 text-violet-700 dark:text-violet-300',
  'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  'bg-rose-500/20 text-rose-700 dark:text-rose-300',
  'bg-sky-500/20 text-sky-700 dark:text-sky-300',
]
const colorClass = computed(() => {
  const idx = props.name.charCodeAt(0) % palette.length
  return palette[idx]
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
})
</script>

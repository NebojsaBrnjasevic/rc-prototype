<template>
  <span
    role="status"
    :aria-label="label"
    :class="['inline-block rounded-full border-2 border-current border-t-transparent animate-spin', sizeMap[size], colorMap[color]]"
  />
</template>

<script setup>
defineProps({
  size:  { type: String, default: 'md' }, // 'xs' | 'sm' | 'md' | 'lg'
  color: { type: String, default: 'brand' }, // 'brand' | 'white' | 'subtle'
  label: { type: String, default: 'Loading…' },
})

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

const colorMap = {
  brand:  'text-brand',
  white:  'text-white',
  subtle: 'text-fg-muted',
}
</script>

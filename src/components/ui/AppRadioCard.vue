<template>
  <button
    type="button"
    role="radio"
    :aria-checked="isSelected"
    :disabled="disabled"
    class="w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all select-none"
    :class="[
      isSelected
        ? 'border-brand bg-brand/[0.07]'
        : disabled
          ? 'border-line bg-surface-2 opacity-50 cursor-not-allowed'
          : 'border-line bg-surface-2 hover:bg-surface-3 hover:border-brand/40 cursor-pointer',
    ]"
    @click="$emit('update:modelValue', value)"
  >
    <!-- Icon square -->
    <div
      class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      :class="iconBgClass"
    >
      <slot name="icon" />
    </div>

    <!-- Text -->
    <div class="flex-1 min-w-0">
      <p class="text-[15px] font-extrabold text-fg">{{ label }}</p>
      <p v-if="description" class="text-sm text-fg-2 mt-0.5">{{ description }}</p>
    </div>

    <!-- Radio -->
    <div
      class="w-5 h-5 rounded-full border-2 flex-shrink-0 ml-auto flex items-center justify-center"
      :class="isSelected ? 'border-brand' : 'border-line'"
      aria-hidden="true"
    >
      <div v-if="isSelected" class="w-2.5 h-2.5 rounded-full bg-brand" />
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:  { default: null },
  value:       { required: true },
  label:       { type: String,  required: true },
  description: { type: String,  default: '' },
  color:       { type: String,  default: 'brand' },
  disabled:    { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const isSelected = computed(() => props.modelValue === props.value)

const iconBgMap = {
  brand:    'bg-brand/15 text-brand',
  presales: 'bg-presales/15 text-presales',
  success:  'bg-success/15 text-success',
  reward:   'bg-reward-fill/15 text-reward',
  warning:  'bg-warning/15 text-warning',
  danger:   'bg-danger/15 text-danger',
}
const iconBgClass = computed(() => iconBgMap[props.color] ?? iconBgMap.brand)
</script>

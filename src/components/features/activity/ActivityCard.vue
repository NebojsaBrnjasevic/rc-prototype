<template>
  <button
    type="button"
    class="w-full text-left rounded-2xl border border-line bg-surface-2 hover:bg-surface-3 hover:border-brand/40 p-4 flex flex-col gap-3 transition-colors"
    @click="ui.openActivity(activity.id)"
  >
    <span class="flex items-center gap-2">
      <span :class="['w-7 h-7 rounded-lg flex items-center justify-center', style.soft]"><component :is="style.icon" class="w-4 h-4" /></span>
      <span :class="['text-[13px] font-extrabold', style.text]">{{ activity.recordType }}</span>
      <span v-if="activity.stage !== 'Completed'" class="ml-auto text-[11px] font-extrabold uppercase tracking-[0.06em] text-brand">Upcoming</span>
    </span>
    <span class="text-[15px] font-bold leading-snug line-clamp-2">{{ title }}</span>
    <span class="text-[13px] text-fg-muted line-clamp-1">Next: {{ activity.nextStep }}</span>
    <ActivityEntityCounts :activity="activity" />
    <span class="flex items-center justify-between text-[13px] pt-3 border-t border-line">
      <span class="font-bold text-fg-2">{{ formatDate(activity.date, { day: 'numeric', month: 'short' }) }}</span>
      <span class="text-fg-muted">{{ activity.createdBy }}</span>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import { RECORD_STYLE, formatDate, activityTitle } from '@/utils/activity'
import ActivityEntityCounts from './ActivityEntityCounts.vue'

const props = defineProps({ activity: { type: Object, required: true } })
const ui = useUiStore()
const style = computed(() => RECORD_STYLE[props.activity.recordType])
const title = computed(() => activityTitle(props.activity))
</script>

<template>
  <div class="flex items-center gap-3.5 py-3 border-b last:border-0 border-line">
    <span :class="['w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0', tone.box]" aria-hidden="true">
      <component :is="tone.icon" class="w-[18px] h-[18px]" />
    </span>
    <div class="flex-1 min-w-0">
      <p class="text-[15px] font-bold truncate">{{ meta.label }}</p>
      <p class="text-[13px] text-fg-muted truncate">
        <span class="font-mono">{{ event.entity }}</span><template v-if="event.actor"> · {{ event.actor }}</template>
      </p>
    </div>
    <span class="text-[13px] text-fg-muted flex-shrink-0 whitespace-nowrap">{{ event.time }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  BoltIcon, CheckCircleIcon, ExclamationTriangleIcon, GiftIcon, UserPlusIcon, ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import { AUDIT_TYPES } from '@/stores/useAdminStore'

const props = defineProps({
  /** { type, entity, actor, time } from useAdminStore().auditLog */
  event: { type: Object, required: true },
})

const ICONS = {
  'activity.created': BoltIcon,
  'activity.sync_success': CheckCircleIcon,
  'activity.sync_failed': ExclamationTriangleIcon,
  'reward.claimed': GiftIcon,
  'user.created': UserPlusIcon,
  'user.role_changed': ShieldCheckIcon,
}
const BOX = {
  brand: 'bg-brand/10 text-brand',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
  reward: 'bg-reward-fill/15 text-reward',
  neutral: 'bg-surface-3 text-fg-2',
}

const meta = computed(() => AUDIT_TYPES[props.event.type] ?? { label: props.event.type, tone: 'neutral' })
const tone = computed(() => ({ box: BOX[meta.value.tone], icon: ICONS[props.event.type] ?? BoltIcon }))
</script>

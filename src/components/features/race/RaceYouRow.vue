<template>
  <div class="grid grid-cols-[36px_minmax(0,1fr)_auto] gap-3.5 items-center pl-3.5 pr-2.5 py-2.5 rounded-[14px] bg-brand/10 border border-brand/40">
    <AppAvatar :name="name" size="md" class="!bg-brand !text-brand-on" />
    <div class="min-w-0">
      <p class="text-[15px] font-extrabold text-brand truncate">
        <template v-if="me">You · P{{ me.rank }} · {{ me.points.toLocaleString() }} pts</template>
        <template v-else>You · not ranked yet</template>
      </p>
      <p class="text-[13px] text-fg-2 truncate">
        <template v-if="me && target">{{ (target.points - me.points + 1).toLocaleString() }} pts to pass {{ target.name.split(' ')[0] }} for P{{ target.rank }}</template>
        <template v-else-if="me">You're leading {{ thisLabel }} — keep it up.</template>
        <template v-else>0 activities {{ thisLabel }} — one entry puts you on the board.</template>
      </p>
    </div>
    <AppButton size="sm" @click="$emit('log')">Log activity</AppButton>
  </div>
</template>

<script setup>
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  /** Current user's standing row, or null if not ranked */
  me:        { type: Object, default: null },
  /** Standing row directly above the user */
  target:    { type: Object, default: null },
  name:      { type: String, default: '' },
  thisLabel: { type: String, required: true },
})
defineEmits(['log'])
</script>

<template>
  <span class="flex flex-wrap gap-1.5" :aria-label="label">
    <span v-for="c in counts" v-show="c.n" :key="c.key" :class="['h-6 px-2 rounded-md text-xs font-bold inline-flex items-center gap-1', c.tone]" :title="c.title">
      <component :is="c.icon" class="w-3.5 h-3.5" aria-hidden="true" />{{ c.n }}
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { BuildingStorefrontIcon, BuildingOffice2Icon, UserGroupIcon, UserIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ activity: { type: Object, required: true } })

const counts = computed(() => [
  { key: 'v', n: props.activity.vendors.length, icon: BuildingStorefrontIcon, tone: 'bg-presales/15 text-presales', title: 'Vendors' },
  { key: 'r', n: props.activity.reseller ? 1 : 0, icon: BuildingOffice2Icon, tone: 'bg-brand/15 text-brand', title: 'Reseller' },
  { key: 'e', n: props.activity.endUsers.length, icon: UserGroupIcon, tone: 'bg-warning/15 text-warning', title: 'End users' },
  { key: 'a', n: props.activity.attendees.length, icon: UserIcon, tone: 'bg-surface-3 text-fg-2', title: 'Attendees' },
])
const label = computed(() => counts.value.filter((c) => c.n).map((c) => `${c.n} ${c.title.toLowerCase()}`).join(', '))
</script>

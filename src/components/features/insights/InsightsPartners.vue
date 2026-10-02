<template>
  <section aria-labelledby="partners-title" class="flex flex-col gap-4">
    <div>
      <h3 id="partners-title" class="font-display font-semibold text-xl">Partner activity</h3>
      <p class="text-sm text-fg-2 mt-1">Top vendors, resellers and end users by number of activities.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div v-for="col in columns" :key="col.label" class="card p-5">
        <div class="flex items-center gap-2.5 mb-4">
          <span class="w-8 h-8 rounded-[10px] bg-brand/10 text-brand flex items-center justify-center">
            <component :is="col.icon" class="w-[18px] h-[18px]" />
          </span>
          <h4 class="text-[15px] font-extrabold">{{ col.label }}</h4>
        </div>
        <ol v-if="col.items.length" class="space-y-2.5">
          <li v-for="(item, i) in col.items" :key="item.name" class="flex items-center gap-3">
            <span class="w-5 text-xs font-bold text-fg-muted tabular">{{ i + 1 }}</span>
            <span class="flex-1 min-w-0">
              <span class="flex items-center justify-between gap-2 text-sm">
                <span class="font-semibold truncate">{{ item.name }}</span>
                <span class="font-extrabold text-brand tabular">{{ item.count }}</span>
              </span>
              <span class="block h-1 mt-1.5 rounded-full bg-surface-3 overflow-hidden" aria-hidden="true">
                <span class="block h-full rounded-full bg-brand/60" :style="{ width: `${(item.count / col.items[0].count) * 100}%` }" />
              </span>
            </span>
          </li>
        </ol>
        <p v-else class="py-6 text-center text-sm text-fg-muted">No {{ col.label.toLowerCase().replace('top ', '') }} yet</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { BuildingStorefrontIcon, BuildingOffice2Icon, UsersIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  /** { vendors, resellers, endUsers } from useInsightsStore().partners */
  partners: { type: Object, required: true },
})

const columns = computed(() => [
  { label: 'Top vendors',   icon: BuildingStorefrontIcon, items: props.partners.vendors },
  { label: 'Top resellers', icon: BuildingOffice2Icon,    items: props.partners.resellers },
  { label: 'Top end users', icon: UsersIcon,              items: props.partners.endUsers },
])
</script>

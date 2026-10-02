<template>
  <div class="card overflow-hidden">
    <!-- Desktop: table -->
    <table class="w-full text-sm hidden md:table">
      <caption class="sr-only">Activities</caption>
      <thead class="border-b border-line">
        <tr>
          <th scope="col" class="px-5 py-3 text-left text-overline text-fg-muted">Activity</th>
          <th scope="col" class="px-5 py-3 text-left text-overline text-fg-muted hidden lg:table-cell">Next step &amp; context</th>
          <th scope="col" class="px-5 py-3 text-left text-overline text-fg-muted whitespace-nowrap">Timing</th>
          <th scope="col" class="w-12"><span class="sr-only">Open</span></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="a in pageItems"
          :key="a.id"
          class="border-b last:border-0 border-line hover:bg-surface-2 cursor-pointer transition-colors"
          @click="ui.openActivity(a.id)"
        >
          <td class="px-5 py-4 align-top">
            <div class="flex gap-3 max-w-[560px]">
              <span :class="['w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0', RECORD_STYLE[a.recordType].soft]">
                <component :is="RECORD_STYLE[a.recordType].icon" class="w-[18px] h-[18px]" />
              </span>
              <div class="min-w-0">
                <!-- Real link for keyboard / screen readers; the row click is a mouse shortcut -->
                <button type="button" class="text-left text-[15px] font-bold text-fg line-clamp-2 hover:text-brand focus-visible:text-brand" @click.stop="ui.openActivity(a.id)">
                  {{ activityTitle(a) }}
                </button>
                <div class="flex flex-wrap items-center gap-1.5 mt-2">
                  <span :class="['h-6 px-2 rounded-md text-xs font-bold inline-flex items-center', RECORD_STYLE[a.recordType].soft]">{{ a.recordType }}</span>
                  <span class="h-6 px-2 rounded-md text-xs font-bold inline-flex items-center bg-surface-3 text-fg-2">{{ a.activityType }}</span>
                </div>
              </div>
            </div>
          </td>
          <td class="px-5 py-4 align-top hidden lg:table-cell">
            <p class="text-[13px] text-fg-2 line-clamp-2 max-w-[420px]"><span class="font-bold text-fg">Next:</span> {{ a.nextStep }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <ActivityEntityCounts :activity="a" />
              <span v-if="a.opportunity" class="h-6 px-2 rounded-md text-xs font-bold inline-flex items-center gap-1 bg-success/15 text-success"><LinkIcon class="w-3.5 h-3.5" />Opportunity</span>
            </div>
          </td>
          <td class="px-5 py-4 align-top whitespace-nowrap">
            <AppBadge :color="a.stage === 'Completed' ? 'success' : 'brand'" dot size="xs">{{ a.stage }}</AppBadge>
            <p class="text-sm font-bold mt-2">{{ formatDate(a.date) }}</p>
            <p class="text-[13px] text-fg-muted mt-0.5">{{ relativeDays(a.date) }} · {{ a.createdBy }}</p>
          </td>
          <td class="pr-4 align-middle text-fg-muted"><ChevronRightIcon class="w-5 h-5" /></td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile: cards -->
    <div class="md:hidden p-3 space-y-2">
      <ActivityCard v-for="a in pageItems" :key="a.id" :activity="a" />
    </div>

    <!-- Pagination -->
    <div v-if="pages > 1" class="flex items-center justify-between gap-3 px-5 py-3 border-t border-line">
      <p class="text-[13px] text-fg-muted">
        {{ (page - 1) * PER_PAGE + 1 }}–{{ Math.min(page * PER_PAGE, activities.length) }} of {{ activities.length }}
      </p>
      <div class="flex gap-2">
        <AppButton variant="secondary" size="sm" :disabled="page === 1" @click="page--">Previous</AppButton>
        <AppButton variant="secondary" size="sm" :disabled="page === pages" @click="page++">Next</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronRightIcon, LinkIcon } from '@heroicons/vue/24/outline'
import { useUiStore } from '@/stores/useUiStore'
import { RECORD_STYLE, formatDate, relativeDays, activityTitle } from '@/utils/activity'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import ActivityEntityCounts from './ActivityEntityCounts.vue'
import ActivityCard from './ActivityCard.vue'

const props = defineProps({ activities: { type: Array, required: true } })
const ui = useUiStore()

const PER_PAGE = 10
const page = ref(1)
const pages = computed(() => Math.max(1, Math.ceil(props.activities.length / PER_PAGE)))
const pageItems = computed(() => props.activities.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE))
watch(() => props.activities, () => { page.value = 1 })
</script>

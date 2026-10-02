<template>
  <AppLayout>
    <div class="max-w-3xl">
      <div class="mb-8">
        <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">Changelog</h1>
        <p class="mt-2 text-base text-fg-2">What's new in Race Control.</p>
      </div>

      <!-- Type filter -->
      <div role="group" aria-label="Filter by type" class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="f in filters"
          :key="f.value"
          type="button"
          :aria-pressed="type === f.value"
          :class="[
            'h-9 px-3.5 rounded-full text-sm font-bold border transition-colors',
            type === f.value ? 'bg-brand/10 border-brand text-fg' : 'bg-surface-1 border-line text-fg-2 hover:text-fg',
          ]"
          @click="type = f.value"
        >{{ f.label }}</button>
      </div>

      <!-- Timeline -->
      <ol class="relative">
        <li v-for="(entry, i) in visible" :key="entry.date + entry.title" class="relative flex gap-5 pb-8">
          <!-- Rail -->
          <div class="flex flex-col items-center flex-shrink-0">
            <span :class="['w-11 h-11 rounded-xl flex items-center justify-center', TYPES[entry.type].soft]">
              <component :is="TYPES[entry.type].icon" class="w-5 h-5" />
            </span>
            <span v-if="i < visible.length - 1" class="w-0.5 flex-1 mt-2 rounded-full bg-line" aria-hidden="true" />
          </div>

          <article class="card p-5 flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <AppBadge :color="TYPES[entry.type].badge" :pill="false" size="xs">{{ TYPES[entry.type].label }}</AppBadge>
              <AppBadge v-if="entry.preview" color="reward" :pill="false" size="xs">Preview</AppBadge>
              <time class="text-[13px] text-fg-muted ml-auto">{{ entry.date }}</time>
            </div>
            <h2 class="text-[17px] font-extrabold">{{ entry.title }}</h2>
            <p v-if="entry.description" class="text-[15px] text-fg-2 mt-2 leading-relaxed">{{ entry.description }}</p>
            <ul v-if="entry.items" class="mt-3 space-y-1.5">
              <li v-for="item in entry.items" :key="item" class="flex gap-2.5 text-sm text-fg-2">
                <CheckCircleIcon class="w-[18px] h-[18px] text-brand flex-shrink-0" />{{ item }}
              </li>
            </ul>
          </article>
        </li>
      </ol>

      <AppEmptyState v-if="!visible.length" class="card" title="Nothing here yet" description="No changes of this type." compact />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SparklesIcon, ArrowTrendingUpIcon, WrenchScrewdriverIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'

const TYPES = {
  feature:     { label: 'New',         icon: SparklesIcon,          soft: 'bg-brand/15 text-brand',     badge: 'brand' },
  improvement: { label: 'Improvement', icon: ArrowTrendingUpIcon,   soft: 'bg-success/15 text-success', badge: 'success' },
  fix:         { label: 'Fix',         icon: WrenchScrewdriverIcon, soft: 'bg-surface-3 text-fg-2',     badge: 'neutral' },
}

// TODO: Load from API or /data/changelog.json
const entries = [
  {
    type: 'feature', preview: true, date: 'October 2026', title: 'A new Race Control',
    description: 'A redesigned app built around the race — this is a preview for feedback.',
    items: [
      'Home brings your race, KPIs and team insights together, with one period switch for everything',
      'Standings page with podium, your position and a live countdown',
      'Activity calendar and kanban views, plus a faster two-step Log activity form',
      'Company pages in the Directory with engagement snapshot and recent activity',
    ],
  },
  {
    type: 'fix', preview: true, date: 'October 2026', title: 'Clearer forms',
    items: [
      'Single-choice fields (Reseller) show the selected value in the field, so it no longer looks like you can add more',
      'Search results close cleanly instead of covering the field below',
      'Directory lists can show more than 50 results',
    ],
  },
  { type: 'feature', date: 'June 2026', title: 'Passkeys now supported', description: 'Sign in with Face ID, Touch ID or a security key.' },
  { type: 'improvement', date: 'March 2026', title: 'Updated Home & Activity pages' },
]

const type = ref('all')
const filters = [
  { value: 'all', label: 'All' },
  { value: 'feature', label: 'New' },
  { value: 'improvement', label: 'Improvements' },
  { value: 'fix', label: 'Fixes' },
]
const visible = computed(() => (type.value === 'all' ? entries : entries.filter((e) => e.type === type.value)))
</script>

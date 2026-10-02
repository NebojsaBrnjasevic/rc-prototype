<template>
  <AppLayout>
    <div class="mb-6">
      <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">Directory</h1>
      <p class="mt-2 text-base text-fg-2">Vendors, resellers and end users — and how much they're moving.</p>
    </div>

    <!-- Momentum -->
    <section aria-labelledby="momentum-title" class="relative overflow-hidden card p-6 mb-6">
      <span class="pointer-events-none absolute -right-24 -top-32 w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgb(var(--rc-brand)/0.18),transparent_70%)]" aria-hidden="true" />
      <div class="relative flex flex-col lg:flex-row lg:items-center gap-6">
        <div class="flex-1">
          <h2 id="momentum-title" class="font-display font-semibold text-xl flex items-center gap-2">
            <SparklesIcon class="w-5 h-5 text-brand" />Partner momentum
          </h2>
          <p class="text-sm text-fg-2 mt-1.5">Trending partners are computed from recent activity, so the directory stays fresh.</p>
          <div class="flex flex-wrap gap-2 mt-4">
            <span class="h-8 px-3 rounded-full bg-brand/10 border border-brand/30 text-[13px] font-bold flex items-center gap-1.5 text-brand">
              <ArrowTrendingUpIcon class="w-4 h-4" />Top signal: {{ directory.topSignal.type }} · {{ directory.topSignal.count }}
            </span>
            <span class="h-8 px-3 rounded-full border border-line text-[13px] font-semibold flex items-center gap-1.5 text-fg-2">
              <BoltIcon class="w-4 h-4" />Sample: {{ directory.topSignal.sample }} activities
            </span>
          </div>
        </div>

        <!-- Trending top 3 for the current tab -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:w-[60%]">
          <RouterLink
            v-for="t in trending"
            :key="t.id"
            :to="`/directory/${KINDS[kind].route}/${t.id}`"
            class="rounded-2xl border border-line bg-surface-2 hover:bg-surface-3 hover:border-brand/40 p-4 transition-colors group"
          >
            <span class="flex items-center gap-2">
              <span :class="['w-6 h-6 rounded-md text-xs font-extrabold flex items-center justify-center', t.rank === 1 ? 'bg-podium-gold text-[#1F1500]' : 'bg-surface-3 text-fg-2']">{{ t.rank }}</span>
              <span class="text-[15px] font-extrabold truncate flex-1">{{ t.name }}</span>
              <ChevronRightIcon class="w-4 h-4 text-fg-muted group-hover:text-fg" />
            </span>
            <span class="block text-[13px] text-fg-muted mt-2">{{ t.links }} {{ t.links === 1 ? 'activity' : 'activities' }}</span>
            <span class="block h-1 mt-2 rounded-full bg-surface-3 overflow-hidden" aria-hidden="true">
              <span class="block h-full rounded-full bg-brand" :style="{ width: `${t.share}%` }" />
            </span>
          </RouterLink>
          <p v-if="!trending.length" class="sm:col-span-3 text-sm text-fg-muted">No trending {{ KINDS[kind].label.toLowerCase() }} yet.</p>
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <AppViewTabs v-model="kind" :tabs="tabs" aria-label="Company type" id-prefix="dir" class="mb-5" />

    <div :id="`dir-panel-${kind}`" role="tabpanel" :aria-labelledby="`dir-tab-${kind}`">
      <!-- Search + sort -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <AppInput v-model="q" wrapper-class="flex-1" :placeholder="`Search ${KINDS[kind].label.toLowerCase()}…`" :aria-label="`Search ${KINDS[kind].label.toLowerCase()}`" clearable>
          <template #leading><MagnifyingGlassIcon class="w-[18px] h-[18px]" /></template>
        </AppInput>
        <AppSelect v-model="sort" class="sm:!w-56" :options="sortOptions" aria-label="Sort" />
      </div>

      <p class="text-[13px] text-fg-muted mb-3 px-1" aria-live="polite">
        {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}<template v-if="q"> for “{{ q }}”</template>
      </p>

      <!-- List -->
      <ul class="space-y-2">
        <li v-for="c in visible" :key="c.id">
          <RouterLink
            :to="`/directory/${KINDS[kind].route}/${c.id}`"
            class="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-line bg-surface-1 hover:bg-surface-2 hover:border-brand/40 transition-colors group"
          >
            <span :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', KIND_STYLE[kind].soft]">
              <component :is="KIND_STYLE[kind].icon" class="w-5 h-5" />
            </span>
            <span class="flex-1 min-w-0">
              <span class="flex items-center gap-2 flex-wrap">
                <span class="text-[15px] font-extrabold truncate">{{ c.name }}</span>
                <span v-if="c.trendingRank" class="h-5 px-1.5 rounded-md bg-brand/15 text-brand text-[11px] font-extrabold uppercase tracking-[0.04em] flex items-center">Trending</span>
                <span v-if="c.stats.momentum === 'hot'" class="h-5 px-1.5 rounded-md bg-success/15 text-success text-[11px] font-extrabold uppercase tracking-[0.04em] flex items-center">Hot</span>
              </span>
              <span class="block text-[13px] text-fg-muted truncate mt-0.5">{{ subtitle(c) }}</span>
            </span>
            <span class="hidden sm:flex flex-col items-end text-right">
              <span class="text-sm font-extrabold tabular">{{ c.stats.activities }} <span class="font-semibold text-fg-muted">act.</span></span>
              <span class="text-xs text-fg-muted">{{ c.stats.latest ? relativeDays(c.stats.latest.date) : 'No activity yet' }}</span>
            </span>
            <ChevronRightIcon class="w-5 h-5 text-fg-muted group-hover:text-fg flex-shrink-0" />
          </RouterLink>
        </li>
      </ul>

      <AppEmptyState
        v-if="!results.length"
        class="card mt-2"
        :icon="MagnifyingGlassIcon"
        :title="`No ${KINDS[kind].label.toLowerCase()} found`"
        description="Check the spelling or try a shorter search."
      />

      <!-- Show more (production stops at 50 with no way to page) -->
      <div v-if="visible.length < results.length" class="flex flex-col items-center gap-2 mt-5">
        <AppButton variant="secondary" @click="limit += PAGE">Show {{ Math.min(PAGE, results.length - visible.length) }} more</AppButton>
        <p class="text-[13px] text-fg-muted">Showing {{ visible.length }} of {{ results.length }}</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  SparklesIcon, ArrowTrendingUpIcon, BoltIcon, ChevronRightIcon, MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import { useDirectoryStore, KINDS } from '@/stores/useDirectoryStore'
import { relativeDays, COMPANY_STYLE } from '@/utils/activity'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppViewTabs from '@/components/ui/AppViewTabs.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'

const route = useRoute()
const router = useRouter()
const directory = useDirectoryStore()

const KIND_STYLE = COMPANY_STYLE

const TAB_KEYS = ['vendor', 'reseller', 'endUser']
const kind = computed({
  get: () => (TAB_KEYS.includes(route.query.tab) ? route.query.tab : 'vendor'),
  set: (v) => router.replace({ query: { ...route.query, tab: v === 'vendor' ? undefined : v } }),
})

const tabs = computed(() => TAB_KEYS.map((k) => ({
  value: k,
  label: KINDS[k].label,
  icon: COMPANY_STYLE[k].icon,
  count: directory.ofKind(k).length,
})))

const PAGE = 20
const q = ref('')
const sort = ref('name')
const limit = ref(PAGE)
watch([kind, q, sort], () => { limit.value = PAGE })

const sortOptions = [
  { value: 'name', label: 'Sort: Name A–Z' },
  { value: 'activity', label: 'Sort: Most activity' },
  { value: 'recent', label: 'Sort: Recently active' },
]

const trending = computed(() => directory.trending(kind.value))
const trendingIds = computed(() => Object.fromEntries(trending.value.map((t) => [t.id, t.rank])))

const results = computed(() => {
  const s = q.value.trim().toLowerCase()
  const list = directory.ofKind(kind.value)
    .filter((c) => !s || c.name.toLowerCase().includes(s) || (c.category ?? '').toLowerCase().includes(s))
    .map((c) => ({ ...c, stats: directory.statsFor(c.id), trendingRank: trendingIds.value[c.id] }))
  if (sort.value === 'activity') list.sort((a, b) => b.stats.activities - a.stats.activities)
  if (sort.value === 'recent') list.sort((a, b) => (b.stats.latest?.date ?? '').localeCompare(a.stats.latest?.date ?? ''))
  return list
})
const visible = computed(() => results.value.slice(0, limit.value))

function subtitle(c) {
  if (c.kind === 'vendor') return c.category
  if (c.kind === 'reseller') return [c.recordType, c.focusLevel].filter(Boolean).join(' · ')
  return c.website
}
</script>

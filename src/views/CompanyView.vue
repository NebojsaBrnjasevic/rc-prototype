<template>
  <AppLayout>
    <template v-if="company">
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm text-fg-muted mb-5">
        <RouterLink to="/directory" class="hover:text-brand">Directory</RouterLink>
        <ChevronRightIcon class="w-4 h-4" />
        <RouterLink :to="{ path: '/directory', query: { tab: company.kind === 'vendor' ? undefined : company.kind } }" class="hover:text-brand">{{ KINDS[company.kind].label }}</RouterLink>
        <ChevronRightIcon class="w-4 h-4" />
        <span class="text-fg-2 font-semibold truncate" aria-current="page">{{ company.name }}</span>
      </nav>

      <!-- Header -->
      <section class="relative overflow-hidden card p-6 mb-5">
        <span class="pointer-events-none absolute -right-20 -top-28 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgb(var(--rc-brand)/0.14),transparent_70%)]" aria-hidden="true" />
        <div class="relative flex flex-col lg:flex-row lg:items-start gap-5">
          <span :class="['w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0', style.soft]">
            <component :is="style.icon" class="w-8 h-8" />
          </span>
          <div class="flex-1 min-w-0">
            <h1 class="font-display font-bold text-[28px] sm:text-[32px] tracking-tight">{{ company.name }}</h1>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <span :class="['h-7 px-2.5 rounded-lg text-[13px] font-bold flex items-center', style.soft]">{{ KINDS[company.kind].singular }}</span>
              <AppBadge color="success" dot>{{ company.status }}</AppBadge>
              <AppBadge v-if="company.recordType" :pill="false">{{ company.recordType }}</AppBadge>
              <AppBadge v-if="company.focusLevel" :pill="false">{{ company.focusLevel }}</AppBadge>
              <AppBadge v-if="momentum" :color="momentum.color" :pill="false"><FireIcon class="w-3.5 h-3.5 mr-1" />{{ momentum.label }}</AppBadge>
            </div>
            <div class="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-fg-2">
              <a :href="`https://${company.website}`" target="_blank" rel="noopener" class="flex items-center gap-1.5 hover:text-brand">
                <GlobeAltIcon class="w-4 h-4" />{{ company.website }}<ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" /><span class="sr-only">(opens in a new tab)</span>
              </a>
              <span v-if="company.category" class="flex items-center gap-1.5"><TagIcon class="w-4 h-4" />{{ company.category }}</span>
            </div>
          </div>
          <AppButton @click="followUp"><PlusIcon class="w-[18px] h-[18px] stroke-[2.5]" />Log activity</AppButton>
        </div>

        <!-- Stats -->
        <dl class="relative grid grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
          <div class="rounded-2xl bg-surface-2 p-4">
            <dt class="text-overline text-fg-muted">Activities</dt>
            <dd class="font-display font-bold text-[28px] leading-tight tabular mt-1">{{ stats.activities }}</dd>
          </div>
          <div class="rounded-2xl bg-surface-2 p-4">
            <dt class="text-overline text-fg-muted">Last activity</dt>
            <dd class="font-display font-bold text-xl leading-tight mt-2">{{ stats.latest ? relativeDays(stats.latest.date) : '—' }}</dd>
          </div>
          <div class="rounded-2xl bg-surface-2 p-4">
            <dt class="text-overline text-fg-muted">Dominant signal</dt>
            <dd :class="['font-display font-bold text-xl leading-tight mt-2', stats.dominantSignal ? RECORD_STYLE[stats.dominantSignal].text : 'text-fg-muted']">{{ stats.dominantSignal ?? '—' }}</dd>
          </div>
          <div class="rounded-2xl bg-surface-2 p-4">
            <dt class="text-overline text-fg-muted">Connected partners</dt>
            <dd class="font-display font-bold text-[28px] leading-tight tabular mt-1">{{ stats.connectedPartners }}</dd>
          </div>
        </dl>

        <!-- Latest -->
        <button
          v-if="stats.latest"
          type="button"
          class="relative w-full mt-4 flex flex-wrap items-center gap-2 text-left text-sm rounded-2xl border border-line px-4 py-3 hover:bg-surface-2 transition-colors"
          @click="ui.openActivity(stats.latest.id)"
        >
          <span class="text-overline text-fg-muted mr-1">Latest</span>
          <span class="h-6 px-2 rounded-md text-xs font-bold bg-surface-3 flex items-center">{{ stats.latest.activityType }}</span>
          <AppBadge :color="stats.latest.stage === 'Completed' ? 'success' : 'brand'" size="xs" dot>{{ stats.latest.stage }}</AppBadge>
          <span class="text-fg-2 truncate flex-1 min-w-[200px]"><span class="font-bold text-fg">Next:</span> {{ stats.latest.nextStep }}</span>
          <ChevronRightIcon class="w-4 h-4 text-fg-muted" />
        </button>
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
        <div class="space-y-5 min-w-0">
          <!-- Engagement snapshot -->
          <section aria-labelledby="snap-title" class="card p-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 id="snap-title" class="font-display font-semibold text-xl flex items-center gap-2"><SparklesIcon class="w-5 h-5 text-brand" />Engagement snapshot</h2>
              <span class="text-[13px] text-fg-muted">Based on the last {{ Math.min(10, linked.length) }} linked activities</span>
            </div>
            <div v-if="linked.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div class="rounded-2xl bg-surface-2 p-5">
                <p class="text-overline text-fg-muted">Next best move</p>
                <p class="text-[15px] font-bold leading-snug mt-2">{{ stats.latest.nextStep }}</p>
                <p class="text-[13px] text-fg-muted mt-3 flex items-center gap-3">
                  <span class="flex items-center gap-1"><ClockIcon class="w-4 h-4" />{{ relativeDays(stats.latest.date) }}</span>
                  <span>{{ stats.latest.activityType }}</span>
                </p>
              </div>
              <div class="rounded-2xl bg-surface-2 p-5">
                <p class="text-overline text-fg-muted">Activity mix</p>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span v-for="(n, t) in stats.mix" v-show="n" :key="t" :class="['h-7 px-2.5 rounded-lg text-[13px] font-bold flex items-center', RECORD_STYLE[t].soft]">{{ t }} · {{ n }}</span>
                </div>
                <p class="text-[13px] text-fg-2 mt-3">
                  {{ stats.connectedPartners }} connections:
                  <template v-if="company.kind !== 'vendor'">{{ stats.partners.vendors }} vendors · </template>
                  <template v-if="company.kind !== 'reseller'">{{ stats.partners.resellers }} resellers · </template>
                  <template v-if="company.kind !== 'endUser'">{{ stats.partners.endUsers }} end users</template>
                </p>
              </div>
            </div>
            <AppEmptyState v-else :icon="BoltIcon" title="No activity yet" :description="`Log the first activity with ${company.name} to start tracking engagement.`" compact />
          </section>

          <!-- Recent activities -->
          <section aria-labelledby="recent-title" class="card p-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 id="recent-title" class="font-display font-semibold text-xl">Recent activities</h2>
              <AppSelect v-model="sort" class="!h-9 !w-auto" :options="sortOptions" aria-label="Sort activities" />
            </div>
            <ul v-if="pageItems.length" class="space-y-2">
              <li v-for="a in pageItems" :key="a.id">
                <button type="button" class="w-full flex gap-3.5 items-start p-4 rounded-2xl bg-surface-2 hover:bg-surface-3 text-left transition-colors" @click="ui.openActivity(a.id)">
                  <span :class="['w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0', RECORD_STYLE[a.recordType].soft]">
                    <component :is="RECORD_STYLE[a.recordType].icon" class="w-[18px] h-[18px]" />
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="flex flex-wrap items-center gap-2">
                      <span class="text-[15px] font-bold">{{ a.activityType }}</span>
                      <AppBadge :color="a.stage === 'Completed' ? 'success' : 'brand'" size="xs" dot>{{ a.stage }}</AppBadge>
                    </span>
                    <span class="block text-sm text-fg-2 mt-1 line-clamp-1">{{ a.description }}</span>
                    <span class="block text-[13px] text-fg-muted mt-1 line-clamp-1"><span class="font-bold">Next:</span> {{ a.nextStep }}</span>
                  </span>
                  <span class="text-right flex-shrink-0">
                    <span class="block text-sm font-bold">{{ formatDate(a.date, { day: 'numeric', month: 'short' }) }}</span>
                    <span class="block text-[13px] text-fg-muted">{{ a.createdBy }}</span>
                  </span>
                </button>
              </li>
            </ul>
            <p v-else class="py-6 text-center text-sm text-fg-muted">No linked activities.</p>
            <div v-if="pages > 1" class="flex items-center justify-between mt-4">
              <p class="text-[13px] text-fg-muted">Page {{ page }} of {{ pages }}</p>
              <div class="flex gap-2">
                <AppButton variant="secondary" size="sm" :disabled="page === 1" @click="page--">Previous</AppButton>
                <AppButton variant="secondary" size="sm" :disabled="page === pages" @click="page++">Next</AppButton>
              </div>
            </div>
          </section>
        </div>

        <!-- Side: coverage + Salesforce -->
        <aside class="space-y-5 xl:sticky-aside">
          <section class="card p-6 space-y-4">
            <h2 class="font-display font-semibold text-lg">Coverage</h2>
            <div>
              <p class="text-overline text-fg-muted mb-2">Territories ({{ company.territories.length }})</p>
              <div v-if="company.territories.length" class="flex flex-wrap gap-1.5">
                <span v-for="t in company.territories" :key="t" class="h-7 px-2.5 rounded-lg bg-surface-2 text-[13px] font-semibold flex items-center">{{ t }}</span>
              </div>
              <p v-else class="text-sm text-fg-muted">Not assigned</p>
            </div>
            <div>
              <p class="text-overline text-fg-muted mb-2">Regions ({{ company.regions.length }})</p>
              <div v-if="company.regions.length" class="flex flex-wrap gap-1.5">
                <span v-for="r in company.regions" :key="r" class="h-7 px-2.5 rounded-lg bg-surface-2 text-[13px] font-semibold flex items-center">{{ r }}</span>
              </div>
              <p v-else class="text-sm text-fg-muted">Not assigned</p>
            </div>
          </section>

          <section class="card p-6 space-y-3">
            <h2 class="font-display font-semibold text-lg">Salesforce</h2>
            <div class="flex items-center gap-2">
              <code class="flex-1 min-w-0 truncate font-mono text-[13px] px-3 py-2 rounded-lg bg-surface-2">{{ company.salesforceId }}</code>
              <AppButton variant="secondary" size="sm" :aria-label="copied ? 'Copied' : 'Copy Salesforce ID'" @click="copyId">
                <CheckIcon v-if="copied" class="w-4 h-4 text-success" /><DocumentDuplicateIcon v-else class="w-4 h-4" />
              </AppButton>
            </div>
            <!-- TODO: real sync timestamp -->
            <p class="text-[13px] text-fg-muted">Synced from Salesforce · read-only here</p>
          </section>
        </aside>
      </div>
    </template>

    <div v-else class="card">
      <AppEmptyState :icon="BuildingOffice2Icon" title="Company not found" description="It may have been removed or the link is wrong.">
        <template #action><AppButton variant="secondary" :tag="RouterLink" to="/directory">Back to Directory</AppButton></template>
      </AppEmptyState>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  ChevronRightIcon, PlusIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon, TagIcon, FireIcon, SparklesIcon,
  ClockIcon, BoltIcon, CheckIcon, DocumentDuplicateIcon, BuildingOffice2Icon,
} from '@heroicons/vue/24/outline'
import { useUiStore } from '@/stores/useUiStore'
import { useActivityStore } from '@/stores/useActivityStore'
import { useDirectoryStore, KINDS, KIND_FROM_ROUTE } from '@/stores/useDirectoryStore'
import { RECORD_STYLE, COMPANY_STYLE, formatDate, relativeDays } from '@/utils/activity'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'

const route = useRoute()
const ui = useUiStore()
const activityStore = useActivityStore()
const directory = useDirectoryStore()

const company = computed(() => {
  const c = directory.get(route.params.id)
  return c && c.kind === KIND_FROM_ROUTE[route.params.kind] ? c : null
})
const style = computed(() => COMPANY_STYLE[company.value?.kind] ?? COMPANY_STYLE.vendor)
const stats = computed(() => directory.statsFor(company.value.id))
const momentum = computed(() => ({
  hot: { label: 'Hot momentum', color: 'success' },
  warm: { label: 'Warming up', color: 'brand' },
}[stats.value.momentum] ?? null))

const linked = computed(() => activityStore.forCompany(company.value.id))

const sort = ref('activity-desc')
const sortOptions = [
  { value: 'activity-desc', label: 'Newest activity date' },
  { value: 'activity-asc', label: 'Oldest activity date' },
  { value: 'created-desc', label: 'Newest created' },
  { value: 'created-asc', label: 'Oldest created' },
]
const sorted = computed(() => {
  const [field, dir] = sort.value.split('-')
  const key = field === 'activity' ? 'date' : 'createdAt'
  return [...linked.value].sort((a, b) => (dir === 'desc' ? -1 : 1) * a[key].localeCompare(b[key]))
})

const PER_PAGE = 5
const page = ref(1)
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / PER_PAGE)))
const pageItems = computed(() => sorted.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE))
watch([sort, () => route.params.id], () => { page.value = 1 })

// Log activity pre-filled with this company in the right field
function followUp() {
  const c = company.value
  ui.openActivityModal({
    vendors: c.kind === 'vendor' ? [c.id] : undefined,
    reseller: c.kind === 'reseller' ? c.id : undefined,
    endUsers: c.kind === 'endUser' ? [c.id] : undefined,
  })
}

const copied = ref(false)
async function copyId() {
  try { await navigator.clipboard.writeText(company.value.salesforceId) } catch {}
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

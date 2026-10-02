<template>
  <AppDrawer :model-value="!!activity" width="lg" :title-id="titleId" @update:model-value="ui.closeActivity()">
    <template v-if="activity" #header>
      <div class="flex items-center gap-2.5 mb-3">
        <span :class="['w-10 h-10 rounded-xl flex items-center justify-center', style.soft]">
          <component :is="style.icon" class="w-5 h-5" />
        </span>
        <AppBadge :pill="false" :class="style.soft" class="!border-transparent">{{ activity.recordType }}</AppBadge>
        <AppBadge :color="activity.stage === 'Completed' ? 'success' : 'brand'" dot>{{ activity.stage }}</AppBadge>
      </div>
      <h2 :id="titleId" class="font-display font-semibold text-xl leading-snug">{{ title }}</h2>
      <p class="text-sm text-fg-2 mt-1">Created {{ formatDate(activity.createdAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</p>
    </template>

    <div v-if="activity" class="space-y-6">
      <dl class="grid grid-cols-2 gap-3">
        <div class="rounded-2xl bg-surface-2 p-4">
          <dt class="text-overline text-fg-muted">Activity type</dt>
          <dd class="text-[15px] font-bold mt-1">{{ activity.activityType }}</dd>
        </div>
        <div class="rounded-2xl bg-surface-2 p-4">
          <dt class="text-overline text-fg-muted">Activity date</dt>
          <dd class="text-[15px] font-bold mt-1">{{ formatDate(activity.date, { day: 'numeric', month: 'long', year: 'numeric' }) }}</dd>
        </div>
        <div v-if="activity.pipelineValue" class="rounded-2xl bg-surface-2 p-4">
          <dt class="text-overline text-fg-muted">Pipeline</dt>
          <dd class="text-[15px] font-bold mt-1 tabular">{{ gbp(activity.pipelineValue) }}</dd>
        </div>
        <div class="rounded-2xl bg-reward-fill/[0.07] border border-reward-fill/25 p-4">
          <dt class="text-overline text-reward">Points earned</dt>
          <dd class="font-display font-bold text-lg text-reward mt-1 tabular">+{{ activity.points }}</dd>
        </div>
      </dl>

      <section>
        <h3 class="text-sm font-extrabold mb-2">Description</h3>
        <p class="text-[15px] text-fg-2 leading-relaxed">{{ activity.description }}</p>
      </section>

      <section>
        <h3 class="text-sm font-extrabold mb-2">Next step</h3>
        <p class="text-[15px] text-fg-2 leading-relaxed">{{ activity.nextStep }}</p>
      </section>

      <section v-if="activity.opportunity" class="flex items-center gap-3 rounded-2xl border border-line p-4">
        <LinkIcon class="w-5 h-5 text-brand" />
        <span class="text-sm"><span class="font-bold">Linked opportunity:</span> {{ activity.opportunity }}</span>
      </section>

      <section class="rounded-2xl border border-line p-5 space-y-4">
        <h3 class="text-sm font-extrabold flex items-center gap-2"><UsersIcon class="w-[18px] h-[18px] text-brand" />Related companies</h3>
        <div v-for="g in groups" :key="g.label">
          <p class="text-overline text-fg-muted mb-2">{{ g.label }} ({{ g.items.length }})</p>
          <div v-if="g.items.length" class="flex flex-wrap gap-1.5">
            <RouterLink
              v-for="c in g.items"
              :key="c.id"
              :to="`/directory/${c.route}/${c.id}`"
              :class="['h-7 px-2.5 rounded-lg text-[13px] font-bold inline-flex items-center hover:brightness-125', g.tone]"
              @click="ui.closeActivity()"
            >{{ c.name }}</RouterLink>
          </div>
          <p v-else class="text-sm text-fg-muted">None</p>
        </div>
        <div>
          <p class="text-overline text-fg-muted mb-2">Attendees ({{ activity.attendees.length }})</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="p in activity.attendees" :key="p" class="inline-flex items-center gap-2 h-8 pl-1 pr-3 rounded-full bg-surface-2 text-[13px] font-semibold">
              <AppAvatar :name="p" size="xs" />{{ p }}
            </span>
          </div>
        </div>
      </section>

      <p class="text-[13px] text-fg-muted">
        Created by <span class="font-semibold text-fg-2">{{ activity.createdBy }}</span>
      </p>
    </div>

    <template #footer>
      <AppButton variant="secondary" class="flex-1" @click="followUp">
        <PlusIcon class="w-[18px] h-[18px]" />Create follow-up activity
      </AppButton>
      <!-- TODO: link to the real Salesforce record -->
      <AppButton variant="ghost" tag="a" href="#" aria-label="Open in Salesforce (opens a new tab)">
        <ArrowTopRightOnSquareIcon class="w-[18px] h-[18px]" />Salesforce
      </AppButton>
    </template>
  </AppDrawer>
</template>

<script setup>
import { computed } from 'vue'
import { PlusIcon, LinkIcon, UsersIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { useUiStore } from '@/stores/useUiStore'
import { useActivityStore } from '@/stores/useActivityStore'
import { useDirectoryStore, KINDS } from '@/stores/useDirectoryStore'
import { RECORD_STYLE, formatDate, activityTitle, gbp } from '@/utils/activity'
import AppDrawer from '@/components/ui/AppDrawer.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'

const ui = useUiStore()
const activityStore = useActivityStore()
const directory = useDirectoryStore()

const titleId = 'activity-drawer-title'
const activity = computed(() => (ui.activityDrawerId ? activityStore.getById(ui.activityDrawerId) : null))
const style = computed(() => RECORD_STYLE[activity.value?.recordType] ?? RECORD_STYLE.Sales)
// Short, scannable title — the description itself is shown in full below
const title = computed(() => {
  const a = activity.value
  if (!a) return ''
  const vendor = a.vendors.length ? directory.name(a.vendors[0]) : null
  return vendor ? `${a.activityType} · ${vendor}${a.vendors.length > 1 ? ` +${a.vendors.length - 1}` : ''}` : activityTitle(a)
})

const companies = (ids) => ids.map(directory.get).filter(Boolean).map((c) => ({ ...c, route: KINDS[c.kind].route }))
const groups = computed(() => {
  const a = activity.value
  if (!a) return []
  return [
    { label: 'Vendors', items: companies(a.vendors), tone: 'bg-presales/15 text-presales' },
    { label: 'Reseller', items: companies(a.reseller ? [a.reseller] : []), tone: 'bg-brand/15 text-brand' },
    { label: 'End users', items: companies(a.endUsers), tone: 'bg-warning/15 text-warning' },
  ]
})

// Follow-up inherits the companies and record type, links back to this activity
function followUp() {
  const a = activity.value
  ui.openActivityModal({ recordType: a.recordType, vendors: [...a.vendors], reseller: a.reseller, endUsers: [...a.endUsers], followUpOf: a.id })
}
</script>

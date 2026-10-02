<template>
  <AppLayout>
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">How-to guide</h1>
        <p class="mt-2 text-base text-fg-2">Everything you need to know about logging activities in Race Control.</p>
      </div>
      <AppButton :tag="RouterLink" to="/activity">
        <PlusIcon class="w-[18px] h-[18px] stroke-[2.5]" />Log activity
      </AppButton>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <StatCard v-for="stat in stats" :key="stat.label" :label="stat.label" :value="stat.value" :sublabel="stat.sublabel" :icon="stat.icon" />
    </div>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8">

      <!-- Left: Step-by-step -->
      <section aria-labelledby="steps-title">
        <div class="flex items-center justify-between mb-5">
          <h2 id="steps-title" class="font-display font-semibold text-xl">Step-by-step</h2>
          <div class="flex items-center gap-1">
            <AppButton variant="ghost" size="sm" @click="expandAll">Expand all</AppButton>
            <AppButton variant="ghost" size="sm" @click="collapseAll">Collapse all</AppButton>
          </div>
        </div>

        <!-- Stepper list -->
        <ol>
          <li v-for="(step, i) in steps" :key="i" class="flex gap-4">

            <!-- Left column: icon + connector line -->
            <div class="flex flex-col items-center flex-shrink-0">
              <button
                type="button"
                class="w-11 h-11 rounded-control flex items-center justify-center transition-all duration-200 flex-shrink-0"
                :class="openSteps.has(i)
                  ? 'bg-brand text-brand-on shadow-glow-brand'
                  : 'bg-surface-2 border border-line text-fg-muted hover:text-fg hover:bg-surface-3'"
                :aria-expanded="openSteps.has(i)"
                :aria-controls="`step-${i}`"
                :aria-label="`${openSteps.has(i) ? 'Collapse' : 'Expand'} step ${i + 1}`"
                @click="toggleStep(i)"
              >
                <component :is="step.icon" class="w-5 h-5" />
              </button>

              <!-- Connector — highlights when an adjacent step is open -->
              <div
                v-if="i < steps.length - 1"
                class="w-0.5 flex-1 min-h-[16px] my-1.5 rounded-full transition-colors duration-300"
                :class="openSteps.has(i) || openSteps.has(i + 1) ? 'bg-brand/50' : 'bg-line'"
                aria-hidden="true"
              />
            </div>

            <!-- Right column: header + content -->
            <div class="flex-1 min-w-0 pb-5">
              <button
                type="button"
                class="w-full text-left flex items-start justify-between gap-3 pt-0.5 pb-3"
                :aria-expanded="openSteps.has(i)"
                :aria-controls="`step-${i}`"
                @click="toggleStep(i)"
              >
                <div class="min-w-0">
                  <p class="text-overline text-fg-muted mb-1">Step {{ i + 1 }}</p>
                  <p class="text-[17px] font-extrabold leading-tight">{{ step.title }}</p>
                  <p class="text-sm text-fg-2 mt-1">{{ step.subtitle }}</p>
                </div>
                <ChevronDownIcon
                  class="w-5 h-5 text-fg-muted flex-shrink-0 mt-5 transition-transform duration-200"
                  :class="openSteps.has(i) ? 'rotate-180' : ''"
                />
              </button>

              <!-- Expanded content -->
              <Transition name="step-expand">
                <div v-if="openSteps.has(i)" :id="`step-${i}`" class="card p-5 space-y-4">
                  <p class="text-[15px] text-fg-2 leading-relaxed">{{ step.description }}</p>

                  <!-- Record types (step 2) -->
                  <div v-if="step.recordTypes" class="space-y-2.5">
                    <div v-for="rt in step.recordTypes" :key="rt.name" class="rounded-2xl bg-surface-2 p-4">
                      <div class="flex items-center gap-2.5 mb-3">
                        <span class="w-8 h-8 rounded-[10px] flex items-center justify-center" :class="rt.box">
                          <component :is="rt.icon" class="w-[18px] h-[18px]" />
                        </span>
                        <p class="text-[15px] font-extrabold">{{ rt.name }}</p>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <span
                          v-for="tag in rt.tags"
                          :key="tag"
                          class="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-3 text-fg-2"
                        >{{ tag }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Entity fields (step 4) -->
                  <div v-if="step.entities" class="space-y-2.5">
                    <div v-for="entity in step.entities" :key="entity.label" class="rounded-2xl bg-surface-2 p-4">
                      <div class="flex items-center gap-2 mb-1.5">
                        <component :is="entity.icon" class="w-[18px] h-[18px] text-fg-muted" />
                        <span class="text-sm font-extrabold">{{ entity.label }}</span>
                        <AppBadge :color="entity.required ? 'brand' : 'neutral'" size="xs" :pill="false">
                          {{ entity.required ? 'Required' : 'Optional' }}
                        </AppBadge>
                      </div>
                      <p class="text-[13px] text-fg-2">{{ entity.hint }}</p>
                    </div>
                  </div>

                  <!-- Description + Next step examples (step 5) -->
                  <div v-if="step.fields" class="space-y-3">
                    <div v-for="field in step.fields" :key="field.label">
                      <p class="text-sm font-bold mb-1.5">
                        {{ field.label }}<span class="text-danger ml-0.5" aria-label="required">*</span>
                      </p>
                      <div class="rounded-2xl bg-surface-2 p-4">
                        <p class="text-overline text-fg-muted mb-1.5">Example</p>
                        <p class="text-sm text-fg-2 italic leading-relaxed">{{ field.example }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Bullet points -->
                  <ul v-if="step.bullets" class="space-y-2">
                    <li v-for="bullet in step.bullets" :key="bullet" class="flex items-start gap-2.5 text-[15px] text-fg-2">
                      <CheckCircleIcon class="w-5 h-5 text-brand flex-shrink-0" />
                      {{ bullet }}
                    </li>
                  </ul>

                  <!-- Tip callout — info tone (gold is reserved for rewards) -->
                  <div v-if="step.tip" class="flex items-start gap-3 rounded-2xl bg-brand/[0.07] border border-brand/25 p-4">
                    <LightBulbIcon class="w-5 h-5 text-brand flex-shrink-0" />
                    <p class="text-sm text-fg-2 leading-relaxed">
                      <span class="font-extrabold text-fg">Tip:</span> {{ step.tip }}
                    </p>
                  </div>
                </div>
              </Transition>
            </div>
          </li>
        </ol>

        <!-- CTA — points are a reward, so this is where gold belongs -->
        <div class="mt-4 rounded-panel border border-reward-fill/30 bg-reward-fill/[0.06] p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <span class="w-12 h-12 rounded-[14px] bg-reward-fill text-reward-on flex items-center justify-center flex-shrink-0">
            <TrophyIcon class="w-6 h-6" />
          </span>
          <div class="flex-1">
            <p class="text-lg font-extrabold">Ready to climb the standings?</p>
            <p class="text-sm text-fg-2 mt-0.5">Every activity you log earns race points and XP.</p>
          </div>
          <AppButton :tag="RouterLink" to="/activity">
            Start logging <ArrowRightIcon class="w-4 h-4" />
          </AppButton>
        </div>
      </section>

      <!-- Right: Pro tips + Contact — sticky-aside caps it to the viewport (see main.css) -->
      <aside class="space-y-8 lg:sticky-aside">

        <section aria-labelledby="tips-title">
          <h2 id="tips-title" class="font-display font-semibold text-xl mb-4">Pro tips</h2>
          <div class="space-y-3">
            <div v-for="tip in proTips" :key="tip.title" class="card p-5">
              <div class="flex items-center gap-3 mb-2">
                <span class="w-9 h-9 rounded-[10px] bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                  <component :is="tip.icon" class="w-[18px] h-[18px]" />
                </span>
                <p class="text-[15px] font-extrabold">{{ tip.title }}</p>
              </div>
              <p class="text-sm text-fg-2 leading-relaxed">{{ tip.body }}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="support-title">
          <h2 id="support-title" class="font-display font-semibold text-xl mb-4">Contact support</h2>
          <form class="card p-5 space-y-4" @submit.prevent="sendSupport">
            <p class="text-sm text-fg-2">Need help? Send us a message and we'll get back to you.</p>
            <AppFormField label="Subject" input-id="support-subject" required>
              <AppInput id="support-subject" v-model="supportSubject" placeholder="Brief description of your issue" required />
            </AppFormField>
            <AppFormField label="Description" input-id="support-body" required>
              <AppTextarea id="support-body" v-model="supportBody" :rows="4" placeholder="Please describe your issue in detail…" required />
            </AppFormField>
            <AppButton type="submit" variant="secondary" full-width :loading="sending" :disabled="!supportSubject.trim() || !supportBody.trim()">
              <EnvelopeIcon v-if="!sending" class="w-[18px] h-[18px]" />Send message
            </AppButton>
            <p v-if="sent" class="flex items-center gap-2 text-sm font-semibold text-success" role="status">
              <CheckCircleIcon class="w-5 h-5" />Thanks — we'll get back to you shortly.
            </p>
          </form>
        </section>

      </aside>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppFormField from '@/components/ui/AppFormField.vue'
import StatCard from '@/components/ui/StatCard.vue'
import {
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  ClockIcon,
  GlobeAltIcon,
  PlusIcon,
  DocumentIcon,
  CalendarIcon,
  UsersIcon,
  PencilIcon,
  CheckIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  LightBulbIcon,
  TrophyIcon,
  BoltIcon,
  BuildingOffice2Icon,
  UserIcon,
} from '@heroicons/vue/24/outline'

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { label: 'Steps',        value: '6',          sublabel: 'Quick and easy',              icon: AdjustmentsHorizontalIcon },
  { label: 'Record types', value: '3',          sublabel: 'Sales, Pre-Sales, Marketing', icon: DocumentTextIcon },
  { label: 'Est. time',    value: '~1 min',     sublabel: 'Per activity',                icon: ClockIcon },
  { label: 'Synced to',    value: 'Salesforce', sublabel: 'Automatically',               icon: GlobeAltIcon },
]

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  {
    title: 'Open the activity form',
    subtitle: 'Start logging your activity',
    icon: PlusIcon,
    description: 'Click "Log activity" — it\'s in the top-right corner of Metrics and Activity. This opens the activity form where you\'ll fill in all the details.',
    bullets: [
      'Go to Metrics or Activity in the sidebar',
      'Click the "Log activity" button',
    ],
    tip: 'You can also create a follow-up activity from any existing activity\'s detail view by clicking "Create Follow-up".',
  },
  {
    title: 'Choose a record type',
    subtitle: 'Sales, Pre-Sales, or Marketing',
    icon: DocumentIcon,
    description: 'The first step is choosing the type of activity you\'re logging. This determines which activity sub-types are available in the next step. Click a card to select it — you\'ll automatically advance to the details form.',
    recordTypes: [
      {
        name: 'Sales',
        box: 'bg-sales/15 text-sales',
        icon: BoltIcon,
        tags: ['Account Intelligence', 'Business Review', 'Customer Success', 'New Partner Onboarding', 'Sales Enablement', 'Pipeline Activity'],
      },
      {
        name: 'Pre-Sales',
        box: 'bg-presales/15 text-presales',
        icon: DocumentTextIcon,
        tags: ['Competitive/Portfolio Overview', 'Risk Assessment', 'Partner Enablement', 'Sales Enablement', 'Pipeline Activity', 'Qualification Call', 'Demo/Workshop', 'Webinar'],
      },
      {
        name: 'Marketing',
        box: 'bg-marketing/15 text-marketing',
        icon: UsersIcon,
        tags: ['Marketing Enablement', 'Pipeline Activity', 'Webinar'],
      },
    ],
    tip: 'Each record type has its own set of activity sub-types. Choose the one that best matches the work you did.',
  },
  {
    title: 'Set the date & activity type',
    subtitle: 'When did it happen and what kind?',
    icon: CalendarIcon,
    description: 'Pick the date the activity took place (or will take place) and select the specific activity type from the dropdown. The stage is automatically calculated — future dates are set to "Date Confirmed" and past dates to "Completed".',
    bullets: [
      'Click the date picker and select the activity date',
      'Choose the activity type from the dropdown',
    ],
    tip: 'Today\'s date is pre-filled by default. You can log activities for past dates too — the stage will adjust automatically.',
  },
  {
    title: 'Link related companies',
    subtitle: 'Vendors, Resellers & End Users',
    icon: UsersIcon,
    description: 'Connect your activity to the relevant companies. Vendors are required for all activities. Resellers and End Users are optional unless the activity type is "Account Intelligence", in which case at least one End User is required.',
    entities: [
      { label: 'Vendors', required: true, icon: BuildingOffice2Icon, hint: 'The vendor(s) related to this activity. Type at least 3 characters to search.' },
      { label: 'Reseller', required: false, icon: UsersIcon, hint: 'The reseller involved. You can create a new one inline by clicking "Create New".' },
      { label: 'End users', required: false, icon: UserIcon, hint: 'The end customer(s) involved. Also supports inline creation via "Create New".' },
    ],
    tip: 'Can\'t find a reseller or end user? Click "Create New" next to each field to add one on the fly — it gets created in Salesforce instantly.',
  },
  {
    title: 'Write a description & next step',
    subtitle: 'What happened and what\'s next?',
    icon: PencilIcon,
    description: 'Provide a clear description of the activity and outline the planned next step. Both fields are required. Be specific — these details help your team track progress and provide context for follow-ups.',
    fields: [
      {
        label: 'Description',
        example: 'Conducted a demo of CrowdStrike Falcon platform with ABC Corp\'s security team. Discussed endpoint protection capabilities, pricing tiers, and integration with their existing SIEM.',
      },
      {
        label: 'Next Step',
        example: 'Schedule a follow-up PoC session with their IT director. Send over the technical requirements doc by Friday.',
      },
    ],
    tip: 'Good descriptions include who was involved, what was discussed, and any outcomes. Good next steps are actionable and time-bound.',
  },
  {
    title: 'Submit your activity',
    subtitle: 'Save and you earn points',
    icon: CheckIcon,
    description: 'Review your details and click "Create Activity" to save. Your activity will be synced and appear on the Activity page immediately. You can also use "Save & Create Another" to log multiple activities in a row without closing the modal.',
    bullets: [
      '"Create Activity" — saves and closes the modal',
      '"Save & Create Another" — saves and resets the form for the next entry',
    ],
    tip: 'If a matching activity already exists (same date, vendor, and reseller/end user), you\'ll be prompted to join it as an attendee instead of creating a duplicate.',
  },
]

// ── Open state (Set — multiple can be open) ───────────────────────────────────
const openSteps = reactive(new Set([0])) // step 1 open by default

function toggleStep(i) {
  openSteps.has(i) ? openSteps.delete(i) : openSteps.add(i)
}
function expandAll()   { steps.forEach((_, i) => openSteps.add(i)) }
function collapseAll() { openSteps.clear() }

// ── Pro Tips ──────────────────────────────────────────────────────────────────
const proTips = [
  {
    title: 'Duplicate detection',
    icon: MagnifyingGlassIcon,
    body: 'Race Control automatically checks for matching activities when you fill in the date, vendors, and reseller/end users. If a match is found, you can join it as an attendee instead of creating a duplicate.',
  },
  {
    title: 'Create companies inline',
    icon: PlusIcon,
    body: 'If a reseller or end user doesn\'t exist yet, you don\'t need to leave the activity form. Click "Create New" next to the entity field and fill in the details — it\'ll be created in Salesforce and added to your activity automatically.',
  },
  {
    title: 'Follow-up activities',
    icon: UsersIcon,
    body: 'After viewing an existing activity, you can create a follow-up that inherits the vendors, resellers, and end users. This saves time and keeps activities linked together.',
  },
  {
    title: 'Minimum search characters',
    icon: ExclamationTriangleIcon,
    body: 'Entity searches (vendors, resellers, end users) require at least 3 characters before results appear. This keeps searches fast and relevant.',
  },
]

// ── Contact Support ───────────────────────────────────────────────────────────
const supportSubject = ref('')
const supportBody    = ref('')
const sending        = ref(false)
const sent           = ref(false)

async function sendSupport() {
  if (!supportSubject.value.trim() || !supportBody.value.trim()) return
  sending.value = true
  sent.value = false
  // TODO: POST /api/support { subject, body }
  await new Promise((r) => setTimeout(r, 600))
  sending.value = false
  sent.value = true
  supportSubject.value = ''
  supportBody.value = ''
}
</script>

<style scoped>
.step-expand-enter-active,
.step-expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.step-expand-enter-from,
.step-expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

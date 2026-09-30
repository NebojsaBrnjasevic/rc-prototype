<template>
  <AppLayout>
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">How-To Guide</h1>
      <p class="mt-1 text-sm text-subtle">Everything you need to know about logging activities in Race Control</p>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">{{ stat.label }}</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
          <p class="text-xs text-subtle mt-0.5">{{ stat.sublabel }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <component :is="stat.icon" class="w-4 h-4 text-subtle" />
        </div>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

      <!-- Left: Step-by-Step -->
      <div>
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="w-1 h-5 rounded-full bg-brand-400 inline-block" />
            Step-by-Step Guide
          </h2>
          <div class="flex items-center gap-3 text-xs font-medium">
            <button class="text-brand-400 hover:text-brand-500 transition-colors" @click="expandAll">Expand All</button>
            <span class="text-subtle">|</span>
            <button class="text-brand-400 hover:text-brand-500 transition-colors" @click="collapseAll">Collapse All</button>
          </div>
        </div>

        <!-- Stepper list -->
        <div>
          <div v-for="(step, i) in steps" :key="i" class="flex gap-4">

            <!-- Left column: icon + connector line -->
            <div class="flex flex-col items-center flex-shrink-0">
              <!-- Icon button -->
              <button
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
                :class="openSteps.has(i)
                  ? 'bg-brand-400 text-white shadow-md shadow-brand-400/30'
                  : 'bg-gray-100 dark:bg-surface-dark-overlay text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-surface-dark-border'"
                @click="toggleStep(i)"
                :aria-label="openSteps.has(i) ? 'Collapse step' : 'Expand step'"
              >
                <component :is="step.icon" class="w-4 h-4" />
              </button>

              <!-- Connector line (always visible between steps, highlights when either adjacent step is open) -->
              <div
                v-if="i < steps.length - 1"
                class="w-0.5 flex-1 min-h-[16px] my-1 rounded-full transition-colors duration-300"
                :class="openSteps.has(i) || openSteps.has(i + 1)
                  ? 'bg-brand-400/50'
                  : 'bg-gray-200 dark:bg-surface-dark-border'"
              />
            </div>

            <!-- Right column: header + content -->
            <div class="flex-1 min-w-0 pb-4">

              <!-- Step header (clickable) -->
              <button
                class="w-full text-left flex items-start justify-between gap-2 pt-1 pb-2"
                @click="toggleStep(i)"
              >
                <div class="min-w-0">
                  <p class="text-2xs text-subtle uppercase tracking-widest font-semibold mb-0.5">Step {{ i + 1 }}</p>
                  <p class="text-base font-bold text-gray-900 dark:text-white leading-tight">{{ step.title }}</p>
                  <p class="text-sm text-subtle mt-0.5">{{ step.subtitle }}</p>
                </div>
                <ChevronDownIcon
                  class="w-4 h-4 text-subtle flex-shrink-0 mt-1.5 transition-transform duration-200"
                  :class="openSteps.has(i) ? 'rotate-180' : ''"
                />
              </button>

              <!-- Expanded content -->
              <Transition name="step-expand">
                <div v-if="openSteps.has(i)" class="rounded-xl overflow-hidden border border-surface-light-border dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised">
                  <div class="p-4 border-l-2 border-brand-400">
                    <!-- Description -->
                    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      {{ step.description }}
                    </p>

                    <!-- Record type cards (step 2 only) -->
                    <div v-if="step.recordTypes" class="space-y-2 mb-3">
                      <div
                        v-for="rt in step.recordTypes"
                        :key="rt.name"
                        class="rounded-lg border border-surface-light-border dark:border-surface-dark-border p-3 bg-gray-50 dark:bg-surface-dark-overlay"
                      >
                        <div class="flex items-center gap-2 mb-2">
                          <div class="w-6 h-6 rounded-md flex items-center justify-center" :style="{ background: rt.color + '22' }">
                            <component :is="rt.icon" class="w-3.5 h-3.5" :style="{ color: rt.color }" />
                          </div>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ rt.name }}</p>
                        </div>
                        <div class="flex flex-wrap gap-1">
                          <span
                            v-for="tag in rt.tags"
                            :key="tag"
                            class="text-2xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-surface-dark-border text-gray-600 dark:text-gray-400"
                          >{{ tag }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Entity fields (step 4 only) -->
                    <div v-if="step.entities" class="space-y-2 mb-3">
                      <div
                        v-for="entity in step.entities"
                        :key="entity.label"
                        class="rounded-lg border border-surface-light-border dark:border-surface-dark-border p-3 bg-gray-50 dark:bg-surface-dark-overlay"
                      >
                        <div class="flex items-center gap-2 mb-1">
                          <component :is="entity.icon" class="w-3.5 h-3.5 text-subtle" />
                          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ entity.label }}</span>
                          <span class="text-2xs px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-surface-dark-border text-gray-500 dark:text-gray-400">{{ entity.badge }}</span>
                        </div>
                        <p class="text-xs text-subtle">{{ entity.hint }}</p>
                      </div>
                    </div>

                    <!-- Description + Next Step fields (step 5 only) -->
                    <div v-if="step.fields" class="space-y-3 mb-3">
                      <div v-for="field in step.fields" :key="field.label">
                        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1.5">
                          {{ field.label }}
                          <span class="text-danger text-xs">*</span>
                        </label>
                        <div class="rounded-lg border border-surface-light-border dark:border-surface-dark-border p-3 bg-gray-50 dark:bg-surface-dark-overlay">
                          <p class="text-2xs text-subtle uppercase tracking-wider mb-1">Example</p>
                          <p class="text-xs text-gray-600 dark:text-gray-400 italic">{{ field.example }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Bullet points -->
                    <ul v-if="step.bullets" class="space-y-1.5 mb-3">
                      <li
                        v-for="bullet in step.bullets"
                        :key="bullet"
                        class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span class="text-brand-400 flex-shrink-0 mt-px text-xs">✦</span>
                        {{ bullet }}
                      </li>
                    </ul>

                    <!-- Tip callout -->
                    <div v-if="step.tip" class="flex items-start gap-2 rounded-lg bg-reward/10 border border-reward/20 px-3 py-2.5">
                      <span class="flex-shrink-0">💡</span>
                      <p class="text-xs text-gray-700 dark:text-gray-300">
                        <span class="font-semibold text-reward">Tip:</span> {{ step.tip }}
                      </p>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex flex-col items-center mt-6 gap-2">
          <RouterLink
            to="/activity"
            class="flex items-center gap-2 px-6 h-11 rounded-xl bg-brand-400 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
          >
            Start Logging Activities
            <ArrowRightIcon class="w-4 h-4" />
          </RouterLink>
          <p class="text-xs text-subtle">You'll earn points for every activity you log</p>
        </div>
      </div>

      <!-- Right: Pro Tips + Contact -->
      <div class="space-y-6 lg:sticky lg:top-[4.5rem] self-start">

        <!-- Pro Tips -->
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            ✨ Pro Tips
          </h2>
          <div class="space-y-3">
            <div v-for="tip in proTips" :key="tip.title" class="card p-4">
              <div class="flex items-center gap-2.5 mb-2">
                <div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
                  <component :is="tip.icon" class="w-3.5 h-3.5 text-subtle" />
                </div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ tip.title }}</p>
              </div>
              <p class="text-xs text-subtle leading-relaxed">{{ tip.body }}</p>
            </div>
          </div>
        </div>

        <!-- Contact Support -->
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <QuestionMarkCircleIcon class="w-5 h-5 text-subtle" />
            Contact Support
          </h2>
          <div class="card p-4 space-y-3">
            <p class="text-xs text-subtle">Need help? Fill in the form below and we'll get back to you.</p>
            <div>
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Subject</label>
              <input
                v-model="supportSubject"
                type="text"
                placeholder="Brief description of your issue"
                class="w-full h-9 px-3 rounded-lg text-sm border bg-white dark:bg-surface-dark-base
                  border-surface-light-border dark:border-surface-dark-border
                  text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-colors"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Description</label>
              <textarea
                v-model="supportBody"
                rows="4"
                placeholder="Please describe your issue in detail..."
                class="w-full px-3 py-2 rounded-lg text-sm border resize-none bg-white dark:bg-surface-dark-base
                  border-surface-light-border dark:border-surface-dark-border
                  text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-colors"
              />
            </div>
            <button
              class="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-semibold
                bg-brand-400/20 hover:bg-brand-400/30 text-brand-400 transition-colors"
              @click="sendSupport"
            >
              <EnvelopeIcon class="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>

      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
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
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  BoltIcon,
  BuildingOffice2Icon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { label: 'Steps',        value: '6',         sublabel: 'Quick and easy',            icon: AdjustmentsHorizontalIcon },
  { label: 'Record Types', value: '3',         sublabel: 'Sales, Pre-Sales, Marketing', icon: DocumentTextIcon },
  { label: 'Est. Time',    value: '~1 min',    sublabel: 'Per activity',              icon: ClockIcon },
  { label: 'Synced To',    value: 'Salesforce', sublabel: 'Automatically',            icon: GlobeAltIcon },
]

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  {
    title: 'Open the Activity Modal',
    subtitle: 'Start logging your activity',
    icon: PlusIcon,
    description: 'Navigate to the Activity page from the main navigation bar, then click the "+ New Activity" button in the top-right corner. This opens the activity creation modal where you\'ll fill in all the details.',
    bullets: [
      'Click "Activity" in the top navigation bar',
      'Click the "+ New Activity" button',
    ],
    tip: 'You can also create a follow-up activity from any existing activity\'s detail view by clicking "Create Follow-up".',
  },
  {
    title: 'Choose a Record Type',
    subtitle: 'Sales, Pre-Sales, or Marketing',
    icon: DocumentIcon,
    description: 'The first step is choosing the type of activity you\'re logging. This determines which activity sub-types are available in the next step. Click a card to select it — you\'ll automatically advance to the details form.',
    recordTypes: [
      {
        name: 'Sales',
        color: '#3BB3E5',   // sales = brand cyan
        icon: BoltIcon,
        tags: ['Account Intelligence', 'Business Review', 'Customer Success', 'New Partner Onboarding', 'Sales Enablement', 'Pipeline Activity'],
      },
      {
        name: 'Pre-Sales',
        color: '#8B5CF6',   // presales = violet
        icon: DocumentTextIcon,
        tags: ['Competitive/Portfolio Overview', 'Risk Assessment', 'Partner Enablement', 'Sales Enablement', 'Pipeline Activity', 'Qualification Call', 'Demo/Workshop', 'Webinar'],
      },
      {
        name: 'Marketing',
        color: '#10B981',   // marketing = emerald/success
        icon: UsersIcon,
        tags: ['Marketing Enablement', 'Pipeline Activity', 'Webinar'],
      },
    ],
    tip: 'Each record type has its own set of activity sub-types. Choose the one that best matches the work you did.',
  },
  {
    title: 'Set the Date & Activity Type',
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
    title: 'Link Related Entities',
    subtitle: 'Vendors, Resellers & End Users',
    icon: UsersIcon,
    description: 'Connect your activity to the relevant companies. Vendors are required for all activities. Resellers and End Users are optional unless the activity type is "Account Intelligence", in which case at least one End User is required.',
    entities: [
      { label: 'Vendors', badge: 'REQUIRED', icon: BuildingOffice2Icon, hint: 'The vendor(s) related to this activity. Type at least 3 characters to search.' },
      { label: 'Reseller', badge: 'OPTIONAL', icon: UsersIcon, hint: 'The reseller involved. You can create a new one inline by clicking "Create New".' },
      { label: 'End Users', badge: 'OPTIONAL', icon: UserIcon, hint: 'The end customer(s) involved. Also supports inline creation via "Create New".' },
    ],
    tip: 'Can\'t find a reseller or end user? Click "Create New" next to each field to add one on the fly — it gets created in Salesforce instantly.',
  },
  {
    title: 'Write Description & Next Step',
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
    title: 'Submit Your Activity',
    subtitle: 'Save and you\'re done!',
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
    title: 'Duplicate Detection',
    icon: MagnifyingGlassIcon,
    body: 'Race Control automatically checks for matching activities when you fill in the date, vendors, and reseller/end users. If a match is found, you can join it as an attendee instead of creating a duplicate.',
  },
  {
    title: 'Create Companies Inline',
    icon: PlusIcon,
    body: 'If a reseller or end user doesn\'t exist yet, you don\'t need to leave the activity form. Click "Create New" next to the entity field and fill in the details — it\'ll be created in Salesforce and added to your activity automatically.',
  },
  {
    title: 'Follow-up Activities',
    icon: UsersIcon,
    body: 'After viewing an existing activity, you can create a follow-up that inherits the vendors, resellers, and end users. This saves time and keeps activities linked together.',
  },
  {
    title: 'Minimum Search Characters',
    icon: ExclamationTriangleIcon,
    body: 'Entity searches (vendors, resellers, end users) require at least 3 characters before results appear. This keeps searches fast and relevant.',
  },
]

// ── Contact Support ───────────────────────────────────────────────────────────
const supportSubject = ref('')
const supportBody    = ref('')

function sendSupport() {
  // TODO: call real support email API
  alert('Support request sent! We\'ll get back to you shortly.')
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

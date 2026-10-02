<template>
  <AppLayout>
    <div class="flex gap-8 min-h-screen">

      <!-- ── Sticky left sidebar ──────────────────────────────────────── -->
      <aside class="hidden lg:flex flex-col w-52 flex-shrink-0">
        <div class="lg:sticky lg:top-[4.5rem] self-start space-y-1">
          <div class="mb-4 px-3">
            <p class="text-overline text-brand">Internal</p>
            <p class="text-sm font-semibold text-fg mt-0.5">Design System</p>
            <p class="text-xs text-subtle mt-0.5">Vue 3 + Tailwind CSS</p>
          </div>

          <div v-for="group in navGroups" :key="group.label" class="mb-3">
            <p class="text-xs text-subtle uppercase tracking-widest font-semibold px-3 mb-1">{{ group.label }}</p>
            <router-link
              v-for="item in group.items"
              :key="item.slug"
              :to="'/ds/' + item.slug"
              class="block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
              :class="route.params.slug === item.slug
                ? 'bg-surface-2 text-fg font-bold ring-1 ring-inset ring-line'
                : 'text-subtle hover:text-fg hover:bg-surface-2'"
            >{{ item.label }}</router-link>
          </div>

          <div class="px-3 pt-3 mt-2 border-t border-line">
            <router-link to="/ds" class="text-xs text-subtle hover:text-brand transition-colors">← All components</router-link>
          </div>
        </div>
      </aside>

      <!-- ── Main content ─────────────────────────────────────────────── -->
      <main class="flex-1 min-w-0 pb-24">

        <template v-if="current">
          <!-- Page header -->
          <div class="mb-8">
            <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">{{ current.title }}</h1>
            <p class="text-sm text-subtle mt-1 max-w-2xl">{{ current.description }}</p>
          </div>

          <!-- When to use / When not to use -->
          <div v-if="current.whenToUse" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div class="rounded-card border border-success/30 bg-success/[0.06] p-5">
              <p class="text-overline text-success mb-3 flex items-center gap-2"><CheckCircleIcon class="w-4 h-4" />When to use</p>
              <ul class="space-y-2">
                <li v-for="item in current.whenToUse" :key="item" class="text-sm text-fg-2 flex gap-2">
                  <span class="text-success flex-shrink-0" aria-hidden="true">•</span>{{ item }}
                </li>
              </ul>
            </div>
            <div class="rounded-card border border-danger/30 bg-danger/[0.06] p-5">
              <p class="text-overline text-danger mb-3 flex items-center gap-2"><XCircleIcon class="w-4 h-4" />When not to use</p>
              <ul class="space-y-2">
                <li v-for="item in current.whenNotTo" :key="item" class="text-sm text-fg-2 flex gap-2">
                  <span class="text-danger flex-shrink-0" aria-hidden="true">•</span>{{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Props table -->
          <section v-if="current.props" class="mb-8">
            <h2 class="text-overline text-subtle mb-3">Props</h2>
            <div class="rounded-xl border border-line overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface-2">
                  <tr>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Name</th>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Type</th>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Default</th>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-line">
                  <tr v-for="prop in current.props" :key="prop.name" class="bg-surface-1">
                    <td class="px-4 py-2.5 font-mono text-brand text-xs">{{ prop.name }}</td>
                    <td class="px-4 py-2.5 font-mono text-fg-2 text-xs">{{ prop.type }}</td>
                    <td class="px-4 py-2.5 font-mono text-fg-muted text-xs">{{ prop.default ?? '—' }}</td>
                    <td class="px-4 py-2.5 text-fg-2 text-xs">{{ prop.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Stories -->
          <div v-for="story in current.stories" :key="story.name" class="mb-10">
            <div class="mb-3">
              <h3 class="text-[15px] font-extrabold text-fg">{{ story.name }}</h3>
              <p v-if="story.description" class="text-xs text-subtle mt-0.5">{{ story.description }}</p>
            </div>
            <div class="rounded-card border border-line bg-surface-1 p-6 mb-3">
              <component :is="story.demo" />
            </div>
            <div class="rounded-xl bg-page border border-line overflow-hidden">
              <div class="px-4 py-2 border-b border-line flex items-center justify-between">
                <span class="text-xs text-fg-muted font-mono">{{ story.name }}</span>
                <button
                  class="text-xs text-fg-muted hover:text-fg transition-colors px-2 py-1 rounded hover:bg-surface-2"
                  @click="copyText(story.snippet, story.name)"
                >{{ copiedKey === story.name ? 'Copied!' : 'Copy' }}</button>
              </div>
              <pre class="p-4 overflow-x-auto text-sm font-mono text-fg-2 leading-relaxed"><code>{{ story.snippet }}</code></pre>
            </div>
          </div>

        </template>

        <!-- Not found -->
        <div v-else class="text-center py-20">
          <p class="text-subtle text-sm">Component <span class="font-mono text-brand">{{ slug }}</span> not found.</p>
          <router-link to="/ds" class="mt-4 inline-block text-sm text-brand hover:underline">← Back to Design System</router-link>
        </div>

      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'
import {
  TableCellsIcon, CalendarDaysIcon, ViewColumnsIcon, Squares2X2Icon, BanknotesIcon, BoltIcon,
  BriefcaseIcon, BeakerIcon, MegaphoneIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import AppCheckbox from '@/components/ui/AppCheckbox.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppDivider from '@/components/ui/AppDivider.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppFormField from '@/components/ui/AppFormField.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import AppChip from '@/components/ui/AppChip.vue'
import AppSegmentControl from '@/components/ui/AppSegmentControl.vue'
import AppViewTabs from '@/components/ui/AppViewTabs.vue'
import AppRadioCard from '@/components/ui/AppRadioCard.vue'
import AppInfoChip from '@/components/ui/AppInfoChip.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import AppPeriodTabs from '@/components/ui/AppPeriodTabs.vue'
import AppCountdown from '@/components/ui/AppCountdown.vue'
import AppXpBar from '@/components/ui/AppXpBar.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppRewardBox from '@/components/ui/AppRewardBox.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppCombobox from '@/components/ui/AppCombobox.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppDrawer from '@/components/ui/AppDrawer.vue'
import AppPopover from '@/components/ui/AppPopover.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { useUiStore } from '@/stores/useUiStore'
import { RECORD_STYLE, COMPANY_STYLE } from '@/utils/activity'

const route = useRoute()
const slug = computed(() => route.params.slug)

// ── Nav structure ─────────────────────────────────────────────────────────
const navGroups = [
  {
    label: 'Foundations',
    items: [
      { slug: 'colors',     label: 'Color Tokens' },
      { slug: 'typography', label: 'Typography'   },
      { slug: 'spacing',    label: 'Spacing Scale' },
    ],
  },
  {
    label: 'Atoms',
    items: [
      { slug: 'button',   label: 'Button' },
      { slug: 'badge',    label: 'Badge' },
      { slug: 'avatar',   label: 'Avatar' },
      { slug: 'input',    label: 'Input' },
      { slug: 'textarea', label: 'Textarea' },
      { slug: 'combobox', label: 'Combobox' },
      { slug: 'select',   label: 'Select' },
      { slug: 'toggle',   label: 'Toggle' },
      { slug: 'checkbox', label: 'Checkbox' },
      { slug: 'divider',  label: 'Divider' },
      { slug: 'spinner',  label: 'Spinner' },
      { slug: 'skeleton', label: 'Skeleton' },
      { slug: 'stat-card', label: 'Stat Card' },
      { slug: 'data-table', label: 'Data Table' },
    ],
  },
  {
    label: 'Forms',
    items: [
      { slug: 'form-field',  label: 'Form Field' },
      { slug: 'empty-state', label: 'Empty State' },
    ],
  },
  {
    label: 'Interaction',
    items: [
      { slug: 'chip',            label: 'Chip' },
      { slug: 'info-chip',       label: 'Info Chip' },
      { slug: 'segment-control', label: 'Segment Control' },
      { slug: 'view-tabs',       label: 'View Tabs' },
      { slug: 'radio-card',      label: 'Radio Card' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { slug: 'modal',  label: 'Modal' },
      { slug: 'drawer', label: 'Drawer' },
      { slug: 'popover', label: 'Popover' },
      { slug: 'toast',  label: 'Toast' },
    ],
  },
  {
    label: 'Gamification',
    items: [
      { slug: 'period-tabs', label: 'Period Tabs' },
      { slug: 'countdown',   label: 'Countdown' },
      { slug: 'xp-bar',      label: 'XP Bar' },
      { slug: 'reward-box',  label: 'Reward Box' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { slug: 'progress', label: 'Progress Bar' },
    ],
  },
]

// ── Demo reactive state (defined before componentData so closures work) ───
const demoTags      = ref(['Vue 3', 'Tailwind', 'Pinia', 'Vite'])
const demoSegment   = ref('mine')
const demoSegment2  = ref('table')
const demoTab       = ref('overview')
const demoRadio     = ref('sales')
const demoInput     = ref('')
const demoClearable = ref('Clear me…')
const demoToggle1   = ref(true)
const demoToggle2   = ref(false)
const demoToggle3   = ref(true)
const demoCheck1    = ref(true)
const demoCheck2    = ref(false)
const demoSelect    = ref('')
const demoSelectErr = ref('')
const demoFormInput = ref('')
const demoFormSelect = ref('')
const demoPeriod    = ref('week')
const demoReward    = ref(true)
const demoTextarea  = ref('')
const demoComboSingle = ref('Softcat plc')
const demoComboMulti  = ref(['CrowdStrike'])
const demoModal     = ref(false)
const demoDrawer    = ref(false)

function removeTag(tag) {
  const idx = demoTags.value.indexOf(tag)
  if (idx > -1) demoTags.value.splice(idx, 1)
}

// ── Component data ────────────────────────────────────────────────────────
const componentData = {

  // ── Button ──────────────────────────────────────────────────────────────
  button: {
    title: 'Button',
    description: 'The primary interactive element in the design system. Buttons communicate actions and guide users through a flow. Use them for actions that happen in the current context — not for navigation between pages.',
    whenToUse: [
      'Submitting forms or confirming dialogs',
      'Triggering actions like Save, Delete, or Export',
      'Opening modals or drawers',
      'Secondary and ghost variants for lower-priority actions alongside a primary button',
    ],
    whenNotTo: [
      "Don't use multiple primary buttons in one view — pick one primary action",
      "Don't use buttons for navigation — use RouterLink or <a> instead",
      'Avoid ghost buttons as standalone CTAs without visual context',
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'reward' | 'danger'", default: "'primary'", description: 'Visual style. reward = gold, only for claiming points/bonuses' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height: 36 / 44 / 48px. md is the 44px touch-target default' },
      { name: 'tag', type: "String | Component", default: "'button'", description: "Render as 'a' or a component — :tag=\"RouterLink\" to=\"/activity\" for navigation that looks like a button" },
      { name: 'loading', type: 'Boolean', default: 'false', description: 'Shows a spinner and disables interaction' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents clicks and dims the button' },
    ],
    stories: [
      {
        name: 'Variants',
        description: 'Five semantic variants. Primary is the one action per screen; reward is gold and only claims points.',
        snippet: `<AppButton variant="primary">Log activity</AppButton>
<AppButton variant="secondary">Export CSV</AppButton>
<AppButton variant="ghost">View all</AppButton>
<AppButton variant="reward">Claim bonus</AppButton>
<AppButton variant="danger">Delete</AppButton>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap gap-3' }, [
          h(AppButton, { variant: 'primary' }, () => 'Log activity'),
          h(AppButton, { variant: 'secondary' }, () => 'Export CSV'),
          h(AppButton, { variant: 'ghost' }, () => 'View all'),
          h(AppButton, { variant: 'reward' }, () => 'Claim bonus'),
          h(AppButton, { variant: 'danger' }, () => 'Delete'),
        ]) } }),
      },
      {
        name: 'Sizes',
        description: 'Three sizes to match surrounding content density.',
        snippet: `<AppButton variant="primary" size="sm">Small</AppButton>
<AppButton variant="primary" size="md">Medium</AppButton>
<AppButton variant="primary" size="lg">Large</AppButton>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap items-center gap-3' }, [
          h(AppButton, { variant: 'primary', size: 'sm' }, () => 'Small'),
          h(AppButton, { variant: 'primary', size: 'md' }, () => 'Medium'),
          h(AppButton, { variant: 'primary', size: 'lg' }, () => 'Large'),
        ]) } }),
      },
      {
        name: 'States',
        description: 'Loading shows a spinner and prevents double-submission. Disabled dims and blocks interaction.',
        snippet: `<AppButton variant="primary" :loading="true">Loading</AppButton>
<AppButton variant="primary" :disabled="true">Disabled</AppButton>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap items-center gap-3' }, [
          h(AppButton, { variant: 'primary', loading: true }, () => 'Loading'),
          h(AppButton, { variant: 'primary', disabled: true }, () => 'Disabled'),
        ]) } }),
      },
    ],
  },

  // ── Badge ────────────────────────────────────────────────────────────────
  badge: {
    title: 'Badge',
    description: 'Compact status labels for communicating state or category at a glance. Badges are non-interactive — they display information, not trigger actions.',
    whenToUse: [
      'Status of an entity (Active, Pending, Closed)',
      'Category labels on cards or list items',
      'Numeric counts or points indicators',
    ],
    whenNotTo: [
      "Don't use as buttons or interactive elements",
      "Don't stack more than 2–3 badges per row",
    ],
    props: [
      { name: 'color', type: "'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'reward'", default: "'neutral'", description: 'Color scheme of the badge' },
      { name: 'size', type: "'xs' | 'sm' | 'md'", default: "'sm'", description: 'Size of the badge' },
      { name: 'dot', type: 'Boolean', default: 'false', description: 'Shows a colored dot before the label' },
    ],
    stories: [
      {
        name: 'Colors',
        description: 'Six semantic color variants.',
        snippet: `<AppBadge color="brand">Brand</AppBadge>
<AppBadge color="success">Success</AppBadge>
<AppBadge color="warning">Warning</AppBadge>
<AppBadge color="danger">Danger</AppBadge>
<AppBadge color="neutral">Neutral</AppBadge>
<AppBadge color="reward">Reward</AppBadge>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap gap-2' }, [
          h(AppBadge, { color: 'brand' }, () => 'Brand'),
          h(AppBadge, { color: 'success' }, () => 'Success'),
          h(AppBadge, { color: 'warning' }, () => 'Warning'),
          h(AppBadge, { color: 'danger' }, () => 'Danger'),
          h(AppBadge, { color: 'neutral' }, () => 'Neutral'),
          h(AppBadge, { color: 'reward' }, () => 'Reward'),
        ]) } }),
      },
      {
        name: 'With dot indicator',
        description: 'Dot prefix for live status communication.',
        snippet: `<AppBadge color="success" dot>Active</AppBadge>
<AppBadge color="warning" dot>Pending</AppBadge>
<AppBadge color="danger" dot>Offline</AppBadge>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap gap-2' }, [
          h(AppBadge, { color: 'success', dot: true }, () => 'Active'),
          h(AppBadge, { color: 'warning', dot: true }, () => 'Pending'),
          h(AppBadge, { color: 'danger', dot: true }, () => 'Offline'),
        ]) } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppBadge color="brand" size="xs">XSmall</AppBadge>
<AppBadge color="brand" size="sm">Small</AppBadge>
<AppBadge color="brand" size="md">Medium</AppBadge>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap items-center gap-2' }, [
          h(AppBadge, { color: 'brand', size: 'xs' }, () => 'XSmall'),
          h(AppBadge, { color: 'brand', size: 'sm' }, () => 'Small'),
          h(AppBadge, { color: 'brand', size: 'md' }, () => 'Medium'),
        ]) } }),
      },
    ],
  },

  // ── Avatar ───────────────────────────────────────────────────────────────
  avatar: {
    title: 'Avatar',
    description: 'User representation component with deterministic color generation from name. Falls back to initials when no image is provided.',
    whenToUse: [
      'User identity in comments, activity feeds, or headers',
      'Avatar groups for showing multiple participants',
      'Profile pictures and account menus',
    ],
    whenNotTo: [
      "Don't use for non-person entities — use icons or badges instead",
    ],
    props: [
      { name: 'name', type: 'String', default: '—', description: 'Full name — used to generate initials and a deterministic background color' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter of the avatar' },
      { name: 'src', type: 'String', default: '—', description: 'Image URL — falls back to initials if not provided or fails to load' },
    ],
    stories: [
      {
        name: 'Sizes',
        description: 'Five sizes from xs (24px) to xl (56px).',
        snippet: `<AppAvatar name="Nikola Gavric" size="xl" />
<AppAvatar name="Wolfgang H." size="lg" />
<AppAvatar name="Chris F" size="md" />
<AppAvatar name="Darren G" size="sm" />
<AppAvatar name="A" size="xs" />`,
        demo: defineComponent({ setup() {
          const people = [['Nikola Gavric','xl'],['Wolfgang H.','lg'],['Chris F','md'],['Darren G','sm'],['A','xs']]
          return () => h('div', { class: 'flex flex-wrap items-end gap-4' }, people.map(([name, size]) =>
            h('div', { class: 'flex flex-col items-center gap-1.5' }, [
              h(AppAvatar, { name, size }),
              h('span', { class: 'text-xs text-subtle font-mono' }, size),
            ])
          ))
        } }),
      },
      {
        name: 'Avatar group',
        description: 'Overlapping ring pattern for showing multiple participants with a +N overflow indicator.',
        snippet: `<div class="flex -space-x-2">
  <AppAvatar
    v-for="n in names" :key="n" :name="n" size="sm"
    class="ring-2 ring-surface-1"
  />
  <div class="w-8 h-8 rounded-xl bg-surface-2
              border-2 border-surface-1
              flex items-center justify-center">
    <span class="text-xs text-subtle font-semibold">+8</span>
  </div>
</div>`,
        demo: defineComponent({ setup() {
          const names = ['Nikola Gavric','Wolfgang H','Chris F','Darren G']
          return () => h('div', { class: 'flex -space-x-2' }, [
            ...names.map(n => h(AppAvatar, { name: n, size: 'sm', class: 'ring-2 ring-surface-1' })),
            h('div', { class: 'w-8 h-8 rounded-xl bg-surface-2 border-2 border-surface-1 flex items-center justify-center' },
              h('span', { class: 'text-xs text-subtle font-semibold' }, '+8')
            ),
          ])
        } }),
      },
    ],
  },

  // ── Input ────────────────────────────────────────────────────────────────
  input: {
    title: 'Input',
    description: 'Text input field for capturing user data. Supports leading and trailing slots for icons, a clearable state, and inline error feedback. Always pair with AppFormField for a label.',
    whenToUse: [
      'Single-line text capture in forms',
      'Search bars and filter inputs',
      'Any field where the user types free text',
    ],
    whenNotTo: [
      "Don't use for multi-line text — use a textarea instead",
      "Don't use without a label — always pair with AppFormField",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: "''", description: 'Bound value (v-model)' },
      { name: 'type', type: "'text' | 'email' | 'password' | 'number'", default: "'text'", description: 'HTML input type' },
      { name: 'placeholder', type: 'String', default: '—', description: 'Placeholder text shown when empty' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and font size of the input' },
      { name: 'error', type: 'Boolean | String', default: 'false', description: 'Error state — true highlights border red' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Disables the input' },
      { name: 'clearable', type: 'Boolean', default: 'false', description: 'Shows a clear (×) icon when value is non-empty' },
      { name: '#leading / #trailing', type: 'Slot', default: '—', description: 'Icon inside the field — padding adjusts automatically (pl-10 / pr-10)' },
      { name: 'wrapperClass', type: 'String | Array', default: "''", description: 'Classes for the wrapper div. class and other attrs go to the <input> itself' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppInput v-model="text" placeholder="Enter text…" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Enter text…' }),
          ])
        } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppInput v-model="text" placeholder="Small…" size="sm" />
<AppInput v-model="text" placeholder="Medium…" size="md" />
<AppInput v-model="text" placeholder="Large…" size="lg" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-2 max-w-sm' }, [
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Small…', size: 'sm' }),
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Medium…', size: 'md' }),
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Large…', size: 'lg' }),
          ])
        } }),
      },
      {
        name: 'Error state',
        snippet: `<AppInput v-model="text" placeholder="Error state" :error="true" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Error state', error: true }),
          ])
        } }),
      },
      {
        name: 'Clearable',
        snippet: `<AppInput v-model="text" placeholder="Type to clear…" clearable />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppInput, { modelValue: demoClearable.value, 'onUpdate:modelValue': v => { demoClearable.value = v }, placeholder: 'Type to clear…', clearable: true }),
          ])
        } }),
      },
    ],
  },

  // ── Select ───────────────────────────────────────────────────────────────
  select: {
    title: 'Select',
    description: 'Dropdown selector for choosing from a predefined list of options. Accepts both string arrays and label/value object arrays.',
    whenToUse: [
      'Choosing from 5+ options where a radio group would be too long',
      'Type, category, or status filters in forms',
    ],
    whenNotTo: [
      "Don't use for fewer than 4 options — use radio buttons or AppSegmentControl instead",
      'Avoid for Boolean choices — use AppToggle',
    ],
    props: [
      { name: 'modelValue', type: 'String | Object', default: '—', description: 'Bound value (v-model)' },
      { name: 'options', type: "Array<String | { label: String, value: any }>", default: '[]', description: 'List of options — strings or label/value pairs' },
      { name: 'placeholder', type: 'String', default: '—', description: 'Text shown when no value is selected' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the select control' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Highlights the border in danger color' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents interaction' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppSelect
  v-model="selected"
  :options="['Sales', 'Pre-Sales', 'Marketing']"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppSelect, { modelValue: demoSelect.value, 'onUpdate:modelValue': v => { demoSelect.value = v }, options: ['Sales','Pre-Sales','Marketing'] }),
          ])
        } }),
      },
      {
        name: 'With placeholder',
        snippet: `<AppSelect
  v-model="selected"
  :options="['Sales', 'Pre-Sales', 'Marketing']"
  placeholder="Select type…"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppSelect, { modelValue: demoSelect.value, 'onUpdate:modelValue': v => { demoSelect.value = v }, options: ['Sales','Pre-Sales','Marketing'], placeholder: 'Select type…' }),
          ])
        } }),
      },
      {
        name: 'Error state',
        snippet: `<AppSelect
  v-model="selected"
  :options="['Upcoming', 'In Progress', 'Completed']"
  placeholder="Select…"
  :error="true"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppSelect, { modelValue: demoSelectErr.value, 'onUpdate:modelValue': v => { demoSelectErr.value = v }, options: ['Upcoming','In Progress','Completed'], placeholder: 'Select…', error: true }),
          ])
        } }),
      },
    ],
  },

  // ── Toggle ───────────────────────────────────────────────────────────────
  toggle: {
    title: 'Toggle',
    description: 'Binary on/off switch for immediate effect settings. Unlike a checkbox, a toggle typically applies its change immediately without a submit action.',
    whenToUse: [
      'Settings that apply instantly (notifications, dark mode, feature flags)',
      'Any binary preference that has immediate effect',
    ],
    whenNotTo: [
      "Don't use in forms that require a submit button to apply changes — use a checkbox instead",
      'Avoid for acknowledging terms — use a checkbox',
    ],
    props: [
      { name: 'modelValue', type: 'Boolean', default: 'false', description: 'On/off state (v-model)' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the toggle pill' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents toggling' },
      { name: 'activeColor', type: 'String', default: "'bg-brand'", description: 'Tailwind bg class applied when the toggle is on' },
      { name: 'aria-label', type: 'String', default: '—', description: 'Required when there is no visible label wrapping the toggle' },
    ],
    stories: [
      {
        name: 'Default',
        description: 'Interactive on/off state.',
        snippet: `<AppToggle v-model="enabled" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex items-center gap-3' }, [
            h(AppToggle, { modelValue: demoToggle1.value, 'onUpdate:modelValue': v => { demoToggle1.value = v } }),
            h('span', { class: 'text-sm text-subtle' }, demoToggle1.value ? 'On' : 'Off'),
          ])
        } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppToggle v-model="enabled" size="sm" active-color="bg-success" />
<AppToggle v-model="enabled" size="md" />
<AppToggle v-model="enabled" size="lg" active-color="bg-reward" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-4 max-w-xs' }, [
            h('div', { class: 'flex items-center justify-between' }, [
              h('div', [
                h('p', { class: 'text-sm font-medium text-fg' }, 'Notifications'),
                h('p', { class: 'text-xs text-subtle' }, 'size="sm"'),
              ]),
              h(AppToggle, { modelValue: demoToggle2.value, 'onUpdate:modelValue': v => { demoToggle2.value = v }, size: 'sm', activeColor: 'bg-success' }),
            ]),
            h('div', { class: 'flex items-center justify-between' }, [
              h('div', [
                h('p', { class: 'text-sm font-medium text-fg' }, 'Dark Mode'),
                h('p', { class: 'text-xs text-subtle' }, 'size="md" (default)'),
              ]),
              h(AppToggle, { modelValue: demoToggle1.value, 'onUpdate:modelValue': v => { demoToggle1.value = v } }),
            ]),
            h('div', { class: 'flex items-center justify-between' }, [
              h('div', [
                h('p', { class: 'text-sm font-medium text-fg' }, 'Rewards'),
                h('p', { class: 'text-xs text-subtle' }, 'size="lg"'),
              ]),
              h(AppToggle, { modelValue: demoToggle3.value, 'onUpdate:modelValue': v => { demoToggle3.value = v }, size: 'lg', activeColor: 'bg-reward' }),
            ]),
          ])
        } }),
      },
      {
        name: 'Disabled state',
        snippet: `<AppToggle :model-value="true" :disabled="true" />
<AppToggle :model-value="false" :disabled="true" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex gap-4' }, [
            h(AppToggle, { modelValue: true, disabled: true }),
            h(AppToggle, { modelValue: false, disabled: true }),
          ])
        } }),
      },
    ],
  },

  // ── Checkbox ─────────────────────────────────────────────────────────────
  checkbox: {
    title: 'Checkbox',
    description: 'Form control for multi-selection or agreement acknowledgement. Supports indeterminate state for parent/child selection patterns.',
    whenToUse: [
      'Multi-select lists',
      'Agreeing to terms or policies',
      'Select-all parent with child checkboxes (use indeterminate)',
    ],
    whenNotTo: [
      "Don't use for binary settings with immediate effect — use AppToggle",
      'Avoid standalone use without a visible label',
    ],
    props: [
      { name: 'modelValue', type: 'Boolean | Array', default: 'false', description: 'Checked state (v-model)' },
      { name: 'indeterminate', type: 'Boolean', default: 'false', description: 'Shows a dash for partial selection' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents checking' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the checkbox' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppCheckbox v-model="agreed">Agree to terms and conditions</AppCheckbox>
<AppCheckbox v-model="digest">Send weekly digest</AppCheckbox>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppCheckbox, { modelValue: demoCheck1.value, 'onUpdate:modelValue': v => { demoCheck1.value = v } }, () => 'Agree to terms and conditions'),
            h(AppCheckbox, { modelValue: demoCheck2.value, 'onUpdate:modelValue': v => { demoCheck2.value = v } }, () => 'Send weekly digest'),
          ])
        } }),
      },
      {
        name: 'Indeterminate',
        description: 'Used for select-all patterns where only some children are selected.',
        snippet: `<AppCheckbox :model-value="true" :indeterminate="true">Partially selected</AppCheckbox>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppCheckbox, { modelValue: true, indeterminate: true }, () => 'Partially selected'),
          ])
        } }),
      },
      {
        name: 'Disabled states',
        snippet: `<AppCheckbox :model-value="false" :disabled="true">Disabled unchecked</AppCheckbox>
<AppCheckbox :model-value="true" :disabled="true">Disabled checked</AppCheckbox>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppCheckbox, { modelValue: false, disabled: true }, () => 'Disabled unchecked'),
            h(AppCheckbox, { modelValue: true, disabled: true }, () => 'Disabled checked'),
          ])
        } }),
      },
    ],
  },

  // ── Chip ─────────────────────────────────────────────────────────────────
  chip: {
    title: 'Chip',
    description: 'Pill-shaped label for tags, filters, and inline status indicators. More visually prominent than a Badge. Supports removable variant for tag inputs and count badges for filter chips.',
    whenToUse: [
      'Removable tags in tag inputs',
      'Filter chips that can be dismissed',
      'Inline category labels with more visual weight than a Badge',
      'Count of active filters applied',
    ],
    whenNotTo: [
      "Don't use as primary navigation — use tabs or segment controls",
      "Don't nest interactive chips inside other interactive elements",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Text content of the chip' },
      { name: 'variant', type: "'default' | 'brand' | 'success' | 'warning' | 'danger' | 'presales' | 'reward'", default: "'default'", description: 'Color variant' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the chip' },
      { name: 'removable', type: 'Boolean', default: 'false', description: 'Shows a × icon and emits @remove' },
      { name: 'dot', type: 'Boolean', default: 'false', description: 'Shows a colored dot before the label' },
      { name: 'count', type: 'Number', default: '—', description: 'Badge count shown after the label' },
    ],
    stories: [
      {
        name: 'Variants',
        snippet: `<AppChip label="Default" />
<AppChip label="Brand" variant="brand" />
<AppChip label="Success" variant="success" />
<AppChip label="Warning" variant="warning" />
<AppChip label="Danger" variant="danger" />
<AppChip label="Pre-Sales" variant="presales" />
<AppChip label="Reward" variant="reward" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppChip, { label: 'Default' }),
            h(AppChip, { label: 'Brand', variant: 'brand' }),
            h(AppChip, { label: 'Success', variant: 'success' }),
            h(AppChip, { label: 'Warning', variant: 'warning' }),
            h(AppChip, { label: 'Danger', variant: 'danger' }),
            h(AppChip, { label: 'Pre-Sales', variant: 'presales' }),
            h(AppChip, { label: 'Reward', variant: 'reward' }),
          ])
        } }),
      },
      {
        name: 'With dot',
        snippet: `<AppChip label="Active" variant="success" dot />
<AppChip label="Pending" variant="warning" dot />
<AppChip label="Pre-Sales" variant="presales" dot />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppChip, { label: 'Active', variant: 'success', dot: true }),
            h(AppChip, { label: 'Pending', variant: 'warning', dot: true }),
            h(AppChip, { label: 'Pre-Sales', variant: 'presales', dot: true }),
          ])
        } }),
      },
      {
        name: 'With count',
        snippet: `<AppChip label="Filters" variant="brand" :count="3" />
<AppChip label="Tags" :count="12" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppChip, { label: 'Filters', variant: 'brand', count: 3 }),
            h(AppChip, { label: 'Tags', count: 12 }),
          ])
        } }),
      },
      {
        name: 'Removable',
        description: 'Interactive chips that can be dismissed. Emits @remove on click.',
        snippet: `<AppChip
  v-for="tag in tags" :key="tag"
  :label="tag" variant="brand" removable
  @remove="removeTag(tag)"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            ...demoTags.value.map(tag =>
              h(AppChip, { label: tag, variant: 'brand', removable: true, onRemove: () => removeTag(tag) })
            ),
            demoTags.value.length === 0
              ? h('span', { class: 'text-xs text-subtle' }, 'All removed — refresh to reset')
              : null,
          ])
        } }),
      },
    ],
  },

  // ── Info Chip ────────────────────────────────────────────────────────────
  'info-chip': {
    title: 'Info Chip',
    description: 'Directional indicator chip for displaying ranked or trended data points. The arrow prefix communicates direction or trend.',
    whenToUse: [
      'Top signals, top vendors, trending metrics in directory/profile views',
      'Any data point that benefits from a directional context (↗ growing, ↘ declining)',
    ],
    whenNotTo: [
      "Don't use for actionable items — it's display only",
      "Don't use without meaningful direction context",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Display text' },
      { name: 'direction', type: "'up' | 'down' | 'right' | 'none'", default: "'none'", description: 'Arrow direction indicator' },
      { name: 'variant', type: "'default' | 'brand' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color variant' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the chip' },
    ],
    stories: [
      {
        name: 'Directions',
        description: 'Four direction values for different trend signals.',
        snippet: `<AppInfoChip label="Top signal: SALES · 153" direction="up" variant="brand" />
<AppInfoChip label="Trending down" direction="down" variant="danger" />
<AppInfoChip label="Stable" direction="right" variant="success" />
<AppInfoChip label="No change" direction="none" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppInfoChip, { label: 'Top signal: SALES · 153', direction: 'up', variant: 'brand' }),
            h(AppInfoChip, { label: 'Trending down', direction: 'down', variant: 'danger' }),
            h(AppInfoChip, { label: 'Stable', direction: 'right', variant: 'success' }),
            h(AppInfoChip, { label: 'No change', direction: 'none' }),
          ])
        } }),
      },
      {
        name: 'Variants',
        snippet: `<AppInfoChip label="Default" />
<AppInfoChip label="Brand" variant="brand" direction="up" />
<AppInfoChip label="Success" variant="success" direction="up" />
<AppInfoChip label="Warning" variant="warning" direction="down" />
<AppInfoChip label="Danger" variant="danger" direction="down" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppInfoChip, { label: 'Default' }),
            h(AppInfoChip, { label: 'Brand', variant: 'brand', direction: 'up' }),
            h(AppInfoChip, { label: 'Success', variant: 'success', direction: 'up' }),
            h(AppInfoChip, { label: 'Warning', variant: 'warning', direction: 'down' }),
            h(AppInfoChip, { label: 'Danger', variant: 'danger', direction: 'down' }),
          ])
        } }),
      },
    ],
  },

  // ── Segment Control ──────────────────────────────────────────────────────
  'segment-control': {
    title: 'Segment Control',
    description: 'Pill-group switcher for toggling between two or three views or filter scopes. Functionally similar to tabs but with a more compact, inline appearance.',
    whenToUse: [
      'My Activities / Team toggle in activity lists',
      'Overview / Detail scope switcher',
      'Any 2–3 option toggle where radio buttons would feel too heavy',
    ],
    whenNotTo: [
      "Don't use for more than 3–4 options — use AppViewTabs instead",
      "Don't use as navigation between pages — use router links",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: '—', description: 'Active segment value (v-model)' },
      { name: 'options', type: "Array<{ label: String, value: String, icon?: Component | String }>", default: '[]', description: 'Segment options. icon can be a heroicon component' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '36px or 44px height' },
      { name: 'aria-label', type: 'String', default: 'null', description: 'Accessible name for the tablist' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the control' },
    ],
    stories: [
      {
        name: 'Default',
        description: 'Interactive segment switcher.',
        snippet: `<AppSegmentControl
  v-model="activeView"
  :options="[
    { label: 'My Activities', value: 'mine' },
    { label: 'Team', value: 'team' },
    { label: 'All', value: 'all' },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-2' }, [
            h(AppSegmentControl, {
              modelValue: demoSegment.value,
              'onUpdate:modelValue': v => { demoSegment.value = v },
              options: [{ label: 'My Activities', value: 'mine' }, { label: 'Team', value: 'team' }, { label: 'All', value: 'all' }],
            }),
            h('p', { class: 'text-xs text-subtle' }, [
              'Selected: ',
              h('span', { class: 'font-mono text-brand' }, demoSegment.value),
            ]),
          ])
        } }),
      },
      {
        name: 'With icons',
        snippet: `<AppSegmentControl
  v-model="activeView"
  :options="[
    { label: 'Table', value: 'table', icon: TableCellsIcon },
    { label: 'Calendar', value: 'cal', icon: CalendarDaysIcon },
    { label: 'Kanban', value: 'board', icon: ViewColumnsIcon },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h(AppSegmentControl, {
            modelValue: demoSegment2.value,
            'onUpdate:modelValue': v => { demoSegment2.value = v },
            options: [{ label: 'Table', value: 'table', icon: TableCellsIcon }, { label: 'Calendar', value: 'cal', icon: CalendarDaysIcon }, { label: 'Kanban', value: 'board', icon: ViewColumnsIcon }],
          })
        } }),
      },
    ],
  },

  // ── View Tabs ────────────────────────────────────────────────────────────
  'view-tabs': {
    title: 'View Tabs',
    description: 'Underline tab bar for switching between content views within the same page — Table, Calendar, Kanban etc. Each tab can have an optional icon prefix.',
    whenToUse: [
      'Switching between different visual representations of the same data (Table / Calendar / Kanban)',
      'Section tabs within a page (Overview / Members / Settings)',
      'Any 3+ option view switcher',
    ],
    whenNotTo: [
      "Don't use for 2 options — AppSegmentControl is more compact",
      "Don't use for navigation between routes — use RouterLink with active state",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: '—', description: 'Active tab value (v-model)' },
      { name: 'tabs', type: "Array<{ label, value, icon?: Component, count?: Number, tone?: 'neutral' | 'brand' | 'warning' | 'danger' }>", default: '[]', description: 'Tab definitions. count shows a badge (e.g. failed syncs in warning)' },
      { name: 'id-prefix', type: 'String', default: "'tabs'", description: 'Prefix for tab/panel ids — pair with role="tabpanel" :id="`${prefix}-panel-${value}`"' },
      { name: 'aria-label', type: 'String', default: 'null', description: 'Accessible name for the tablist. Arrow keys / Home / End move between tabs' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppViewTabs
  v-model="activeTab"
  :tabs="[
    { label: 'Overview', value: 'overview' },
    { label: 'Pipeline', value: 'pipeline' },
    { label: 'Activity', value: 'activity' },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppViewTabs, {
              modelValue: demoTab.value,
              'onUpdate:modelValue': v => { demoTab.value = v },
              tabs: [{ label: 'Overview', value: 'overview' }, { label: 'Pipeline', value: 'pipeline' }, { label: 'Activity', value: 'activity' }],
            }),
            h('p', { class: 'text-xs text-subtle' }, [
              'Active: ',
              h('span', { class: 'font-mono text-brand' }, demoTab.value),
            ]),
          ])
        } }),
      },
      {
        name: 'With icons',
        snippet: `<AppViewTabs
  v-model="activeTab"
  :tabs="[
    { label: 'Overview', value: 'overview', icon: Squares2X2Icon },
    { label: 'Pipeline', value: 'pipeline', icon: BanknotesIcon, count: 4, tone: 'brand' },
    { label: 'Activity', value: 'activity', icon: BoltIcon, count: 8, tone: 'warning' },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h(AppViewTabs, {
            modelValue: demoTab.value,
            'onUpdate:modelValue': v => { demoTab.value = v },
            tabs: [{ label: 'Overview', value: 'overview', icon: Squares2X2Icon }, { label: 'Pipeline', value: 'pipeline', icon: BanknotesIcon, count: 4, tone: 'brand' }, { label: 'Activity', value: 'activity', icon: BoltIcon, count: 8, tone: 'warning' }],
          })
        } }),
      },
    ],
  },

  // ── Radio Card ───────────────────────────────────────────────────────────
  'radio-card': {
    title: 'Radio Card',
    description: 'Selectable card combining a visual icon square, title, description, and radio indicator. Used for prominent single-select choices where visual differentiation matters.',
    whenToUse: [
      'Single-select choice where options have distinct visual identity (Sales, Pre-Sales, Marketing)',
      'Onboarding flows where the user picks a category or type',
      'Any single-select where a regular radio group feels too plain',
    ],
    whenNotTo: [
      "Don't use for more than 5 options — a regular radio list is more scannable",
      "Don't use for binary choices — use AppToggle",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: '—', description: 'Selected value (v-model)' },
      { name: 'value', type: 'String', default: '—', description: 'Value this card represents' },
      { name: 'label', type: 'String', default: '—', description: 'Card title' },
      { name: 'description', type: 'String', default: '—', description: 'Supporting text beneath the title' },
      { name: 'color', type: "'brand' | 'presales' | 'success' | 'warning' | 'danger'", default: "'brand'", description: 'Color of the icon square' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents selection' },
    ],
    stories: [
      {
        name: 'Default',
        description: 'Interactive — click to select a card.',
        snippet: `<AppRadioCard
  v-model="selected"
  value="sales"
  label="Sales"
  description="Customer meetings, demos, closing"
  color="brand"
>
  <template #icon><BriefcaseIcon class="w-5 h-5" /></template>
</AppRadioCard>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3 max-w-md' }, [
            h(AppRadioCard, {
              modelValue: demoRadio.value, 'onUpdate:modelValue': v => { demoRadio.value = v },
              value: 'sales', label: 'Sales', description: 'Customer meetings, demos, closing', color: 'brand',
            }, { icon: () => h(BriefcaseIcon, { class: 'w-5 h-5' }) }),
            h(AppRadioCard, {
              modelValue: demoRadio.value, 'onUpdate:modelValue': v => { demoRadio.value = v },
              value: 'presales', label: 'Pre-Sales', description: 'Technical evaluations, POCs', color: 'presales',
            }, { icon: () => h(BeakerIcon, { class: 'w-5 h-5' }) }),
            h(AppRadioCard, {
              modelValue: demoRadio.value, 'onUpdate:modelValue': v => { demoRadio.value = v },
              value: 'marketing', label: 'Marketing', description: 'Events, content, campaigns', color: 'success',
            }, { icon: () => h(MegaphoneIcon, { class: 'w-5 h-5' }) }),
            h('p', { class: 'text-xs text-subtle mt-2' }, [
              'Selected: ',
              h('span', { class: 'font-mono text-brand' }, demoRadio.value),
            ]),
          ])
        } }),
      },
    ],
  },

  // ── Spinner ──────────────────────────────────────────────────────────────
  spinner: {
    title: 'Spinner',
    description: 'Animated loading indicator for async operations. Use inline in buttons, or as a page/section overlay for longer loads.',
    whenToUse: [
      "Inside buttons during async actions (use AppButton's loading prop instead where possible)",
      'Section-level loading state while data is being fetched',
      'Page-level loading before first paint',
    ],
    whenNotTo: [
      "Don't use for skeleton-replaced content — use AppSkeleton instead",
      'Avoid showing a spinner for operations under 300ms',
    ],
    props: [
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter of the spinner' },
      { name: 'color', type: "'brand' | 'subtle' | 'white'", default: "'brand'", description: 'Color of the spinning arc' },
      { name: 'label', type: 'String', default: '—', description: 'Accessible label for screen readers (visually hidden)' },
    ],
    stories: [
      {
        name: 'Sizes',
        snippet: `<AppSpinner size="xs" />
<AppSpinner size="sm" />
<AppSpinner size="md" />
<AppSpinner size="lg" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap items-center gap-8' }, [
            ...['xs','sm','md','lg'].map(s =>
              h('div', { class: 'flex flex-col items-center gap-2' }, [
                h(AppSpinner, { size: s }),
                h('span', { class: 'text-xs text-subtle font-mono' }, s),
              ])
            ),
          ])
        } }),
      },
      {
        name: 'Colors',
        snippet: `<AppSpinner color="brand" />
<AppSpinner color="subtle" />
<!-- white — use on colored backgrounds -->
<div class="bg-brand rounded-lg p-2">
  <AppSpinner color="white" />
</div>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap items-center gap-6' }, [
            h('div', { class: 'flex flex-col items-center gap-2' }, [
              h(AppSpinner, { color: 'brand' }),
              h('span', { class: 'text-xs text-subtle font-mono' }, 'brand'),
            ]),
            h('div', { class: 'flex flex-col items-center gap-2' }, [
              h(AppSpinner, { color: 'subtle' }),
              h('span', { class: 'text-xs text-subtle font-mono' }, 'subtle'),
            ]),
            h('div', { class: 'flex flex-col items-center gap-2' }, [
              h('div', { class: 'bg-brand rounded-lg p-2' }, h(AppSpinner, { color: 'white' })),
              h('span', { class: 'text-xs text-subtle font-mono' }, 'white'),
            ]),
          ])
        } }),
      },
    ],
  },

  // ── Skeleton ─────────────────────────────────────────────────────────────
  skeleton: {
    title: 'Skeleton',
    description: 'Content placeholder shown while data is loading. Reduces perceived load time by giving the user a preview of the content structure before data arrives.',
    whenToUse: [
      'List items, cards, and tables that are being fetched',
      'Any content area that has a predictable shape before data loads',
    ],
    whenNotTo: [
      "Don't use alongside spinners for the same content area — pick one",
      "Don't use for very short loading states (< 300ms)",
    ],
    props: [
      { name: 'variant', type: "'rect' | 'circle' | 'text' | 'card'", default: "'rect'", description: 'Shape of the skeleton' },
      { name: 'width', type: 'String', default: "'100%'", description: 'CSS width' },
      { name: 'height', type: 'String', default: "'1rem'", description: 'CSS height' },
      { name: 'lines', type: 'Number', default: '1', description: 'Number of lines (only for variant="text")' },
      { name: 'animate', type: 'Boolean', default: 'true', description: 'Whether to show pulse animation' },
    ],
    stories: [
      {
        name: 'Text lines',
        snippet: `<AppSkeleton variant="text" :lines="3" height="12px" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppSkeleton, { variant: 'text', lines: 3, height: '12px' }))
        } }),
      },
      {
        name: 'Rect',
        snippet: `<AppSkeleton height="48px" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppSkeleton, { height: '48px' }))
        } }),
      },
      {
        name: 'Circle',
        snippet: `<AppSkeleton variant="circle" width="40px" height="40px" />
<AppSkeleton variant="circle" width="56px" height="56px" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex gap-3 items-center' }, [
            h(AppSkeleton, { variant: 'circle', width: '40px', height: '40px' }),
            h(AppSkeleton, { variant: 'circle', width: '56px', height: '56px' }),
          ])
        } }),
      },
      {
        name: 'Card',
        snippet: `<AppSkeleton variant="card" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, h(AppSkeleton, { variant: 'card' }))
        } }),
      },
    ],
  },

  // ── Progress Bar ─────────────────────────────────────────────────────────
  progress: {
    title: 'Progress Bar',
    description: 'Linear progress bar for displaying a percentage value. Use for quota attainment, completion rates, or any 0–100% metric.',
    whenToUse: [
      'Quota attainment on vendor/partner cards',
      'Form completion progress',
      'Upload or processing progress',
    ],
    whenNotTo: [
      "Don't use for indefinite loading — use AppSpinner or AppSkeleton instead",
    ],
    props: [
      { name: 'value', type: 'Number', default: '0', description: 'Percentage value (0–100)' },
      { name: 'label', type: 'String', default: '—', description: 'Label shown above the bar' },
      { name: 'showValue', type: 'Boolean', default: 'false', description: 'Shows the numeric percentage after the label' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the progress track' },
      { name: 'color', type: "'brand' | 'success' | 'warning' | 'danger' | 'reward'", default: "'brand'", description: 'Color of the filled bar' },
    ],
    stories: [
      {
        name: 'With label and value',
        snippet: `<AppProgressBar :value="35" label="Week" :show-value="true" />
<AppProgressBar :value="98" label="Month" :show-value="true" color="warning" />
<AppProgressBar :value="67" label="Level 3" :show-value="true" color="reward" />
<AppProgressBar :value="100" label="Done" :show-value="true" color="success" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-4 max-w-md' }, [
            h(AppProgressBar, { value: 35, label: 'Week', showValue: true }),
            h(AppProgressBar, { value: 98, label: 'Month', showValue: true, color: 'warning' }),
            h(AppProgressBar, { value: 67, label: 'Level 3', showValue: true, color: 'reward' }),
            h(AppProgressBar, { value: 100, label: 'Done', showValue: true, color: 'success' }),
          ])
        } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppProgressBar :value="60" label="sm" size="sm" />
<AppProgressBar :value="60" label="md" size="md" />
<AppProgressBar :value="60" label="lg" size="lg" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-4 max-w-md' }, [
            h(AppProgressBar, { value: 60, label: 'sm', size: 'sm' }),
            h(AppProgressBar, { value: 60, label: 'md', size: 'md' }),
            h(AppProgressBar, { value: 60, label: 'lg', size: 'lg' }),
          ])
        } }),
      },
    ],
  },

  // ── Divider ──────────────────────────────────────────────────────────────
  divider: {
    title: 'Divider',
    description: 'Thin line separator for visual grouping. Horizontal by default, supports vertical for inline layouts. Optional centered label for section titles.',
    whenToUse: [
      'Separating sections within a card or form',
      'Dividing sidebar sections',
      "Inline divider between elements like 'or'",
    ],
    whenNotTo: [
      "Don't overuse — whitespace is often a better separator than a line",
    ],
    props: [
      { name: 'vertical', type: 'Boolean', default: 'false', description: 'Renders as a vertical line instead of horizontal' },
    ],
    stories: [
      {
        name: 'Horizontal',
        snippet: `<AppDivider />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppDivider))
        } }),
      },
      {
        name: 'With label',
        snippet: `<AppDivider>or continue with</AppDivider>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppDivider, null, () => 'or continue with'))
        } }),
      },
      {
        name: 'Vertical',
        snippet: `<div class="flex items-center h-8 gap-4">
  <span>Left</span>
  <AppDivider vertical />
  <span>Right</span>
</div>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex items-center h-8 gap-4' }, [
            h('span', { class: 'text-sm text-subtle' }, 'Left'),
            h(AppDivider, { vertical: true }),
            h('span', { class: 'text-sm text-subtle' }, 'Right'),
          ])
        } }),
      },
    ],
  },

  // ── Empty State ──────────────────────────────────────────────────────────
  'empty-state': {
    title: 'Empty State',
    description: 'Zero-state UI for empty lists, search results, or onboarding prompts. Includes icon, title, description, and optional action slot.',
    whenToUse: [
      'Empty activity lists or dashboards with no data yet',
      'Search returning 0 results',
      'Filtered views with no matching items',
    ],
    whenNotTo: [
      "Don't show an empty state during loading — show a skeleton instead",
    ],
    props: [
      { name: 'title', type: 'String', default: '—', description: 'Main heading text' },
      { name: 'description', type: 'String', default: '—', description: 'Supporting detail text' },
      { name: 'compact', type: 'Boolean', default: 'false', description: 'Reduces padding for use inside cards or sidebars' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppEmptyState
  title="No activities yet"
  description="Log your first activity to start tracking."
>
  <template #action>
    <AppButton variant="primary" size="sm">Log Activity</AppButton>
  </template>
</AppEmptyState>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'rounded-2xl border border-line' },
            h(AppEmptyState, { title: 'No activities yet', description: 'Log your first activity to start tracking.' }, {
              action: () => h(AppButton, { variant: 'primary', size: 'sm' }, () => 'Log Activity'),
            })
          )
        } }),
      },
      {
        name: 'Compact',
        description: 'Reduced padding for use inside cards or narrow panels.',
        snippet: `<AppEmptyState
  title="No vendor data"
  description="Activities with vendor links appear here."
  compact
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'rounded-2xl border border-line' },
            h(AppEmptyState, { title: 'No vendor data', description: 'Activities with vendor links appear here.', compact: true })
          )
        } }),
      },
    ],
  },

  // ── Form Field ───────────────────────────────────────────────────────────
  'form-field': {
    title: 'Form Field',
    description: 'Wrapper molecule that pairs a label, hint, and error message with any form input. Ensures consistent label/error spacing and wires for accessibility automatically.',
    whenToUse: [
      'Wrapping every form input that needs a label',
      'Any field that can have an error message or helper text',
    ],
    whenNotTo: [
      "Don't use without an input inside — it's a wrapper, not a standalone element",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Label text displayed above the input' },
      { name: 'hint', type: 'String', default: '—', description: 'Small annotation shown inline with the label (e.g. "Required")' },
      { name: 'helper', type: 'String', default: '—', description: 'Helper text shown below the input' },
      { name: 'error', type: 'String', default: '—', description: 'Error message shown below the input in danger color' },
      { name: 'required', type: 'Boolean', default: 'false', description: 'Shows a * indicator on the label' },
      { name: 'fullWidth', type: 'Boolean', default: 'true', description: 'Makes the field take full container width' },
      { name: 'inputId', type: 'String', default: '—', description: 'ID wired to the label for accessibility' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppFormField label="Vendor name" helper="The vendor you met with">
  <AppInput v-model="vendor" placeholder="e.g. CrowdStrike" />
</AppFormField>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' },
            h(AppFormField, { label: 'Vendor name', helper: 'The vendor you met with' }, {
              default: () => h(AppInput, { modelValue: demoFormInput.value, 'onUpdate:modelValue': v => { demoFormInput.value = v }, placeholder: 'e.g. CrowdStrike' }),
            })
          )
        } }),
      },
      {
        name: 'Required field',
        snippet: `<AppFormField label="Activity type" required hint="Required">
  <AppSelect v-model="type" :options="options" placeholder="Select…" />
</AppFormField>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' },
            h(AppFormField, { label: 'Activity type', required: true, hint: 'Required' }, {
              default: () => h(AppSelect, { modelValue: demoFormSelect.value, 'onUpdate:modelValue': v => { demoFormSelect.value = v }, options: ['Sales','Pre-Sales','Marketing'], placeholder: 'Select…' }),
            })
          )
        } }),
      },
      {
        name: 'With error',
        snippet: `<AppFormField label="Notes" error="At least 20 characters required">
  <AppInput v-model="notes" placeholder="Describe the activity…" :error="true" />
</AppFormField>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' },
            h(AppFormField, { label: 'Notes', error: 'At least 20 characters required' }, {
              default: () => h(AppInput, { modelValue: demoFormInput.value, 'onUpdate:modelValue': v => { demoFormInput.value = v }, placeholder: 'Describe the activity…', error: true }),
            })
          )
        } }),
      },
    ],
  },

  // ── Color tokens ─────────────────────────────────────────────────────────
  colors: {
    title: 'Color Tokens',
    description: 'Semantic, theme-aware palette. Tokens are RGB channels in CSS variables (src/assets/main.css) mapped in tailwind.config.js, so one class works in light and dark mode and still supports opacity modifiers (bg-brand/10). Rule of thumb: cyan is action, gold is reward.',
    whenToUse: [
      'Use bg-page / bg-surface-1/2/3 / border-line for every background and border',
      'Use text-fg, text-fg-2 and text-fg-muted for text hierarchy',
      'Use brand for interactive elements — CTAs, active states, focus rings, links',
      'Use reward (gold) only for points, levels, XP and bonuses',
      'Use podium-gold/silver/bronze only for rank 1/2/3',
    ],
    whenNotTo: [
      "Don't write light/dark pairs (bg-surface-1) in new code — the semantic token already switches",
      "Don't use gold for anything that isn't a reward — it loses meaning",
      "Don't add raw hex in templates — add a variable in main.css and a token in tailwind.config.js",
    ],
    stories: [
      {
        name: 'Surfaces & text',
        description: 'Layered surfaces, never pure black. Switch the theme to see both sets.',
        snippet: `<div class="bg-page">                 <!-- page -->
  <div class="bg-surface-1 border border-line rounded-card">   <!-- card -->
    <div class="bg-surface-2">          <!-- row / control inside a card -->
      <p class="text-fg">Primary</p>
      <p class="text-fg-2">Secondary</p>
      <p class="text-fg-muted">Meta</p>`,
        demo: defineComponent({ setup() {
          const tokens = [
            { cls: 'bg-page', name: 'page', use: 'Page background' },
            { cls: 'bg-surface-1', name: 'surface-1', use: 'Cards, panels' },
            { cls: 'bg-surface-2', name: 'surface-2', use: 'Rows, controls' },
            { cls: 'bg-surface-3', name: 'surface-3', use: 'Hover, active segment' },
            { cls: 'bg-line', name: 'line', use: 'Borders, dividers' },
          ]
          return () => h('div', { class: 'space-y-5' }, [
            h('div', { class: 'grid grid-cols-2 sm:grid-cols-5 gap-3' }, tokens.map(t =>
              h('div', { class: 'rounded-xl overflow-hidden border border-line' }, [
                h('div', { class: 'h-12 ' + t.cls }),
                h('div', { class: 'p-3 bg-surface-1' }, [
                  h('p', { class: 'text-xs font-bold font-mono' }, t.name),
                  h('p', { class: 'text-xs text-fg-muted mt-0.5' }, t.use),
                ]),
              ])
            )),
            h('div', { class: 'flex flex-wrap gap-6' }, [
              h('p', { class: 'text-fg font-bold' }, 'text-fg — primary'),
              h('p', { class: 'text-fg-2' }, 'text-fg-2 — secondary'),
              h('p', { class: 'text-fg-muted' }, 'text-fg-muted — meta'),
            ]),
          ])
        } }),
      },
      {
        name: 'Accents',
        description: 'Two accents only. Status and category colors stay strict — each means one thing.',
        snippet: `bg-brand text-brand-on          /* action — CTA fill + its text */
text-brand  hover:text-brand-hover  /* links */
bg-reward-fill text-reward-on   /* reward fill — Claim bonus, XP bar */
text-reward                     /* gold text — points */
bg-podium-gold | -silver | -bronze  /* rank 1/2/3 only */
success · warning · danger      /* status */
sales · presales · marketing    /* activity categories */`,
        demo: defineComponent({ setup() {
          const tokens = [
            { cls: 'bg-brand', name: 'brand', use: 'Action, focus' },
            { cls: 'bg-reward-fill', name: 'reward', use: 'Points, XP, bonus' },
            { cls: 'bg-podium-gold', name: 'podium-gold', use: 'Rank 1' },
            { cls: 'bg-podium-silver', name: 'podium-silver', use: 'Rank 2' },
            { cls: 'bg-podium-bronze', name: 'podium-bronze', use: 'Rank 3' },
            { cls: 'bg-success', name: 'success', use: 'Completed, live' },
            { cls: 'bg-warning', name: 'warning', use: 'Caution' },
            { cls: 'bg-danger', name: 'danger', use: 'Errors, destructive' },
            { cls: 'bg-presales', name: 'presales', use: 'Pre-Sales' },
          ]
          return () => h('div', { class: 'grid grid-cols-2 sm:grid-cols-3 gap-3' }, tokens.map(t =>
            h('div', { class: 'rounded-xl overflow-hidden border border-line' }, [
              h('div', { class: 'h-12 ' + t.cls }),
              h('div', { class: 'p-3 bg-surface-1' }, [
                h('p', { class: 'text-xs font-bold font-mono' }, t.name),
                h('p', { class: 'text-xs text-fg-muted mt-0.5' }, t.use),
              ]),
            ])
          ))
        } }),
      },
      {
        name: 'Record types & companies',
        description: 'Each record type and company kind has one colour + icon, used for badges, chips, calendar events and pickers. Defined once in src/utils/activity.js (RECORD_STYLE, COMPANY_STYLE).',
        snippet: `import { RECORD_STYLE, COMPANY_STYLE } from '@/utils/activity'

RECORD_STYLE['Pre-Sales'].soft   // 'bg-presales/15 text-presales'
RECORD_STYLE.Sales.icon          // ArrowTrendingUpIcon
COMPANY_STYLE.reseller.soft      // 'bg-brand/15 text-brand'

// AppCombobox chips use the same colours: tone="vendor" | "reseller" | "endUser"`,
        demo: defineComponent({ setup() {
          const rec = Object.entries(RECORD_STYLE)
          const comp = [['Vendor', COMPANY_STYLE.vendor], ['Reseller', COMPANY_STYLE.reseller], ['End user', COMPANY_STYLE.endUser]]
          const tile = ([name, st]) => h('div', { class: 'flex items-center gap-3 rounded-xl border border-line bg-surface-1 p-3' }, [
            h('span', { class: 'w-10 h-10 rounded-xl flex items-center justify-center ' + st.soft }, h(st.icon, { class: 'w-5 h-5' })),
            h('div', [h('p', { class: 'text-sm font-extrabold' }, name), h('p', { class: 'text-xs font-mono text-fg-muted' }, st.soft)]),
          ])
          return () => h('div', { class: 'space-y-4' }, [
            h('p', { class: 'text-overline text-fg-muted' }, 'Record types'),
            h('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-3' }, rec.map(tile)),
            h('p', { class: 'text-overline text-fg-muted' }, 'Company kinds'),
            h('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-3' }, comp.map(tile)),
          ])
        } }),
      },
    ],
  },

  // ── Typography ───────────────────────────────────────────────────────────
  typography: {
    title: 'Typography',
    description: 'Three self-hosted variable fonts (@fontsource-variable), each with one job. Unbounded (font-display) carries the game energy in headings and big numbers, Manrope (font-sans, default) carries readability in UI and tables, JetBrains Mono (font-mono) carries time — countdowns, periods, IDs. All three cover Latin Extended.',
    whenToUse: [
      'font-display for page titles, section titles and large numbers (points, KPIs)',
      'Default font-sans for everything else — body, tables, forms, buttons',
      'font-mono for countdowns, "3d left", IDs and code',
      'text-overline (12px, uppercase, tracked) for labels above metrics',
      'Add .tabular to numbers that line up in columns',
    ],
    whenNotTo: [
      "Don't use font-display for body text or anything below 18px",
      "Don't go below 12px for text — text-xs (10px) is deprecated for labels",
      "Don't use emoji as icons — use heroicons",
    ],
    stories: [
      {
        name: 'Type Scale',
        description: 'Display for hierarchy, sans for reading, mono for time.',
        snippet: `<h1 class="font-display font-bold text-[34px] tracking-tight">Good morning, Nikola</h1>
<h2 class="font-display font-bold text-[22px]">Weekly race</h2>
<h3 class="font-display font-semibold text-xl">Recent activity</h3>
<p class="text-base text-fg-2">Body copy</p>
<p class="text-overline text-fg-2">Pipeline generated</p>
<p class="font-display font-bold text-num-lg tabular">£22,000</p>
<p class="font-mono font-bold">03d 14h</p>`,
        demo: defineComponent({ setup() {
          const scale = [
            { cls: 'font-display font-bold text-[34px] tracking-tight', label: 'display · 34 / 700', sample: 'Good morning' },
            { cls: 'font-display font-bold text-[22px]', label: 'display · 22 / 700', sample: 'Weekly race' },
            { cls: 'font-display font-semibold text-xl', label: 'display · 20 / 600', sample: 'Recent activity' },
            { cls: 'text-lg font-extrabold', label: 'sans · 18 / 800', sample: 'Wolfgang Hohenthanner' },
            { cls: 'text-base text-fg-2', label: 'sans · 16 / 500', sample: 'Log a Sales activity before Sunday' },
            { cls: 'text-sm text-fg-2', label: 'sans · 14 / 500', sample: 'Sales · 2026-09-25 · CrowdStrike' },
            { cls: 'text-overline text-fg-2', label: 'text-overline · 12', sample: 'Pipeline generated' },
            { cls: 'font-display font-bold text-num-lg tabular', label: 'text-num-lg · 40', sample: '£22,000' },
            { cls: 'font-mono font-bold text-[15px] text-brand', label: 'mono · 15 / 700', sample: '03d 14h 22m' },
          ]
          return () => h('div', { class: 'space-y-3' },
            scale.map(t =>
              h('div', { class: 'flex items-baseline gap-4 py-1 border-b border-line last:border-0' }, [
                h('span', { class: 'text-xs text-fg-muted font-mono w-44 flex-shrink-0' }, t.label),
                h('p', { class: t.cls + ' truncate' }, t.sample),
              ])
            )
          )
        } }),
      },
      {
        name: 'Setup',
        description: 'Fonts are npm packages, imported once in main.js — no render-blocking @import.',
        snippet: `// main.js
import '@fontsource-variable/unbounded'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'

// tailwind.config.js
fontFamily: {
  display: ['"Unbounded Variable"', 'sans-serif'],
  sans:    ['"Manrope Variable"', 'system-ui', 'sans-serif'],
  mono:    ['"JetBrains Mono Variable"', 'monospace'],
}`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }, [
            h('div', { class: 'rounded-xl bg-surface-2 p-4' }, [h('p', { class: 'font-display font-bold text-3xl' }, 'Aa'), h('p', { class: 'text-sm text-fg-2 mt-2' }, 'Unbounded · font-display')]),
            h('div', { class: 'rounded-xl bg-surface-2 p-4' }, [h('p', { class: 'font-bold text-3xl' }, 'Aa'), h('p', { class: 'text-sm text-fg-2 mt-2' }, 'Manrope · font-sans')]),
            h('div', { class: 'rounded-xl bg-surface-2 p-4' }, [h('p', { class: 'font-mono font-bold text-3xl' }, 'Aa'), h('p', { class: 'text-sm text-fg-2 mt-2' }, 'JetBrains Mono · font-mono')]),
          ])
        } }),
      },
    ],
  },

  // ── Spacing ──────────────────────────────────────────────────────────────
  spacing: {
    title: 'Spacing Scale',
    description: 'Based on Tailwind\'s 4px grid (1 unit = 4px). The scale is intentionally constrained — using the prescribed stops keeps visual rhythm consistent across the entire UI. Gap and margin values follow the same scale.',
    whenToUse: [
      'Use p-5 (20px) as the default card padding',
      'Use p-6 (24px) for large form sections and page-level sections',
      'Use gap-3 (12px) for dense grids, gap-4 (16px) for standard grids',
      'Use mb-8 (32px) between major page sections',
      'Use gap-2 (8px) for icon-to-label spacing in buttons and chips',
    ],
    whenNotTo: [
      "Don't use arbitrary pixel values like p-[18px] — round to the nearest scale stop",
      "Don't use spacing tokens outside the defined stops (p-7, p-9 etc.) without design review",
    ],
    stories: [
      {
        name: 'Space Scale Reference',
        description: 'Visual reference for key spacing stops used across components.',
        snippet: `/* Key spacing stops */
p-1   → 4px   icon internal padding
p-2   → 8px   badge/chip padding
p-3   → 12px  button sm, dense lists
p-4   → 16px  button md, standard padding
p-5   → 20px  card default padding
p-6   → 24px  large sections, forms
gap-2 → 8px   icon-to-label gap
gap-3 → 12px  dense grid gap
gap-4 → 16px  standard grid gap
gap-6 → 24px  section gap
mb-8  → 32px  between page sections`,
        demo: defineComponent({ setup() {
          const stops = [
            { token: 'p-1',   px: 4,  usage: 'Icon internal padding' },
            { token: 'p-2',   px: 8,  usage: 'Badge / chip padding' },
            { token: 'p-3',   px: 12, usage: 'Button sm, dense lists' },
            { token: 'p-4',   px: 16, usage: 'Button md, standard padding' },
            { token: 'p-5',   px: 20, usage: 'Card default padding' },
            { token: 'p-6',   px: 24, usage: 'Large sections, forms' },
            { token: 'gap-2', px: 8,  usage: 'Icon → label gap' },
            { token: 'gap-3', px: 12, usage: 'Dense grid gap' },
            { token: 'gap-4', px: 16, usage: 'Standard grid gap' },
            { token: 'gap-6', px: 24, usage: 'Section gap' },
            { token: 'mb-8',  px: 32, usage: 'Between page sections' },
          ]
          return () => h('div', { class: 'space-y-2.5' },
            stops.map(s =>
              h('div', { class: 'flex items-center gap-4' }, [
                h('span', { class: 'text-xs font-mono text-subtle w-16 flex-shrink-0' }, s.token),
                h('div', {
                  class: 'bg-brand/40 rounded flex-shrink-0',
                  style: `width:${s.px}px;height:14px`
                }),
                h('span', { class: 'text-xs text-subtle' }, `${s.px}px — ${s.usage}`),
              ])
            )
          )
        } }),
      },
    ],
  },


  // ── Stat Card ────────────────────────────────────────────────────────────
  'stat-card': {
    title: 'Stat Card',
    description: 'A single KPI: label, big display-font value, optional sub-label and extra content (e.g. an XP bar) in the default slot. The reward tone turns the card gold — use it only for points.',
    whenToUse: [
      'KPI rows (Activities, Pipeline, Total points)',
      'One number that answers one question',
    ],
    whenNotTo: [
      "Don't put more than one number in a card",
      "Don't use tone=\"reward\" for anything that isn't points or levels",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Overline label (required)' },
      { name: 'value', type: 'String | Number', default: 'null', description: 'Main value. null / empty shows a muted dash. Words get a smaller size automatically' },
      { name: 'sublabel', type: 'String', default: 'null', description: 'Muted line under the value' },
      { name: 'icon', type: 'Component', default: 'null', description: 'Heroicon shown top-right' },
      { name: 'tone', type: "'default' | 'reward'", default: "'default'", description: 'Reward = gold card for points' },
    ],
    stories: [
      {
        name: 'Default and reward',
        description: 'Numbers, words, empty values and a reward card with an XP bar in the slot.',
        snippet: `<StatCard label="Activities" :value="35" sublabel="This week" />
<StatCard label="Top activity type" value="Pre-Sales" sublabel="This week" />
<StatCard label="Pipeline generated" :value="null" sublabel="Shows once you log activities" />
<StatCard label="Total points" tone="reward" value="710">
  <AppXpBar :level="3" :value="53" :show-labels="false" size="sm" />
</StatCard>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4' }, [
          h(StatCard, { label: 'Activities', value: 35, sublabel: 'This week' }),
          h(StatCard, { label: 'Top activity type', value: 'Pre-Sales', sublabel: 'This week' }),
          h(StatCard, { label: 'Pipeline generated', value: null, sublabel: 'Shows once you log activities' }),
          h(StatCard, { label: 'Total points', tone: 'reward', value: '710' }, () => h(AppXpBar, { level: 3, value: 53, showLabels: false, size: 'sm' })),
        ]) } }),
      },
    ],
  },

  // ── Period Tabs ──────────────────────────────────────────────────────────
  'period-tabs': {
    title: 'Period Tabs',
    description: 'Period switcher that doubles as a progress indicator. Each tab shows its label, a meta string ("3d left") and a bar for how much of the period has elapsed — it replaces separate "period progress" bars. Supports arrow-key navigation (WAI-ARIA tabs).',
    whenToUse: [
      'Switching the time window of a whole section (race, KPIs)',
      'When the time remaining in each option matters to the user',
    ],
    whenNotTo: [
      "Don't use for non-time options — use Segment Control",
      "Don't use for page-level navigation — use View Tabs",
    ],
    props: [
      { name: 'v-model', type: 'String', default: '—', description: 'Selected tab value' },
      { name: 'tabs', type: 'Array<{ value, label, labelShort?, meta?, metaShort?, progress? }>', default: '—', description: 'progress is 0–100 elapsed. *Short variants are used below the sm breakpoint' },
      { name: 'aria-label', type: 'String', default: "'Period'", description: 'Accessible name of the tablist' },
    ],
    stories: [
      {
        name: 'Race periods',
        description: 'Fed from useRaceStore().periods in the app.',
        snippet: `<AppPeriodTabs
  v-model="period"
  aria-label="Race period"
  :tabs="[
    { value: 'week',    label: 'Week',    meta: '3d left',  metaShort: '3d',  progress: 55 },
    { value: 'month',   label: 'Month',   meta: '30d left', metaShort: '30d', progress: 3 },
    { value: 'quarter', label: 'Quarter', labelShort: 'Qtr', meta: '91d left', metaShort: '91d', progress: 1 },
    { value: 'year',    label: 'Year',    meta: '91d left', metaShort: '91d', progress: 75 },
  ]"
/>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'space-y-3' }, [
          h(AppPeriodTabs, {
            modelValue: demoPeriod.value,
            'onUpdate:modelValue': (v) => { demoPeriod.value = v },
            ariaLabel: 'Race period',
            tabs: [
              { value: 'week', label: 'Week', meta: '3d left', metaShort: '3d', progress: 55 },
              { value: 'month', label: 'Month', meta: '30d left', metaShort: '30d', progress: 3 },
              { value: 'quarter', label: 'Quarter', labelShort: 'Qtr', meta: '91d left', metaShort: '91d', progress: 1 },
              { value: 'year', label: 'Year', meta: '91d left', metaShort: '91d', progress: 75 },
            ],
          }),
          h('p', { class: 'text-sm text-fg-2' }, `Selected: ${demoPeriod.value}`),
        ]) } }),
      },
    ],
  },

  // ── Countdown ────────────────────────────────────────────────────────────
  countdown: {
    title: 'Countdown',
    description: 'Live countdown in mono tiles. Ticks every second when seconds are shown, otherwise every 30 seconds. Exposed to assistive tech as role="timer" with a readable label.',
    whenToUse: [
      'Time left in a race, promotion or bonus window',
    ],
    whenNotTo: [
      "Don't use for durations that already passed — show a date instead",
      "Don't show seconds unless the page is about the deadline (Race page yes, Metrics no)",
    ],
    props: [
      { name: 'to', type: 'Date | String | Number', default: '—', description: 'Target moment' },
      { name: 'units', type: "Array<'days'|'hours'|'minutes'|'seconds'>", default: "['days','hours','minutes']", description: 'Units to show, in order' },
      { name: 'label', type: 'String', default: 'null', description: 'Overline above the tiles' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '52px or 60px tiles' },
      { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Alignment of label + tiles' },
    ],
    stories: [
      {
        name: 'Sizes',
        description: 'sm in compact headers, md with seconds on the Race page.',
        snippet: `<AppCountdown :to="race.current.end" label="Ends in" size="sm" />
<AppCountdown :to="race.current.end" :units="['days','hours','minutes','seconds']" label="Race ends in" />`,
        demo: defineComponent({ setup() {
          const to = Date.now() + 3 * 86_400_000 + 14 * 3_600_000 + 22 * 60_000
          return () => h('div', { class: 'flex flex-wrap items-end gap-8' }, [
            h(AppCountdown, { to, label: 'Ends in', size: 'sm' }),
            h(AppCountdown, { to, label: 'Race ends in', units: ['days', 'hours', 'minutes', 'seconds'] }),
          ])
        } }),
      },
    ],
  },

  // ── XP Bar ───────────────────────────────────────────────────────────────
  'xp-bar': {
    title: 'XP Bar',
    description: 'Level progress in gold. Always feed it from auth.levelInfo (getLevelInfo in useAuthStore) — the single source of truth for level, percentage and points to the next level.',
    whenToUse: [
      'Progress inside the current level — topbar, KPI card, profile, race page',
    ],
    whenNotTo: [
      "Don't use for non-reward progress (quota, upload) — use Progress Bar",
      "Don't compute level or % in a component — read auth.levelInfo",
    ],
    props: [
      { name: 'level', type: 'Number', default: '—', description: 'Current level' },
      { name: 'value', type: 'Number', default: '—', description: '0–100 progress inside the level' },
      { name: 'current', type: 'Number', default: '0', description: 'Lifetime points (label)' },
      { name: 'max', type: 'Number', default: '0', description: 'Points needed for next level (label)' },
      { name: 'show-labels', type: 'Boolean', default: 'true', description: 'Level + "x / y XP" row' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Bar height' },
    ],
    stories: [
      {
        name: 'With and without labels',
        description: 'Default slot renders under the bar.',
        snippet: `<AppXpBar :level="info.level" :value="info.pct" :current="info.points" :max="info.levelEnd">
  <p class="text-[13px] text-reward/80">{{ info.toNext }} XP to Level {{ info.nextLevel }}</p>
</AppXpBar>
<AppXpBar :level="3" :value="53" :show-labels="false" size="sm" />`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'space-y-6 max-w-sm' }, [
          h(AppXpBar, { level: 3, value: 53, current: 710, max: 900 }, () => h('p', { class: 'text-[13px] text-reward/80' }, '190 XP to Level 4')),
          h(AppXpBar, { level: 3, value: 53, showLabels: false, size: 'sm' }),
        ]) } }),
      },
    ],
  },

  // ── Reward Box ───────────────────────────────────────────────────────────
  'reward-box': {
    title: 'Reward Box',
    description: 'Animated daily-bonus box. While a reward is waiting it periodically wiggles, pulses a gold glow, sweeps a shimmer and pings its dot. Clicking it bursts particles and a floating "+N", then settles into the claimed state. All motion is turned off under prefers-reduced-motion.',
    whenToUse: [
      'A reward the user can claim right now (daily bonus)',
      'Exactly one animated box per screen — pass :animate="false" to any other instance',
    ],
    whenNotTo: [
      "Don't use for regular notifications — it's only for claimable rewards",
      "Don't animate more than one reward box at a time",
    ],
    props: [
      { name: 'available', type: 'Boolean', default: 'true', description: 'Reward ready to claim. false shows the claimed state' },
      { name: 'points', type: 'Number', default: '50', description: 'Shown in the burst and labels' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '36px or 44px' },
      { name: 'animate', type: 'Boolean', default: 'true', description: 'Idle attention animation' },
      { name: 'dot', type: 'Boolean', default: 'true', description: 'Pink notification dot' },
      { name: 'popover', type: 'Boolean', default: 'true', description: 'Styled hover / focus popover with points and time until the daily reset' },
      { name: 'placement', type: "'bottom' | 'right'", default: "'bottom'", description: 'Popover side — right for the sidebar rail. Bottom left-aligns on phones' },
      { name: '@claim', type: 'Event', default: '—', description: 'Fired on click while available' },
    ],
    stories: [
      {
        name: 'States',
        description: 'Click the first box to see the claim burst. It resets after 2 seconds in this demo.',
        snippet: `<AppRewardBox
  :available="auth.dailyBonusAvailable"
  :points="auth.dailyBonusPoints"
  @claim="auth.claimDailyBonus()"
/>
<AppRewardBox size="sm" :animate="false" :dot="false" />
<AppRewardBox :available="false" />`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex items-center gap-8 pt-6' }, [
          h(AppRewardBox, { available: demoReward.value, points: 50, onClaim: () => { demoReward.value = false; setTimeout(() => { demoReward.value = true }, 2000) } }),
          h(AppRewardBox, { size: 'sm', animate: false, dot: false }),
          h(AppRewardBox, { available: false }),
        ]) } }),
      },
    ],
  },

  // ── Textarea ─────────────────────────────────────────────────────────────
  textarea: {
    title: 'Textarea',
    description: 'Multi-line text field with the same look, focus ring and error state as Input. Wrap it in Form Field for a label.',
    whenToUse: ['Descriptions, next steps, support messages — anything longer than one line'],
    whenNotTo: ["Don't use for single-line values — use Input"],
    props: [
      { name: 'v-model', type: 'String', default: "''", description: 'Value' },
      { name: 'rows', type: 'Number', default: '4', description: 'Visible lines' },
      { name: 'placeholder', type: 'String', default: "''", description: 'Placeholder text' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Danger border + ring' },
      { name: 'resize', type: 'Boolean', default: 'false', description: 'Allow vertical resize' },
    ],
    stories: [
      {
        name: 'In a form field',
        description: 'Label wiring via input-id.',
        snippet: `<AppFormField label="Description" input-id="desc" required>
  <AppTextarea id="desc" v-model="body" placeholder="Describe the activity…" />
</AppFormField>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'max-w-md' },
          h(AppFormField, { label: 'Description', inputId: 'ds-desc', required: true }, {
            default: () => h(AppTextarea, { id: 'ds-desc', modelValue: demoTextarea.value, 'onUpdate:modelValue': (v) => { demoTextarea.value = v }, placeholder: 'Describe the activity…' }),
          })
        ) } }),
      },
    ],
  },

  // ── Combobox ─────────────────────────────────────────────────────────────
  combobox: {
    title: 'Combobox',
    description: 'Searchable picker for one or many values (companies, opportunities). Keyboard: ↑ ↓ to move, Enter to pick, Esc to close. Rule: a single-select shows its value INSIDE the field with Change and ×, so it never looks like more can be added. Multi-select keeps the search field and lists values as chips below.',
    whenToUse: [
      'Picking from a long list where typing is faster than scrolling (vendors, resellers, end users)',
      'multiple for fields that accept several values (Vendors, End users)',
    ],
    whenNotTo: [
      "Don't use for fewer than ~8 fixed options — use Select or Segment Control",
      "Don't show a single-select's value as a chip under an empty search — users will try to add a second one",
    ],
    props: [
      { name: 'v-model', type: 'String | null (single) · Array (multiple)', default: 'null', description: 'Selected value(s)' },
      { name: 'options', type: 'Array<{ value, label, meta? }>', default: '—', description: 'Filtered client-side by label. meta is a muted second line' },
      { name: 'multiple', type: 'Boolean', default: 'false', description: 'Allow several values, shown as chips' },
      { name: 'min-chars', type: 'Number', default: '0', description: 'Characters before results show (companies use 3)' },
      { name: 'tone', type: "'vendor' | 'reseller' | 'endUser' | 'neutral'", default: "'neutral'", description: 'Chip colour — matches the company kind' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Danger border' },
      { name: 'input-id', type: 'String', default: 'auto', description: 'Pass the same id to Form Field for the label' },
    ],
    stories: [
      {
        name: 'Single vs multiple',
        description: 'Reseller accepts one, Vendors accepts many — the difference is visible before anyone tries.',
        snippet: `<AppCombobox v-model="reseller" :options="resellers" tone="reseller" placeholder="Search resellers…" />
<AppCombobox v-model="vendors" :options="vendors" multiple tone="vendor" placeholder="Search vendors…" />`,
        demo: defineComponent({ setup() {
          const opts = (list) => list.map((label) => ({ value: label, label }))
          const resellers = opts(['Softcat plc', 'Bechtle Ltd', 'Computacenter', 'Bytes Software Services'])
          const vendors = opts(['CrowdStrike', 'Abnormal AI', 'Mimecast', 'SailPoint', 'Netskope'])
          return () => h('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl' }, [
            h(AppFormField, { label: 'Reseller', inputId: 'ds-cb-1', helper: 'Single select' }, { default: () => h(AppCombobox, { inputId: 'ds-cb-1', options: resellers, tone: 'reseller', placeholder: 'Search resellers…', modelValue: demoComboSingle.value, 'onUpdate:modelValue': (v) => { demoComboSingle.value = v } }) }),
            h(AppFormField, { label: 'Vendors', inputId: 'ds-cb-2', helper: 'Multiple' }, { default: () => h(AppCombobox, { inputId: 'ds-cb-2', options: vendors, multiple: true, tone: 'vendor', placeholder: 'Search vendors…', modelValue: demoComboMulti.value, 'onUpdate:modelValue': (v) => { demoComboMulti.value = v } }) }),
          ])
        } }),
      },
    ],
  },

  // ── Modal ────────────────────────────────────────────────────────────────
  modal: {
    title: 'Modal',
    description: 'Centered dialog for focused tasks (Log activity). Moves focus in on open and back to the trigger on close, closes on Esc and backdrop. Header, body and footer are separate so long forms scroll while actions stay visible.',
    whenToUse: ['A task the user must finish or cancel before continuing — creating an activity'],
    whenNotTo: [
      "Don't use for reading details — use Drawer so the list stays in context",
      "Don't stack modals — open a Drawer from a modal for secondary forms (New reseller)",
    ],
    props: [
      { name: 'v-model', type: 'Boolean', default: 'false', description: 'Open state' },
      { name: 'title', type: 'String', default: "''", description: 'Header title (or use #header)' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Max width 448 / 576 / 768 / 1024px' },
      { name: 'close-on-backdrop', type: 'Boolean', default: 'true', description: 'Turn off while the form is dirty' },
      { name: '#header / #default / #footer', type: 'Slots', default: '—', description: 'Footer stays pinned while the body scrolls' },
    ],
    stories: [
      {
        name: 'Basic',
        description: 'Title, body and footer actions.',
        snippet: `<AppModal v-model="open" title="Discard changes?" size="sm">
  Your activity hasn't been saved.
  <template #footer>
    <AppButton variant="ghost" @click="open = false">Keep editing</AppButton>
    <AppButton variant="danger" @click="discard">Discard</AppButton>
  </template>
</AppModal>`,
        demo: defineComponent({ setup() { return () => h('div', [
          h(AppButton, { variant: 'secondary', onClick: () => { demoModal.value = true } }, () => 'Open modal'),
          h(AppModal, { modelValue: demoModal.value, 'onUpdate:modelValue': (v) => { demoModal.value = v }, title: 'Discard changes?', size: 'sm' }, {
            default: () => h('p', { class: 'text-[15px] text-fg-2' }, "Your activity hasn't been saved."),
            footer: () => [
              h(AppButton, { variant: 'ghost', onClick: () => { demoModal.value = false } }, () => 'Keep editing'),
              h(AppButton, { variant: 'danger', onClick: () => { demoModal.value = false } }, () => 'Discard'),
            ],
          }),
        ]) } }),
      },
    ],
  },

  // ── Drawer ───────────────────────────────────────────────────────────────
  drawer: {
    title: 'Drawer',
    description: 'Side panel that slides in from the right. Used for activity details (keeps the list visible behind) and secondary forms opened from a modal (New reseller / end user). Same focus and Esc behaviour as Modal.',
    whenToUse: ['Reading a record without leaving the list', 'A small form needed in the middle of another form'],
    whenNotTo: ["Don't put a multi-step flow in a drawer — use Modal or a page"],
    props: [
      { name: 'v-model', type: 'Boolean', default: 'false', description: 'Open state' },
      { name: 'title / subtitle', type: 'String', default: "''", description: 'Header text (or use #header)' },
      { name: 'width', type: "'md' | 'lg'", default: "'md'", description: '480px or 640px' },
      { name: '#header / #default / #footer', type: 'Slots', default: '—', description: 'Footer pinned to the bottom' },
    ],
    stories: [
      {
        name: 'Secondary form',
        description: 'The New reseller panel pattern.',
        snippet: `<AppDrawer v-model="open" title="New reseller" subtitle="Create a reseller and add it to your activity">
  …form fields…
  <template #footer>
    <AppButton variant="ghost" @click="open = false">Cancel</AppButton>
    <AppButton class="ml-auto" type="submit" form="reseller-form">Save reseller</AppButton>
  </template>
</AppDrawer>`,
        demo: defineComponent({ setup() { return () => h('div', [
          h(AppButton, { variant: 'secondary', onClick: () => { demoDrawer.value = true } }, () => 'Open drawer'),
          h(AppDrawer, { modelValue: demoDrawer.value, 'onUpdate:modelValue': (v) => { demoDrawer.value = v }, title: 'New reseller', subtitle: 'Create a reseller and add it to your activity' }, {
            default: () => h(AppFormField, { label: 'Company name', inputId: 'ds-dr-name', required: true }, { default: () => h(AppInput, { id: 'ds-dr-name', placeholder: 'e.g. Acme Corporation' }) }),
            footer: () => [
              h(AppButton, { variant: 'ghost', onClick: () => { demoDrawer.value = false } }, () => 'Cancel'),
              h(AppButton, { class: 'ml-auto', onClick: () => { demoDrawer.value = false } }, () => 'Save reseller'),
            ],
          }),
        ]) } }),
      },
    ],
  },

  // ── Popover ──────────────────────────────────────────────────────────────
  popover: {
    title: 'Popover',
    description: 'Click-to-open panel anchored to a trigger (Filters). Closes on outside click and Esc. The trigger slot gets toggle() and open; the content slot gets close().',
    whenToUse: ['A handful of controls that shouldn\'t take permanent space — filters, quick settings'],
    whenNotTo: ["Don't use for hover-only information — use Tooltip", "Don't put long forms in it — use Drawer"],
    props: [
      { name: 'label', type: 'String', default: 'null', description: 'Accessible name of the panel' },
      { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Edge of the trigger it lines up with' },
      { name: 'width-class', type: 'String', default: "'w-80'", description: 'Width utility for the panel' },
      { name: '#trigger="{ toggle, open }" · #default="{ close }"', type: 'Slots', default: '—', description: 'Bind :aria-expanded="open" on the trigger' },
    ],
    stories: [
      {
        name: 'Filters',
        description: 'The Activity page filter panel.',
        snippet: `<AppPopover label="Filters">
  <template #trigger="{ toggle, open }">
    <AppButton variant="secondary" :aria-expanded="open" @click="toggle">Filters</AppButton>
  </template>
  <template #default="{ close }">
    …fields…
    <AppButton size="sm" @click="close">Done</AppButton>
  </template>
</AppPopover>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'min-h-[220px]' },
          h(AppPopover, { label: 'Filters' }, {
            trigger: ({ toggle, open }) => h(AppButton, { variant: 'secondary', 'aria-expanded': open, onClick: toggle }, () => 'Filters'),
            default: ({ close }) => h('div', { class: 'space-y-4' }, [
              h(AppFormField, { label: 'Record type', inputId: 'ds-pop-rt' }, { default: () => h(AppSelect, { id: 'ds-pop-rt', modelValue: '', options: [{ value: '', label: 'All types' }, 'Sales', 'Pre-Sales', 'Marketing'] }) }),
              h('div', { class: 'flex justify-end' }, h(AppButton, { size: 'sm', onClick: close }, () => 'Done')),
            ]),
          })
        ) } }),
      },
    ],
  },

  // ── Toast ────────────────────────────────────────────────────────────────
  toast: {
    title: 'Toast',
    description: 'Short confirmation in the bottom-right corner, gone after 4 seconds and announced to screen readers. AppToaster is mounted once in AppLayout — call ui.toast() from anywhere.',
    whenToUse: ['Confirming something that happened off-screen or after a modal closed (Activity logged · +50 pts)'],
    whenNotTo: ["Don't use for errors the user must fix — show them next to the field", "Don't use for anything that needs an action"],
    props: [
      { name: "ui.toast(message, tone)", type: "(String, 'success' | 'reward' | 'danger')", default: "tone 'success'", description: 'useUiStore().toast — reward = gold, for points' },
    ],
    stories: [
      {
        name: 'Tones',
        description: 'Click to show each tone.',
        snippet: `const ui = useUiStore()
ui.toast('Test Reseller Ltd created and added')
ui.toast('Activity logged · +50 pts', 'reward')
ui.toast('Salesforce sync failed', 'danger')`,
        demo: defineComponent({ setup() { const ui = useUiStore(); return () => h('div', { class: 'flex flex-wrap gap-3' }, [
          h(AppButton, { variant: 'secondary', onClick: () => ui.toast('Test Reseller Ltd created and added') }, () => 'Success'),
          h(AppButton, { variant: 'reward', onClick: () => ui.toast('Activity logged · +50 pts', 'reward') }, () => 'Reward'),
          h(AppButton, { variant: 'secondary', onClick: () => ui.toast('Salesforce sync failed', 'danger') }, () => 'Danger'),
        ]) } }),
      },
    ],
  },

  // ── Data Table ───────────────────────────────────────────────────────────
  'data-table': {
    title: 'Data Table',
    description: 'Simple table with per-cell slots. Columns can hide on small screens through their class, keep a visually hidden header (actions) and the table gets a screen-reader caption.',
    whenToUse: ['Comparing records across the same fields — users, standings'],
    whenNotTo: ["Don't use on phones for rich rows — switch to cards (see Activity table)"],
    props: [
      { name: 'columns', type: 'Array<{ key, label, align?, class?, srOnly? }>', default: '—', description: "class goes on th + td — e.g. 'hidden lg:table-cell'" },
      { name: 'rows', type: 'Array<Object>', default: '[]', description: 'Each row should have an id' },
      { name: 'caption', type: 'String', default: 'null', description: 'Screen-reader caption' },
      { name: 'clickable', type: 'Boolean', default: 'false', description: 'Emits row-click' },
      { name: '#cell-{key}="{ row, value }"', type: 'Slot', default: '—', description: 'Custom cell content' },
    ],
    stories: [
      {
        name: 'With slots and responsive columns',
        description: 'Territory hides below lg.',
        snippet: `<DataTable :columns="[
  { key: 'name', label: 'User' },
  { key: 'territory', label: 'Territory', class: 'hidden lg:table-cell' },
  { key: 'points', label: 'Points', align: 'right' },
]" :rows="users" caption="Users">
  <template #cell-points="{ value }">{{ value.toLocaleString() }}</template>
</DataTable>`,
        demo: defineComponent({ setup() { return () => h(DataTable, {
          caption: 'Users',
          columns: [{ key: 'name', label: 'User' }, { key: 'territory', label: 'Territory', class: 'hidden lg:table-cell' }, { key: 'points', label: 'Points', align: 'right' }],
          rows: [{ id: 1, name: 'Amy Shingles', territory: 'Ignition - UK', points: 32900 }, { id: 2, name: 'Wolfgang Hohenthanner', territory: 'Ignition - DACH', points: 1700 }, { id: 3, name: 'Nikola Gavric', territory: 'Ignition - UK', points: 710 }],
        }, { 'cell-points': ({ value }) => h('span', { class: 'font-display font-bold text-reward tabular' }, value.toLocaleString('en-GB')) }) } }),
      },
    ],
  },
}

const current = computed(() => componentData[slug.value] ?? null)

// ── Copy ──────────────────────────────────────────────────────────────────
const copiedKey = ref('')
async function copyText(text, key) {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = '' }, 2000)
  } catch {}
}
</script>

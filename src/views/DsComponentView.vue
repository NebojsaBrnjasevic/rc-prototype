<template>
  <AppLayout>
    <div class="flex gap-8 min-h-screen">

      <!-- ── Sticky left sidebar ──────────────────────────────────────── -->
      <aside class="hidden lg:flex flex-col w-52 flex-shrink-0">
        <div class="lg:sticky lg:top-[4.5rem] self-start space-y-1">
          <div class="mb-4 px-3">
            <p class="text-overline text-brand-400">Internal</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Design System</p>
            <p class="text-2xs text-subtle mt-0.5">Vue 3 + Tailwind CSS</p>
          </div>

          <div v-for="group in navGroups" :key="group.label" class="mb-3">
            <p class="text-2xs text-subtle uppercase tracking-widest font-semibold px-3 mb-1">{{ group.label }}</p>
            <router-link
              v-for="item in group.items"
              :key="item.slug"
              :to="'/ds/' + item.slug"
              class="block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
              :class="route.params.slug === item.slug
                ? 'bg-brand-400/10 text-brand-400 font-medium'
                : 'text-subtle hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark-overlay'"
            >{{ item.label }}</router-link>
          </div>

          <div class="px-3 pt-3 mt-2 border-t border-gray-200 dark:border-surface-dark-border">
            <router-link to="/ds" class="text-xs text-subtle hover:text-brand-400 transition-colors">← All components</router-link>
          </div>
        </div>
      </aside>

      <!-- ── Main content ─────────────────────────────────────────────── -->
      <main class="flex-1 min-w-0 pb-24">

        <template v-if="current">
          <!-- Page header -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ current.title }}</h1>
            <p class="text-sm text-subtle mt-1">{{ current.description }}</p>
          </div>

          <!-- Live demo -->
          <section class="mb-8">
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-overline text-subtle">Live Demo</h2>
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6">

              <!-- BUTTON -->
              <template v-if="slug === 'button'">
                <div class="space-y-5">
                  <div><p class="text-overline text-subtle mb-3">Variants</p>
                    <div class="flex flex-wrap gap-3">
                      <AppButton variant="primary">Primary</AppButton>
                      <AppButton variant="secondary">Secondary</AppButton>
                      <AppButton variant="ghost">Ghost</AppButton>
                      <AppButton variant="danger">Danger</AppButton>
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">Sizes</p>
                    <div class="flex flex-wrap items-center gap-3">
                      <AppButton variant="primary" size="sm">Small</AppButton>
                      <AppButton variant="primary" size="md">Medium</AppButton>
                      <AppButton variant="primary" size="lg">Large</AppButton>
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">States</p>
                    <div class="flex flex-wrap items-center gap-3">
                      <AppButton variant="primary" :loading="true">Loading</AppButton>
                      <AppButton variant="primary" :disabled="true">Disabled</AppButton>
                    </div>
                  </div>
                </div>
              </template>

              <!-- BADGE -->
              <template v-else-if="slug === 'badge'">
                <div class="space-y-5">
                  <div><p class="text-overline text-subtle mb-3">Colors</p>
                    <div class="flex flex-wrap gap-2">
                      <AppBadge color="brand">Brand</AppBadge>
                      <AppBadge color="success">Success</AppBadge>
                      <AppBadge color="warning">Warning</AppBadge>
                      <AppBadge color="danger">Danger</AppBadge>
                      <AppBadge color="neutral">Neutral</AppBadge>
                      <AppBadge color="reward">Reward</AppBadge>
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">With dot</p>
                    <div class="flex flex-wrap gap-2">
                      <AppBadge color="success" dot>Active</AppBadge>
                      <AppBadge color="warning" dot>Pending</AppBadge>
                      <AppBadge color="danger" dot>Offline</AppBadge>
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">Sizes</p>
                    <div class="flex flex-wrap items-center gap-2">
                      <AppBadge color="brand" size="xs">XSmall</AppBadge>
                      <AppBadge color="brand" size="sm">Small</AppBadge>
                      <AppBadge color="brand" size="md">Medium</AppBadge>
                    </div>
                  </div>
                </div>
              </template>

              <!-- CHIP -->
              <template v-else-if="slug === 'chip'">
                <div class="space-y-5">
                  <div><p class="text-overline text-subtle mb-3">Variants</p>
                    <div class="flex flex-wrap gap-2">
                      <AppChip label="Default" />
                      <AppChip label="Brand" variant="brand" />
                      <AppChip label="Success" variant="success" />
                      <AppChip label="Warning" variant="warning" />
                      <AppChip label="Danger" variant="danger" />
                      <AppChip label="Pre-Sales" variant="presales" />
                      <AppChip label="Reward" variant="reward" />
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">With dot</p>
                    <div class="flex flex-wrap gap-2">
                      <AppChip label="Active" variant="success" dot />
                      <AppChip label="Pending" variant="warning" dot />
                      <AppChip label="Pre-Sales" variant="presales" dot />
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">With count</p>
                    <div class="flex flex-wrap gap-2">
                      <AppChip label="Filters" variant="brand" :count="3" />
                      <AppChip label="Tags" :count="12" />
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">Removable</p>
                    <div class="flex flex-wrap gap-2">
                      <AppChip
                        v-for="tag in demoTags" :key="tag"
                        :label="tag" variant="brand" removable
                        @remove="removeTag(tag)"
                      />
                      <span v-if="!demoTags.length" class="text-xs text-subtle">All removed — refresh to reset</span>
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">Sizes</p>
                    <div class="flex flex-wrap items-center gap-2">
                      <AppChip label="Small" size="sm" variant="brand" />
                      <AppChip label="Medium" size="md" variant="brand" />
                    </div>
                  </div>
                </div>
              </template>

              <!-- SEGMENT CONTROL -->
              <template v-else-if="slug === 'segment-control'">
                <div class="space-y-6">
                  <div><p class="text-overline text-subtle mb-3">Default</p>
                    <AppSegmentControl v-model="demoSegment" :options="[{label:'My Activities',value:'mine'},{label:'Team',value:'team'},{label:'All',value:'all'}]" />
                    <p class="text-xs text-subtle mt-2">Selected: <span class="font-mono text-brand-400">{{ demoSegment }}</span></p>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">With icons</p>
                    <AppSegmentControl v-model="demoSegment2" :options="[{label:'Table',value:'table',icon:'⊞'},{label:'Calendar',value:'cal',icon:'📅'},{label:'Kanban',value:'board',icon:'⧉'}]" />
                  </div>
                </div>
              </template>

              <!-- VIEW TABS -->
              <template v-else-if="slug === 'view-tabs'">
                <div class="space-y-4">
                  <AppViewTabs v-model="demoTab" :tabs="[{label:'Overview',value:'overview',icon:'📊'},{label:'Pipeline',value:'pipeline',icon:'💰'},{label:'Activity',value:'activity',icon:'⚡'}]" />
                  <p class="text-xs text-subtle">Active: <span class="font-mono text-brand-400">{{ demoTab }}</span></p>
                </div>
              </template>

              <!-- RADIO CARD -->
              <template v-else-if="slug === 'radio-card'">
                <div class="space-y-3 max-w-md">
                  <p class="text-overline text-subtle mb-3">Activity type</p>
                  <AppRadioCard v-model="demoRadio" value="sales" label="Sales" description="Customer meetings, demos, closing" color="brand">
                    <template #icon>💼</template>
                  </AppRadioCard>
                  <AppRadioCard v-model="demoRadio" value="presales" label="Pre-Sales" description="Technical evaluations, POCs" color="presales">
                    <template #icon>🔬</template>
                  </AppRadioCard>
                  <AppRadioCard v-model="demoRadio" value="marketing" label="Marketing" description="Events, content, campaigns" color="success">
                    <template #icon>📣</template>
                  </AppRadioCard>
                  <p class="text-xs text-subtle mt-2">Selected: <span class="font-mono text-brand-400">{{ demoRadio }}</span></p>
                </div>
              </template>

              <!-- INPUT -->
              <template v-else-if="slug === 'input'">
                <div class="space-y-4 max-w-md">
                  <AppFormField label="Default"><AppInput v-model="demoInput" placeholder="Enter text…" /></AppFormField>
                  <AppFormField label="Error" error="This field is required"><AppInput v-model="demoInput" placeholder="Error state" :error="true" /></AppFormField>
                  <AppFormField label="Clearable"><AppInput v-model="demoClearable" placeholder="Type to clear…" clearable /></AppFormField>
                  <AppFormField label="Sizes">
                    <div class="space-y-2">
                      <AppInput v-model="demoInput" placeholder="Small…" size="sm" />
                      <AppInput v-model="demoInput" placeholder="Medium…" size="md" />
                      <AppInput v-model="demoInput" placeholder="Large…" size="lg" />
                    </div>
                  </AppFormField>
                </div>
              </template>

              <!-- TOGGLE -->
              <template v-else-if="slug === 'toggle'">
                <div class="space-y-4 max-w-xs">
                  <div class="flex items-center justify-between">
                    <div><p class="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p><p class="text-xs text-subtle">App theme</p></div>
                    <AppToggle v-model="demoToggle1" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div><p class="text-sm font-medium text-gray-900 dark:text-white">Notifications</p><p class="text-xs text-subtle">size="sm"</p></div>
                    <AppToggle v-model="demoToggle2" size="sm" active-color="bg-success" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div><p class="text-sm font-medium text-gray-900 dark:text-white">Rewards</p><p class="text-xs text-subtle">size="lg"</p></div>
                    <AppToggle v-model="demoToggle3" size="lg" active-color="bg-reward" />
                  </div>
                </div>
              </template>

              <!-- CHECKBOX -->
              <template v-else-if="slug === 'checkbox'">
                <div class="space-y-3 max-w-sm">
                  <AppCheckbox v-model="demoCheck1">Agree to terms and conditions</AppCheckbox>
                  <AppCheckbox v-model="demoCheck2">Send weekly digest</AppCheckbox>
                  <AppCheckbox :model-value="true" :indeterminate="true">Indeterminate</AppCheckbox>
                  <AppCheckbox :model-value="false" :disabled="true">Disabled unchecked</AppCheckbox>
                  <AppCheckbox :model-value="true" :disabled="true">Disabled checked</AppCheckbox>
                </div>
              </template>

              <!-- SELECT -->
              <template v-else-if="slug === 'select'">
                <div class="space-y-4 max-w-sm">
                  <AppFormField label="Activity type">
                    <AppSelect v-model="demoSelect" :options="['Sales','Pre-Sales','Marketing']" placeholder="Select…" />
                  </AppFormField>
                  <AppFormField label="Error state" error="Selection required">
                    <AppSelect v-model="demoSelectErr" :options="['Upcoming','In Progress','Completed']" placeholder="Select…" :error="true" />
                  </AppFormField>
                </div>
              </template>

              <!-- SPINNER -->
              <template v-else-if="slug === 'spinner'">
                <div class="flex flex-wrap items-center gap-8">
                  <div v-for="s in ['xs','sm','md','lg']" :key="s" class="flex flex-col items-center gap-2">
                    <AppSpinner :size="s" />
                    <span class="text-2xs text-subtle font-mono">{{ s }}</span>
                  </div>
                  <AppDivider class="h-8" vertical />
                  <div class="flex flex-col items-center gap-2">
                    <AppSpinner color="subtle" />
                    <span class="text-2xs text-subtle font-mono">subtle</span>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <div class="bg-brand-400 rounded-lg p-2"><AppSpinner color="white" /></div>
                    <span class="text-2xs text-subtle font-mono">white on brand</span>
                  </div>
                </div>
              </template>

              <!-- SKELETON -->
              <template v-else-if="slug === 'skeleton'">
                <div class="space-y-6 max-w-md">
                  <div><p class="text-overline text-subtle mb-3">rect (default)</p>
                    <AppSkeleton height="48px" />
                  </div>
                  <div><p class="text-overline text-subtle mb-3">circle</p>
                    <div class="flex gap-3">
                      <AppSkeleton variant="circle" width="40px" height="40px" />
                      <AppSkeleton variant="circle" width="56px" height="56px" />
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">text (3 lines)</p>
                    <AppSkeleton variant="text" :lines="3" height="12px" />
                  </div>
                  <div><p class="text-overline text-subtle mb-3">card</p>
                    <AppSkeleton variant="card" />
                  </div>
                  <div><p class="text-overline text-subtle mb-3">no animation</p>
                    <AppSkeleton height="32px" :animate="false" />
                  </div>
                </div>
              </template>

              <!-- PROGRESS -->
              <template v-else-if="slug === 'progress'">
                <div class="space-y-4 max-w-md">
                  <AppProgressBar :value="35"  label="Week"    :show-value="true" />
                  <AppProgressBar :value="98"  label="Month"   :show-value="true" color="warning" />
                  <AppProgressBar :value="67"  label="Level 3" :show-value="true" color="reward" />
                  <AppProgressBar :value="100" label="Done"    :show-value="true" color="success" />
                  <AppDivider>sizes</AppDivider>
                  <AppProgressBar :value="60" label="sm" size="sm" />
                  <AppProgressBar :value="60" label="md" size="md" />
                  <AppProgressBar :value="60" label="lg" size="lg" />
                </div>
              </template>

              <!-- DIVIDER -->
              <template v-else-if="slug === 'divider'">
                <div class="space-y-6 max-w-md">
                  <AppDivider />
                  <AppDivider>or continue with</AppDivider>
                  <AppDivider>section break</AppDivider>
                </div>
              </template>

              <!-- EMPTY STATE -->
              <template v-else-if="slug === 'empty-state'">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border">
                    <AppEmptyState title="No activities yet" description="Log your first activity to start tracking.">
                      <template #action><AppButton variant="primary" size="sm">Log Activity</AppButton></template>
                    </AppEmptyState>
                  </div>
                  <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border">
                    <AppEmptyState title="No vendor data" description="Activities with vendor links appear here." compact />
                  </div>
                </div>
              </template>

              <!-- FORM FIELD -->
              <template v-else-if="slug === 'form-field'">
                <div class="space-y-4 max-w-md">
                  <AppFormField label="Vendor name" helper="The vendor you met with">
                    <AppInput v-model="demoInput" placeholder="e.g. CrowdStrike" />
                  </AppFormField>
                  <AppFormField label="Activity type" required hint="Required">
                    <AppSelect v-model="demoSelect" :options="['Sales','Pre-Sales','Marketing']" placeholder="Select…" />
                  </AppFormField>
                  <AppFormField label="Notes" error="At least 20 characters required">
                    <textarea rows="3" placeholder="Describe the activity…"
                      class="w-full rounded-xl border border-danger px-3 py-2 text-sm bg-white dark:bg-surface-dark-overlay text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-danger resize-none" />
                  </AppFormField>
                </div>
              </template>

              <!-- INFO CHIP -->
              <template v-else-if="slug === 'info-chip'">
                <div class="space-y-5">
                  <div><p class="text-overline text-subtle mb-3">Directions</p>
                    <div class="flex flex-wrap gap-2">
                      <AppInfoChip label="Top signal: SALES · 153" direction="up" variant="brand" />
                      <AppInfoChip label="Trending down" direction="down" variant="danger" />
                      <AppInfoChip label="Stable" direction="right" variant="success" />
                      <AppInfoChip label="No change" direction="none" />
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">Variants</p>
                    <div class="flex flex-wrap gap-2">
                      <AppInfoChip label="Default" />
                      <AppInfoChip label="Brand" variant="brand" direction="up" />
                      <AppInfoChip label="Success" variant="success" direction="up" />
                      <AppInfoChip label="Warning" variant="warning" direction="down" />
                      <AppInfoChip label="Danger" variant="danger" direction="down" />
                    </div>
                  </div>
                </div>
              </template>

              <!-- AVATAR -->
              <template v-else-if="slug === 'avatar'">
                <div class="space-y-5">
                  <div><p class="text-overline text-subtle mb-3">Sizes</p>
                    <div class="flex flex-wrap items-end gap-4">
                      <div v-for="[name, size] in [['Nikola Gavric','xl'],['Wolfgang H.','lg'],['Chris F','md'],['Darren G','sm'],['A','xs']]" :key="size"
                        class="flex flex-col items-center gap-1.5">
                        <AppAvatar :name="name" :size="size" />
                        <span class="text-2xs text-subtle font-mono">{{ size }}</span>
                      </div>
                    </div>
                  </div>
                  <div><p class="text-overline text-subtle mb-3">Avatar group</p>
                    <div class="flex -space-x-2">
                      <AppAvatar v-for="n in ['Nikola Gavric','Wolfgang H','Chris F','Darren G']" :key="n" :name="n" size="sm"
                        class="ring-2 ring-white dark:ring-surface-dark-raised" />
                      <div class="w-8 h-8 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay border-2 border-white dark:border-surface-dark-raised flex items-center justify-center">
                        <span class="text-2xs text-subtle font-semibold">+8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- fallback -->
              <template v-else>
                <p class="text-sm text-subtle">Demo coming soon for <span class="font-mono text-brand-400">{{ slug }}</span>.</p>
              </template>

            </div>
          </section>

          <!-- Code snippet -->
          <section>
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-overline text-subtle">Usage</h2>
            <div class="rounded-xl bg-gray-900 dark:bg-black/50 border border-gray-700 overflow-hidden">
              <div class="px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <span class="text-xs text-gray-400 font-mono">{{ current.title }}.vue</span>
                <button
                  class="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                  @click="copySnippet"
                >{{ copied ? 'Copied!' : 'Copy' }}</button>
              </div>
              <pre class="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed"><code>{{ current.snippet }}</code></pre>
            </div>
          </section>
        </template>

        <!-- Not found -->
        <div v-else class="text-center py-20">
          <p class="text-subtle text-sm">Component <span class="font-mono text-brand-400">{{ slug }}</span> not found.</p>
          <router-link to="/ds" class="mt-4 inline-block text-sm text-brand-400 hover:underline">← Back to Design System</router-link>
        </div>

      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const slug = computed(() => route.params.slug)

// ── Nav structure ─────────────────────────────────────────────────────────
const navGroups = [
  {
    label: 'Foundations',
    items: [
      { slug: 'colors',     label: 'Color Tokens' },
      { slug: 'typography', label: 'Typography' },
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
      { slug: 'select',   label: 'Select' },
      { slug: 'toggle',   label: 'Toggle' },
      { slug: 'checkbox', label: 'Checkbox' },
      { slug: 'divider',  label: 'Divider' },
      { slug: 'spinner',  label: 'Spinner' },
      { slug: 'skeleton', label: 'Skeleton' },
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
    label: 'Feedback',
    items: [
      { slug: 'progress', label: 'Progress Bar' },
    ],
  },
]

// ── Component data map ────────────────────────────────────────────────────
const componentData = {
  button: {
    title: 'Button',
    description: 'Primary interactive element — 4 variants, 3 sizes, loading and disabled states.',
    snippet: `<AppButton variant="primary">Primary</AppButton>
<AppButton variant="secondary">Secondary</AppButton>
<AppButton variant="ghost">Ghost</AppButton>
<AppButton variant="danger">Danger</AppButton>

<!-- Sizes -->
<AppButton variant="primary" size="sm">Small</AppButton>
<AppButton variant="primary" size="md">Medium</AppButton>
<AppButton variant="primary" size="lg">Large</AppButton>

<!-- States -->
<AppButton variant="primary" :loading="true">Loading</AppButton>
<AppButton variant="primary" :disabled="true">Disabled</AppButton>`,
  },
  badge: {
    title: 'Badge',
    description: 'Semantic status label — colors, optional dot indicator, 3 sizes.',
    snippet: `<AppBadge color="brand">Brand</AppBadge>
<AppBadge color="success" dot>Active</AppBadge>
<AppBadge color="warning" dot>Pending</AppBadge>
<AppBadge color="danger">Error</AppBadge>
<AppBadge color="reward" size="xs">Points</AppBadge>`,
  },
  avatar: {
    title: 'Avatar',
    description: 'User avatar with deterministic color hash from name, 5 sizes.',
    snippet: `<AppAvatar name="Nikola Gavric" size="xl" />
<AppAvatar name="Chris F" size="md" />
<AppAvatar name="A" size="xs" />

<!-- Avatar group -->
<div class="flex -space-x-2">
  <AppAvatar v-for="n in names" :key="n" :name="n" size="sm"
    class="ring-2 ring-white dark:ring-surface-dark-raised" />
</div>`,
  },
  chip: {
    title: 'Chip',
    description: 'Pill component for tags, filter chips, and status indicators. Supports dot, count, and removable.',
    snippet: `<AppChip label="Default" />
<AppChip label="Brand" variant="brand" />
<AppChip label="Success" variant="success" dot />
<AppChip label="Pre-Sales" variant="presales" />
<AppChip label="Filters" variant="brand" :count="3" />
<AppChip label="Tag" variant="brand" removable @remove="handleRemove" />`,
  },
  'segment-control': {
    title: 'Segment Control',
    description: 'Pill-group switcher for toggling between views or filters.',
    snippet: `<AppSegmentControl
  v-model="activeView"
  :options="[
    { label: 'My Activities', value: 'mine' },
    { label: 'Team', value: 'team' },
    { label: 'All', value: 'all' },
  ]"
/>`,
  },
  'view-tabs': {
    title: 'View Tabs',
    description: 'Tab row with icons for switching between views — Table, Calendar, Kanban etc.',
    snippet: `<AppViewTabs
  v-model="activeTab"
  :tabs="[
    { label: 'Overview', value: 'overview', icon: '📊' },
    { label: 'Pipeline', value: 'pipeline', icon: '💰' },
    { label: 'Activity', value: 'activity', icon: '⚡' },
  ]"
/>`,
  },
  'radio-card': {
    title: 'Radio Card',
    description: 'Selectable card with colored icon, title, description, and radio indicator.',
    snippet: `<AppRadioCard
  v-model="selected"
  value="sales"
  label="Sales"
  description="Customer meetings, demos, closing"
  color="brand"
>
  <template #icon>💼</template>
</AppRadioCard>`,
  },
  input: {
    title: 'Input',
    description: 'Text input — sizes, error state, clearable button, and leading/trailing slots.',
    snippet: `<AppInput v-model="text" placeholder="Enter text…" />
<AppInput v-model="text" :error="true" placeholder="Error state" />
<AppInput v-model="text" clearable placeholder="Clearable…" />
<AppInput v-model="text" size="sm" placeholder="Small…" />
<AppInput v-model="text" size="lg" placeholder="Large…" />`,
  },
  toggle: {
    title: 'Toggle',
    description: 'Accessible on/off switch — 3 sizes, custom activeColor, role=switch.',
    snippet: `<AppToggle v-model="enabled" />
<AppToggle v-model="enabled" size="sm" active-color="bg-success" />
<AppToggle v-model="enabled" size="lg" active-color="bg-reward" />`,
  },
  checkbox: {
    title: 'Checkbox',
    description: 'Checkbox with indeterminate state, disabled, and slotted label.',
    snippet: `<AppCheckbox v-model="agreed">I agree to the terms</AppCheckbox>
<AppCheckbox :model-value="true" :indeterminate="true">Indeterminate</AppCheckbox>
<AppCheckbox :model-value="false" :disabled="true">Disabled</AppCheckbox>`,
  },
  select: {
    title: 'Select',
    description: 'Dropdown select — accepts string[] or {label,value}[] options.',
    snippet: `<AppSelect
  v-model="selected"
  :options="['Sales', 'Pre-Sales', 'Marketing']"
  placeholder="Select type…"
/>

<!-- With objects -->
<AppSelect
  v-model="selected"
  :options="[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]"
/>`,
  },
  spinner: {
    title: 'Spinner',
    description: 'Loading spinner — 4 sizes, 3 color variants.',
    snippet: `<AppSpinner size="xs" />
<AppSpinner size="sm" />
<AppSpinner size="md" />
<AppSpinner size="lg" />
<AppSpinner color="subtle" />
<AppSpinner color="white" />`,
  },
  skeleton: {
    title: 'Skeleton',
    description: 'Loading placeholder — rect, circle, text lines, and card variants with animate-pulse.',
    snippet: `<!-- rect (default) -->
<AppSkeleton height="48px" />

<!-- circle -->
<AppSkeleton variant="circle" width="40px" height="40px" />

<!-- text lines -->
<AppSkeleton variant="text" :lines="3" height="12px" />

<!-- card -->
<AppSkeleton variant="card" />

<!-- no animation -->
<AppSkeleton height="32px" :animate="false" />`,
  },
  progress: {
    title: 'Progress Bar',
    description: 'Labeled progress bar — 4 color themes, 3 sizes, optional value display.',
    snippet: `<AppProgressBar :value="35" label="Week" :show-value="true" />
<AppProgressBar :value="98" label="Month" :show-value="true" color="warning" />
<AppProgressBar :value="67" label="Level" :show-value="true" color="reward" />
<AppProgressBar :value="100" label="Done" :show-value="true" color="success" />`,
  },
  divider: {
    title: 'Divider',
    description: 'Horizontal separator with optional centered label slot.',
    snippet: `<AppDivider />
<AppDivider>or continue with</AppDivider>`,
  },
  'empty-state': {
    title: 'Empty State',
    description: 'Empty placeholder with icon, title, description, and action slot.',
    snippet: `<AppEmptyState
  title="No activities yet"
  description="Log your first activity to start tracking."
>
  <template #icon><ChartBarIcon class="w-6 h-6 text-subtle" /></template>
  <template #action>
    <AppButton variant="primary" size="sm">Log Activity</AppButton>
  </template>
</AppEmptyState>`,
  },
  'form-field': {
    title: 'Form Field',
    description: 'Label + helper/error wrapper for any input control.',
    snippet: `<AppFormField label="Vendor name" helper="The vendor you met with">
  <AppInput v-model="vendor" placeholder="e.g. CrowdStrike" />
</AppFormField>

<AppFormField label="Type" required hint="Required">
  <AppSelect v-model="type" :options="options" />
</AppFormField>

<AppFormField label="Notes" error="At least 20 characters required">
  <textarea v-model="notes" rows="3" class="..." />
</AppFormField>`,
  },
  'info-chip': {
    title: 'Info Chip',
    description: 'Directional info chip — shows an arrow prefix and signal label.',
    snippet: `<AppInfoChip label="Top signal: SALES · 153" direction="up" variant="brand" />
<AppInfoChip label="Trending down" direction="down" variant="danger" />
<AppInfoChip label="Stable" direction="right" variant="success" />
<AppInfoChip label="No change" direction="none" />`,
  },
}

const current = computed(() => componentData[slug.value] ?? null)

// ── Demo state ────────────────────────────────────────────────────────────
const demoTags     = ref(['Vue 3', 'Tailwind', 'Pinia', 'Vite'])
const demoSegment  = ref('mine')
const demoSegment2 = ref('table')
const demoTab      = ref('overview')
const demoRadio    = ref('sales')
const demoInput    = ref('')
const demoClearable= ref('Clear me…')
const demoToggle1  = ref(true)
const demoToggle2  = ref(false)
const demoToggle3  = ref(true)
const demoCheck1   = ref(true)
const demoCheck2   = ref(false)
const demoSelect   = ref('')
const demoSelectErr= ref('')

function removeTag(tag) {
  const idx = demoTags.value.indexOf(tag)
  if (idx > -1) demoTags.value.splice(idx, 1)
}

// ── Copy ──────────────────────────────────────────────────────────────────
const copied = ref(false)
async function copySnippet() {
  if (!current.value) return
  try {
    await navigator.clipboard.writeText(current.value.snippet)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}
</script>

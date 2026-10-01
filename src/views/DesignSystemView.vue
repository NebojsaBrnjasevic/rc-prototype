<template>
  <AppLayout>
    <div class="flex gap-8 min-h-screen">

      <!-- ── Sticky left sidebar ─────────────────────────────────────────── -->
      <aside class="hidden lg:flex flex-col w-52 flex-shrink-0">
        <div class="lg:sticky lg:top-[4.5rem] self-start space-y-1">
          <!-- Header -->
          <div class="mb-4 px-3">
            <p class="text-overline text-brand-400">Internal</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">Design System</p>
            <p class="text-2xs text-subtle mt-0.5">Vue 3 + Tailwind CSS</p>
          </div>

          <!-- Section groups -->
          <div v-for="group in navGroups" :key="group.label" class="mb-3">
            <p class="text-2xs text-subtle uppercase tracking-widest font-semibold px-3 mb-1">{{ group.label }}</p>
            <template v-for="sec in group.items" :key="sec.id">
              <!-- Router-link for items with a slug (open full component page) -->
              <router-link
                v-if="sec.slug"
                :to="'/ds/' + sec.slug"
                class="block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all text-subtle hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark-overlay"
              >{{ sec.label }}</router-link>
              <!-- Scroll button for sections within this page -->
              <button
                v-else
                class="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                :class="activeSection === sec.id
                  ? 'bg-brand-400/10 text-brand-400 font-medium'
                  : 'text-subtle hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark-overlay'"
                @click="scrollTo(sec.id)"
              >{{ sec.label }}</button>
            </template>
          </div>

          <!-- Version badge -->
          <div class="px-3 pt-3 mt-2 border-t border-gray-200 dark:border-surface-dark-border">
            <AppBadge color="brand" size="xs">v1.1 · 20 components</AppBadge>
          </div>
        </div>
      </aside>

      <!-- ── Main content ────────────────────────────────────────────────── -->
      <main class="flex-1 min-w-0 pb-24">

        <!-- Page header -->
        <div class="flex items-start justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Design System</h1>
            <p class="text-sm text-subtle mt-1">Atomic component library for Race Control</p>
          </div>
          <AppBadge color="brand">v1.0</AppBadge>
        </div>

        <!-- Mobile section picker -->
        <div class="lg:hidden mb-6">
          <AppSelect v-model="mobileSection" :options="allSections.map(s => ({ label: s.label, value: s.id }))"
            placeholder="Jump to section…" @update:model-value="scrollTo($event)" />
        </div>

        <div class="space-y-16">

          <!-- ── Colors ──────────────────────────────────────────────────── -->
          <section id="colors">
            <SectionHeader title="Color Tokens" subtitle="Semantic palette — use tokens, never raw hex in components" />
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              <div v-for="token in colorTokens" :key="token.name"
                class="rounded-xl border border-gray-200 dark:border-surface-dark-border overflow-hidden">
                <div class="h-14" :style="{ background: token.hex }" />
                <div class="p-3 bg-white dark:bg-surface-dark-raised">
                  <p class="text-xs font-semibold text-gray-900 dark:text-white">{{ token.name }}</p>
                  <p class="text-2xs text-subtle font-mono mt-0.5">{{ token.hex }}</p>
                  <p class="text-2xs text-subtle mt-0.5 leading-relaxed">{{ token.usage }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Typography ──────────────────────────────────────────────── -->
          <section id="typography">
            <SectionHeader title="Typography" subtitle="Inter — weights 300–700, font-feature-settings enabled" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-4">
              <div v-for="t in typeScale" :key="t.class" class="flex items-baseline gap-4 py-1">
                <span class="text-2xs text-subtle w-36 flex-shrink-0 font-mono">{{ t.class }}</span>
                <p :class="t.class + ' text-gray-900 dark:text-white'">{{ t.sample }}</p>
              </div>
              <AppDivider>utilities</AppDivider>
              <div class="flex items-baseline gap-4 py-1">
                <span class="text-2xs text-subtle w-36 flex-shrink-0 font-mono">.text-overline</span>
                <p class="text-overline text-subtle">Overline Label</p>
              </div>
              <div class="flex items-baseline gap-4 py-1">
                <span class="text-2xs text-subtle w-36 flex-shrink-0 font-mono">.text-subtle</span>
                <p class="text-subtle text-sm">Secondary / muted text</p>
              </div>
            </div>
          </section>

          <!-- ── Cards ──────────────────────────────────────────────────── -->
          <section id="cards">
            <SectionHeader title="Card" subtitle="Surface patterns — 4 variants used across the application" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <!-- Basic surface card -->
              <div>
                <p class="text-overline text-subtle mb-2">Surface card (default)</p>
                <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-5">
                  <p class="text-overline text-subtle mb-1">Card Title</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">42</p>
                  <p class="text-xs text-subtle mt-1">Supporting detail text</p>
                </div>
              </div>

              <!-- KPI card with category color -->
              <div>
                <p class="text-overline text-subtle mb-2">KPI card (colored border + bg)</p>
                <div class="rounded-2xl border p-5" style="border-color:#3BB3E540; background:#3BB3E50d">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <p class="text-overline text-subtle">Activities</p>
                      <p class="text-xs text-subtle mt-0.5 opacity-70">last30</p>
                    </div>
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#3BB3E520">
                      <ChartBarIcon class="w-4 h-4" style="color:#3BB3E5" />
                    </div>
                  </div>
                  <p class="text-3xl font-bold tabular-nums" style="color:#3BB3E5">35</p>
                </div>
              </div>

              <!-- Accent line card -->
              <div>
                <p class="text-overline text-subtle mb-2">Accent line card (h-0.5 top border)</p>
                <div class="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-5">
                  <div class="absolute top-0 left-0 right-0 h-0.5 bg-[#A78BFA]" />
                  <p class="text-overline text-subtle mb-1">Pre-Sales</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                  <p class="text-xs text-subtle mt-1">Activities this period</p>
                </div>
              </div>

              <!-- Info card with header / body / footer -->
              <div>
                <p class="text-overline text-subtle mb-2">Structured card (header + body + footer)</p>
                <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised overflow-hidden flex flex-col">
                  <div class="px-5 py-3 border-b border-gray-100 dark:border-surface-dark-border flex items-center justify-between">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Card Header</p>
                    <AppBadge color="success" dot>Active</AppBadge>
                  </div>
                  <div class="p-5 flex-1">
                    <p class="text-sm text-subtle">Card body content goes here. Use this pattern for tables, lists, and content sections.</p>
                  </div>
                  <div class="px-5 py-3 border-t border-gray-100 dark:border-surface-dark-border flex items-center justify-end gap-2">
                    <AppButton variant="ghost" size="sm">Cancel</AppButton>
                    <AppButton variant="primary" size="sm">Confirm</AppButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart cards -->
            <div class="mt-4">
              <p class="text-overline text-subtle mb-3">Chart cards (sparkline + metric)</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <!-- Bar sparkline -->
                <div class="relative overflow-hidden rounded-2xl border border-brand-400/25 bg-brand-400/[0.04] dark:bg-brand-400/[0.07] p-5 flex flex-col min-h-[200px]">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-overline text-subtle">Activities</p>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">35</p>
                      <p class="text-xs text-subtle mt-0.5">Last 7 days</p>
                    </div>
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">+12%</span>
                  </div>
                  <div class="flex-1" />
                  <apexchart type="bar" height="70" width="100%" :options="barOpts" :series="barSeries" />
                </div>

                <!-- Area sparkline -->
                <div class="relative overflow-hidden rounded-2xl border border-success/25 bg-success/[0.04] dark:bg-success/[0.07] p-5 flex flex-col min-h-[200px]">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-overline text-subtle">Pipeline</p>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">£22,000</p>
                      <p class="text-xs text-subtle mt-0.5">This month</p>
                    </div>
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">+450%</span>
                  </div>
                  <div class="flex-1" />
                  <apexchart type="area" height="70" width="100%" :options="areaOpts" :series="areaSeries" />
                </div>

                <!-- Radial gauge -->
                <div class="relative overflow-hidden rounded-2xl border border-reward/25 bg-reward/[0.04] dark:bg-reward/[0.07] p-5 flex flex-col min-h-[200px]">
                  <div>
                    <p class="text-overline text-subtle">Total Points</p>
                    <p class="text-2xl font-bold text-reward tabular-nums mt-1">600</p>
                    <p class="text-xs text-subtle mt-0.5">Level 3 · 300 to Lv.4</p>
                  </div>
                  <div class="flex-1" />
                  <div class="flex justify-center">
                    <apexchart type="radialBar" height="110" width="110" :options="radialOpts" :series="[67]" />
                  </div>
                </div>

              </div>
            </div>

            <!-- Card anatomy reference -->
            <div class="mt-4 rounded-xl border border-gray-200 dark:border-surface-dark-border bg-gray-50 dark:bg-surface-dark-overlay p-4">
              <p class="text-overline text-subtle mb-2">Anatomy reference</p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div><span class="font-mono text-brand-400">rounded-2xl</span><p class="text-subtle mt-0.5">Border radius</p></div>
                <div><span class="font-mono text-brand-400">border + border-gray-200</span><p class="text-subtle mt-0.5">Light mode border</p></div>
                <div><span class="font-mono text-brand-400">dark:border-white/[0.06]</span><p class="text-subtle mt-0.5">Dark mode border</p></div>
                <div><span class="font-mono text-brand-400">p-5</span><p class="text-subtle mt-0.5">Default padding</p></div>
              </div>
            </div>
          </section>

          <!-- ── Buttons ─────────────────────────────────────────────────── -->
          <section id="buttons">
            <SectionHeader title="Button" subtitle="AppButton — 4 variants × 3 sizes + loading + disabled" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-6">
              <div>
                <p class="text-overline text-subtle mb-3">Variants</p>
                <div class="flex flex-wrap items-center gap-3">
                  <AppButton variant="primary">Primary</AppButton>
                  <AppButton variant="secondary">Secondary</AppButton>
                  <AppButton variant="ghost">Ghost</AppButton>
                  <AppButton variant="danger">Danger</AppButton>
                </div>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">Sizes</p>
                <div class="flex flex-wrap items-center gap-3">
                  <AppButton variant="primary" size="sm">Small</AppButton>
                  <AppButton variant="primary" size="md">Medium</AppButton>
                  <AppButton variant="primary" size="lg">Large</AppButton>
                </div>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">States</p>
                <div class="flex flex-wrap items-center gap-3">
                  <AppButton variant="primary" :loading="true">Loading</AppButton>
                  <AppButton variant="primary" :disabled="true">Disabled</AppButton>
                  <AppButton variant="secondary" size="sm">
                    <PlusIcon class="w-3.5 h-3.5" /> With icon
                  </AppButton>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Badge ──────────────────────────────────────────────────── -->
          <section id="badges">
            <SectionHeader title="Badge" subtitle="AppBadge — semantic colors, optional dot, 3 sizes" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-5">
              <div>
                <p class="text-overline text-subtle mb-3">Colors</p>
                <div class="flex flex-wrap items-center gap-2">
                  <AppBadge color="brand">Brand</AppBadge>
                  <AppBadge color="success">Success</AppBadge>
                  <AppBadge color="warning">Warning</AppBadge>
                  <AppBadge color="danger">Danger</AppBadge>
                  <AppBadge color="neutral">Neutral</AppBadge>
                  <AppBadge color="reward">Reward</AppBadge>
                </div>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">With dot indicator</p>
                <div class="flex flex-wrap items-center gap-2">
                  <AppBadge color="success" dot>Active</AppBadge>
                  <AppBadge color="warning" dot>Pending</AppBadge>
                  <AppBadge color="danger" dot>Offline</AppBadge>
                  <AppBadge color="neutral" dot>Unknown</AppBadge>
                </div>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">Sizes</p>
                <div class="flex flex-wrap items-center gap-2">
                  <AppBadge color="brand" size="xs">XSmall</AppBadge>
                  <AppBadge color="brand" size="sm">Small</AppBadge>
                  <AppBadge color="brand" size="md">Medium</AppBadge>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Avatar ─────────────────────────────────────────────────── -->
          <section id="avatars">
            <SectionHeader title="Avatar" subtitle="AppAvatar — deterministic color hash, image fallback, 5 sizes" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-5">
              <div>
                <p class="text-overline text-subtle mb-3">Initials (deterministic color)</p>
                <div class="flex flex-wrap items-end gap-4">
                  <div v-for="[name, size] in [['Nikola Gavric','xl'],['Wolfgang H.','lg'],['Chris Faulkner','md'],['Darren Goswell','sm'],['A','xs']]" :key="name"
                    class="flex flex-col items-center gap-1.5">
                    <AppAvatar :name="name" :size="size" />
                    <span class="text-2xs text-subtle font-mono">{{ size }}</span>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">Avatar group</p>
                <div class="flex -space-x-2">
                  <AppAvatar v-for="n in ['Nikola Gavric','Wolfgang H','Chris F','Darren G']" :key="n" :name="n" size="sm"
                    class="ring-2 ring-white dark:ring-surface-dark-raised" />
                  <div class="w-8 h-8 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay border-2 border-white dark:border-surface-dark-raised flex items-center justify-center">
                    <span class="text-2xs text-subtle font-semibold">+8</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Input ──────────────────────────────────────────────────── -->
          <section id="inputs">
            <SectionHeader title="Input" subtitle="AppInput — sizes, error, clearable, leading/trailing slots" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-4 max-w-2xl">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppFormField label="Default">
                  <AppInput v-model="demo.text" placeholder="Enter text…" />
                </AppFormField>
                <AppFormField label="With error" error="This field is required">
                  <AppInput v-model="demo.errorText" placeholder="Enter text…" :error="true" />
                </AppFormField>
                <AppFormField label="Small">
                  <AppInput v-model="demo.small" placeholder="Small…" size="sm" />
                </AppFormField>
                <AppFormField label="Large">
                  <AppInput v-model="demo.large" placeholder="Large…" size="lg" />
                </AppFormField>
                <AppFormField label="Clearable" helper="Type to reveal the × button">
                  <AppInput v-model="demo.clearable" placeholder="Type something…" clearable />
                </AppFormField>
                <AppFormField label="Disabled">
                  <AppInput v-model="demo.disabled" placeholder="Disabled…" disabled />
                </AppFormField>
              </div>
            </div>
          </section>

          <!-- ── Select ─────────────────────────────────────────────────── -->
          <section id="selects">
            <SectionHeader title="Select" subtitle="AppSelect — string[] or {label,value}[] options" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-4 max-w-md">
              <AppFormField label="Activity type">
                <AppSelect v-model="demo.select" :options="['Sales','Pre-Sales','Marketing']" placeholder="Select type…" />
              </AppFormField>
              <AppFormField label="Record status (error state)" error="Selection required">
                <AppSelect v-model="demo.selectError" :options="['Upcoming','Completed','In Progress']" placeholder="Select…" :error="true" />
              </AppFormField>
            </div>
          </section>

          <!-- ── Toggle ─────────────────────────────────────────────────── -->
          <section id="toggles">
            <SectionHeader title="Toggle" subtitle="AppToggle — 3 sizes, custom activeColor, role=switch" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 max-w-sm">
              <div class="space-y-4">
                <div v-for="tog in toggleDemos" :key="tog.label" class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ tog.label }}</p>
                    <p class="text-xs text-subtle">{{ tog.desc }}</p>
                  </div>
                  <AppToggle v-model="tog.value" :size="tog.size" :active-color="tog.color" />
                </div>
              </div>
            </div>
          </section>

          <!-- ── Checkbox ───────────────────────────────────────────────── -->
          <section id="checkboxes">
            <SectionHeader title="Checkbox" subtitle="AppCheckbox — indeterminate, disabled, slotted label" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-3 max-w-sm">
              <AppCheckbox v-model="demo.check1">I agree to the terms and conditions</AppCheckbox>
              <AppCheckbox v-model="demo.check2">Send me weekly activity digests</AppCheckbox>
              <AppCheckbox :model-value="true" :indeterminate="true">Indeterminate state</AppCheckbox>
              <AppCheckbox :model-value="false" :disabled="true">Disabled unchecked</AppCheckbox>
              <AppCheckbox :model-value="true" :disabled="true">Disabled checked</AppCheckbox>
            </div>
          </section>

          <!-- ── Progress ───────────────────────────────────────────────── -->
          <section id="progress">
            <SectionHeader title="Progress Bar" subtitle="AppProgressBar — labeled, 4 colors, 3 sizes" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-4 max-w-md">
              <AppProgressBar :value="35"  label="Week"    :show-value="true" />
              <AppProgressBar :value="98"  label="Month"   :show-value="true" color="warning" />
              <AppProgressBar :value="67"  label="Level 3" :show-value="true" color="reward" />
              <AppProgressBar :value="100" label="Done"    :show-value="true" color="success" />
              <AppDivider>sizes</AppDivider>
              <AppProgressBar :value="60" label="sm" size="sm" />
              <AppProgressBar :value="60" label="md" size="md" />
              <AppProgressBar :value="60" label="lg" size="lg" />
            </div>
          </section>

          <!-- ── Divider ────────────────────────────────────────────────── -->
          <section id="dividers">
            <SectionHeader title="Divider" subtitle="AppDivider — horizontal separator, optional centered label" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-6 max-w-md">
              <AppDivider />
              <AppDivider>or continue with</AppDivider>
              <AppDivider>section break</AppDivider>
            </div>
          </section>

          <!-- ── Spinner ────────────────────────────────────────────────── -->
          <section id="spinners">
            <SectionHeader title="Spinner" subtitle="AppSpinner — 4 sizes, 3 colors" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6">
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
                  <span class="text-2xs text-subtle font-mono">white</span>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Empty State ────────────────────────────────────────────── -->
          <section id="empty-states">
            <SectionHeader title="Empty State" subtitle="AppEmptyState — icon, title, description, action slot" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised">
                <AppEmptyState title="No activities yet" description="Log your first activity to start tracking your progress.">
                  <template #icon><ChartBarIcon class="w-6 h-6 text-subtle" /></template>
                  <template #action>
                    <AppButton variant="primary" size="sm">Log Activity</AppButton>
                  </template>
                </AppEmptyState>
              </div>
              <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised">
                <AppEmptyState title="No vendor data" description="Activities with vendor links will appear here." :icon="BuildingStorefrontIcon" compact />
              </div>
            </div>
          </section>

          <!-- ── Form Field ─────────────────────────────────────────────── -->
          <section id="form-fields">
            <SectionHeader title="Form Field" subtitle="AppFormField — label, hint, helper, error wrapper for any input" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 max-w-md space-y-4">
              <AppFormField label="Vendor name" helper="The vendor you met with">
                <AppInput v-model="demo.vendor" placeholder="e.g. CrowdStrike" />
              </AppFormField>
              <AppFormField label="Activity type" required hint="Required">
                <AppSelect v-model="demo.actType" :options="['Sales','Pre-Sales','Marketing']" placeholder="Select…" />
              </AppFormField>
              <AppFormField label="Notes" error="Please enter at least 20 characters">
                <textarea v-model="demo.notes" rows="3" placeholder="Describe the activity…"
                  class="w-full rounded-xl border border-danger px-3 py-2 text-sm bg-white dark:bg-surface-dark-overlay text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-danger resize-none" />
              </AppFormField>
            </div>
          </section>

          <!-- ── Chip ──────────────────────────────────────────────────── -->
          <section id="chips">
            <SectionHeader title="Chip" subtitle="AppChip — tag/filter pill, 7 variants, dot, count, removable" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-5">
              <div>
                <p class="text-overline text-subtle mb-3">Variants</p>
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
              <div>
                <p class="text-overline text-subtle mb-3">With dot + count</p>
                <div class="flex flex-wrap gap-2">
                  <AppChip label="Active" variant="success" dot />
                  <AppChip label="Pending" variant="warning" dot />
                  <AppChip label="Filters" variant="brand" :count="3" />
                </div>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">Removable</p>
                <div class="flex flex-wrap gap-2">
                  <AppChip
                    v-for="tag in demoChipTags" :key="tag"
                    :label="tag" variant="brand" removable
                    @remove="removeChipTag(tag)"
                  />
                  <span v-if="!demoChipTags.length" class="text-xs text-subtle">All removed</span>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Info Chip ──────────────────────────────────────────────── -->
          <section id="info-chips">
            <SectionHeader title="Info Chip" subtitle="AppInfoChip — directional arrow prefix, same variants as Chip" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-4">
              <div>
                <p class="text-overline text-subtle mb-3">Directions</p>
                <div class="flex flex-wrap gap-2">
                  <AppInfoChip label="Top signal: SALES · 153" direction="up" variant="brand" />
                  <AppInfoChip label="Trending down" direction="down" variant="danger" />
                  <AppInfoChip label="Stable" direction="right" variant="success" />
                  <AppInfoChip label="No change" direction="none" />
                </div>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">Variants</p>
                <div class="flex flex-wrap gap-2">
                  <AppInfoChip label="Default" />
                  <AppInfoChip label="Brand" variant="brand" direction="up" />
                  <AppInfoChip label="Success" variant="success" direction="up" />
                  <AppInfoChip label="Warning" variant="warning" direction="down" />
                  <AppInfoChip label="Danger" variant="danger" direction="down" />
                </div>
              </div>
            </div>
          </section>

          <!-- ── Segment Control ────────────────────────────────────────── -->
          <section id="segment-control">
            <SectionHeader title="Segment Control" subtitle="AppSegmentControl — pill-group switcher for view/filter toggles" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6 space-y-5">
              <div>
                <p class="text-overline text-subtle mb-3">Default</p>
                <AppSegmentControl
                  v-model="demoSegmentVal"
                  :options="[{label:'My Activities',value:'mine'},{label:'Team',value:'team'},{label:'All',value:'all'}]"
                />
                <p class="text-xs text-subtle mt-2">Selected: <span class="font-mono text-brand-400">{{ demoSegmentVal }}</span></p>
              </div>
              <div>
                <p class="text-overline text-subtle mb-3">With icons</p>
                <AppSegmentControl
                  v-model="demoSegmentVal"
                  :options="[{label:'Table',value:'table',icon:'⊞'},{label:'Calendar',value:'cal',icon:'📅'},{label:'Board',value:'board',icon:'⧉'}]"
                />
              </div>
            </div>
          </section>

          <!-- ── View Tabs ──────────────────────────────────────────────── -->
          <section id="view-tabs">
            <SectionHeader title="View Tabs" subtitle="AppViewTabs — underline tab row with optional icon prefix" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6">
              <AppViewTabs
                v-model="demoViewTab"
                :tabs="[
                  {label:'Overview',value:'overview',icon:'📊'},
                  {label:'Pipeline',value:'pipeline',icon:'💰'},
                  {label:'Activity',value:'activity',icon:'⚡'},
                ]"
              />
              <p class="text-xs text-subtle mt-4">Active: <span class="font-mono text-brand-400">{{ demoViewTab }}</span></p>
            </div>
          </section>

          <!-- ── Radio Card ─────────────────────────────────────────────── -->
          <section id="radio-cards">
            <SectionHeader title="Radio Card" subtitle="AppRadioCard — selectable card with icon, label, description, radio" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6">
              <div class="space-y-3 max-w-md">
                <AppRadioCard v-model="demoRadioCard" value="sales" label="Sales" description="Customer meetings, demos, closing" color="brand">
                  <template #icon>💼</template>
                </AppRadioCard>
                <AppRadioCard v-model="demoRadioCard" value="presales" label="Pre-Sales" description="Technical evaluations, POCs" color="presales">
                  <template #icon>🔬</template>
                </AppRadioCard>
                <AppRadioCard v-model="demoRadioCard" value="marketing" label="Marketing" description="Events, content, campaigns" color="success">
                  <template #icon>📣</template>
                </AppRadioCard>
              </div>
              <p class="text-xs text-subtle mt-4">Selected: <span class="font-mono text-brand-400">{{ demoRadioCard }}</span></p>
            </div>
          </section>

          <!-- ── Skeleton ───────────────────────────────────────────────── -->
          <section id="skeletons">
            <SectionHeader title="Skeleton" subtitle="AppSkeleton — animated loading placeholder, 4 variants" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <p class="text-overline text-subtle mb-3">rect (default)</p>
                  <AppSkeleton height="48px" />
                </div>
                <div>
                  <p class="text-overline text-subtle mb-3">circle</p>
                  <div class="flex items-center gap-3">
                    <AppSkeleton variant="circle" width="40px" height="40px" />
                    <AppSkeleton variant="circle" width="56px" height="56px" />
                  </div>
                </div>
                <div>
                  <p class="text-overline text-subtle mb-3">text (3 lines)</p>
                  <AppSkeleton variant="text" :lines="3" height="12px" />
                </div>
                <div>
                  <p class="text-overline text-subtle mb-3">card</p>
                  <AppSkeleton variant="card" />
                </div>
              </div>
            </div>
          </section>

          <!-- ── Spacing ────────────────────────────────────────────────── -->
          <section id="spacing">
            <SectionHeader title="Spacing Scale" subtitle="4px base grid — key stops used across components" />
            <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-6">
              <div class="space-y-3">
                <div v-for="sp in spacingScale" :key="sp.token" class="flex items-center gap-4">
                  <span class="text-2xs text-subtle font-mono w-20 flex-shrink-0">{{ sp.token }}</span>
                  <div class="bg-brand-400/40 rounded flex-shrink-0" :style="{ width: sp.px + 'px', height: '16px' }" />
                  <span class="text-2xs text-subtle">{{ sp.px }}px — {{ sp.usage }}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore'
import { ChartBarIcon, BuildingStorefrontIcon, PlusIcon } from '@heroicons/vue/24/outline'
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

const themeStore = useThemeStore()

// ── Chart demos ───────────────────────────────────────────────────────────
const barSeries  = [{ name: 'Activities', data: [2, 5, 3, 8, 4, 6, 7] }]
const areaSeries = [{ name: 'Pipeline',   data: [4000, 7500, 5000, 12000, 9000, 18000, 22000] }]

const barOpts = computed(() => ({
  chart: { type: 'bar', sparkline: { enabled: true }, toolbar: { show: false }, background: 'transparent', animations: { speed: 600 } },
  plotOptions: { bar: { columnWidth: '60%', borderRadius: 3 } },
  colors: ['#3BB3E5'],
  tooltip: { theme: themeStore.isDark ? 'dark' : 'light', y: { formatter: v => `${v} activities` } },
}))

const areaOpts = computed(() => ({
  chart: { type: 'area', sparkline: { enabled: true }, toolbar: { show: false }, background: 'transparent', animations: { speed: 600 } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } },
  colors: ['#10B981'],
  tooltip: { theme: themeStore.isDark ? 'dark' : 'light', y: { formatter: v => `£${v.toLocaleString()}` } },
}))

const radialOpts = computed(() => ({
  chart: { type: 'radialBar', background: 'transparent', animations: { speed: 800 } },
  plotOptions: {
    radialBar: {
      startAngle: -135, endAngle: 135,
      hollow: { size: '55%' },
      track: { background: themeStore.isDark ? '#1E3A4A' : '#E5E7EB', strokeWidth: '100%' },
      dataLabels: {
        name:  { show: true, offsetY: -6, fontSize: '9px', color: themeStore.isDark ? '#9CA3AF' : '#6B7280', formatter: () => 'LV 3' },
        value: { show: true, offsetY: 2,  fontSize: '14px', fontWeight: 700, color: '#EAB308', formatter: () => '67%' },
      },
    },
  },
  colors: ['#EAB308'],
  stroke: { lineCap: 'round' },
  tooltip: { enabled: false },
}))

// ── Section nav ───────────────────────────────────────────────────────────
const navGroups = [
  {
    label: 'Foundations',
    items: [
      { id: 'colors',     label: 'Color Tokens' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing Scale' },
    ],
  },
  {
    label: 'Atoms',
    items: [
      { id: 'buttons',     label: 'Button' },
      { id: 'badges',      label: 'Badge' },
      { id: 'avatars',     label: 'Avatar' },
      { id: 'spinners',    label: 'Spinner' },
      { id: 'dividers',    label: 'Divider' },
    ],
  },
  {
    label: 'Forms',
    items: [
      { id: 'inputs',      label: 'Input' },
      { id: 'selects',     label: 'Select' },
      { id: 'toggles',     label: 'Toggle' },
      { id: 'checkboxes',  label: 'Checkbox' },
      { id: 'progress',    label: 'Progress Bar' },
    ],
  },
  {
    label: 'Molecules',
    items: [
      { id: 'cards',       label: 'Card' },
      { id: 'form-fields', label: 'Form Field' },
      { id: 'empty-states',label: 'Empty State' },
    ],
  },
  {
    label: 'Interaction',
    items: [
      { id: 'chips',           label: 'Chip',            slug: 'chip' },
      { id: 'info-chips',      label: 'Info Chip',       slug: 'info-chip' },
      { id: 'segment-control', label: 'Segment Control', slug: 'segment-control' },
      { id: 'view-tabs',       label: 'View Tabs',       slug: 'view-tabs' },
      { id: 'radio-cards',     label: 'Radio Card',      slug: 'radio-card' },
      { id: 'skeletons',       label: 'Skeleton',        slug: 'skeleton' },
    ],
  },
]

const allSections = navGroups.flatMap(g => g.items)

// ── Demo state for new components ─────────────────────────────────────────
const demoChipTags     = ref(['Vue 3', 'Tailwind', 'Pinia'])
const demoSegmentVal   = ref('mine')
const demoViewTab      = ref('overview')
const demoRadioCard    = ref('sales')
function removeChipTag(tag) {
  const idx = demoChipTags.value.indexOf(tag)
  if (idx > -1) demoChipTags.value.splice(idx, 1)
}
const activeSection = ref('colors')
const mobileSection = ref('')

function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = 80 // topbar height + buffer
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

// ── IntersectionObserver to track active section ──────────────────────────
let observer = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  )
  allSections.forEach(sec => {
    const el = document.getElementById(sec.id)
    if (el) observer.observe(el)
  })
})
onUnmounted(() => observer?.disconnect())

// ── Demo state ────────────────────────────────────────────────────────────
const demo = reactive({
  text: '', errorText: '', small: '', large: '',
  clearable: 'Type to clear…', disabled: 'Read only value',
  select: '', selectError: '',
  check1: true, check2: false,
  vendor: '', actType: '', notes: '',
})

const toggleDemos = reactive([
  { label: 'Dark Mode',    desc: 'Switch app theme',      value: true,  size: 'md', color: 'bg-brand-400' },
  { label: 'Email Digest', desc: 'Weekly summary emails', value: false, size: 'md', color: 'bg-brand-400' },
  { label: 'Compact (sm)', desc: 'size="sm"',             value: true,  size: 'sm', color: 'bg-success' },
  { label: 'Large (lg)',   desc: 'size="lg"',             value: false, size: 'lg', color: 'bg-reward' },
])

// ── Data ──────────────────────────────────────────────────────────────────
const colorTokens = [
  { name: 'brand-400',           hex: '#3BB3E5', usage: 'Primary CTAs, active nav' },
  { name: 'success',             hex: '#10B981', usage: 'Positive, completed' },
  { name: 'warning',             hex: '#F59E0B', usage: 'Caution, pending' },
  { name: 'danger',              hex: '#EF4444', usage: 'Errors, destructive' },
  { name: 'reward',              hex: '#EAB308', usage: 'Points, gamification' },
  { name: 'presales',            hex: '#A78BFA', usage: 'Pre-Sales category' },
  { name: 'surface-dark-base',   hex: '#071318', usage: 'Body bg (dark)' },
  { name: 'surface-dark-raised', hex: '#0D1E27', usage: 'Cards (dark)' },
  { name: 'surface-dark-border', hex: '#1E3A4A', usage: 'Borders (dark)' },
  { name: 'surface-light-base',  hex: '#F9FAFB', usage: 'Body bg (light)' },
  { name: 'surface-light-raised',hex: '#FFFFFF', usage: 'Cards (light)' },
  { name: 'surface-light-border',hex: '#E5E7EB', usage: 'Borders (light)' },
]

const typeScale = [
  { class: 'text-3xl font-bold',    sample: 'Display — 30px bold' },
  { class: 'text-2xl font-bold',    sample: 'Heading 1 — 24px bold' },
  { class: 'text-xl font-semibold', sample: 'Heading 2 — 20px semibold' },
  { class: 'text-lg font-semibold', sample: 'Heading 3 — 18px semibold' },
  { class: 'text-base font-medium', sample: 'Body Large — 16px medium' },
  { class: 'text-sm',               sample: 'Body — 14px regular (default)' },
  { class: 'text-xs',               sample: 'Caption — 12px regular' },
  { class: 'text-2xs font-mono',    sample: 'Mono XS — 10px (labels, code)' },
]

const spacingScale = [
  { token: 'p-1',   px: 4,  usage: 'Icon internal padding' },
  { token: 'p-2',   px: 8,  usage: 'Badge padding' },
  { token: 'p-3',   px: 12, usage: 'Button horizontal padding (sm)' },
  { token: 'p-4',   px: 16, usage: 'Button horizontal padding (md)' },
  { token: 'p-5',   px: 20, usage: 'Default card padding' },
  { token: 'p-6',   px: 24, usage: 'Large section / form padding' },
  { token: 'gap-2', px: 8,  usage: 'Button icon gap' },
  { token: 'gap-3', px: 12, usage: 'Dense grid gap' },
  { token: 'gap-4', px: 16, usage: 'Default grid gap' },
  { token: 'gap-6', px: 24, usage: 'Section gap' },
  { token: 'mb-8',  px: 32, usage: 'Section margin-bottom' },
]

// ── Section header component (inline) ─────────────────────────────────────
const SectionHeader = {
  props: ['title', 'subtitle'],
  template: `
    <div class="mb-5">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
      <p class="text-sm text-subtle mt-0.5">{{ subtitle }}</p>
    </div>
  `,
}
</script>

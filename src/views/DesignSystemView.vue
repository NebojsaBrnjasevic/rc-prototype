<template>
  <AppLayout>
    <div class="flex gap-8 min-h-screen">

      <!-- ── Sticky left sidebar ─────────────────────────────────────────── -->
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
              class="block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all text-subtle hover:text-fg hover:bg-surface-2"
            >{{ item.label }}</router-link>
          </div>

          <div class="px-3 pt-3 mt-2 border-t border-line">
            <AppBadge color="brand" size="xs">v1.3 · 30 components</AppBadge>
          </div>
        </div>
      </aside>

      <!-- ── Main content — index grid ─────────────────────────────────────── -->
      <main class="flex-1 min-w-0 pb-24">

        <!-- Header -->
        <div class="flex items-start justify-between mb-2">
          <div>
            <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">Design System</h1>
            <p class="text-sm text-subtle mt-1">Atomic component library for Race Control · Vue 3 + Tailwind CSS</p>
          </div>
          <AppBadge color="brand">v1.3</AppBadge>
        </div>

        <!-- Quick stats -->
        <div class="flex gap-4 mb-8 text-xs text-subtle">
          <span>30 components · 4 foundations</span>
          <span>·</span>
          <span>Dark / Light mode</span>
          <span>·</span>
          <span>WCAG AA</span>
          <span>·</span>
          <span>Storybook-style docs</span>
        </div>

        <!-- Groups -->
        <div class="space-y-10">
          <div v-for="group in navGroups" :key="group.label">
            <p class="text-overline text-subtle mb-3">{{ group.label }}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <router-link
                v-for="item in group.items"
                :key="item.slug"
                :to="'/ds/' + item.slug"
                class="group flex items-center gap-3 p-4 rounded-xl border border-line bg-surface-1 hover:border-brand/50 hover:bg-surface-2  transition-all"
              >
                <!-- Color dot -->
                <div
                  class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm"
                  :style="{ background: item.color + '22', color: item.color }"
                >{{ item.icon }}</div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-fg group-hover:text-brand transition-colors">{{ item.label }}</p>
                  <p class="text-xs text-subtle truncate mt-0.5">{{ item.description }}</p>
                </div>
                <svg class="w-4 h-4 text-fg-muted group-hover:text-brand ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>
          </div>
        </div>

      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'

const navGroups = [
  {
    label: 'Foundations',
    items: [
      { slug: 'colors',     label: 'Color Tokens', description: 'Theme-aware semantic tokens — surfaces, text, brand, reward, podium', icon: '◐', color: '#3BB3E5' },
      { slug: 'typography', label: 'Typography',   description: 'Unbounded · Manrope · JetBrains Mono — display, UI, time',  icon: 'Aa',  color: '#A78BFA' },
      { slug: 'spacing',    label: 'Spacing Scale', description: '4px base grid — key stops used across components',                   icon: '▦',  color: '#10B981' },
      { slug: 'icons',      label: 'Iconography',   description: 'Heroicons 24 outline — variants, sizes, colour, catalog of meanings',  icon: '✦',  color: '#F5B623' },
    ],
  },
  {
    label: 'Atoms',
    items: [
      { slug: 'button',   label: 'Button',   description: '5 variants (incl. reward) × 3 sizes, loading and disabled', icon: '▶', color: '#3BB3E5' },
      { slug: 'stat-card', label: 'Stat Card', description: 'Single KPI with display-font value, reward tone', icon: '#', color: '#3BB3E5' },
      { slug: 'data-table', label: 'Data Table', description: 'Table with cell slots, responsive columns, caption', icon: '▦', color: '#3BB3E5' },
      { slug: 'badge',    label: 'Badge',    description: 'Semantic status label — colors, dot indicator, 3 sizes', icon: '●', color: '#10B981' },
      { slug: 'avatar',   label: 'Avatar',   description: 'User initials with deterministic color hash, 5 sizes', icon: '◯', color: '#A78BFA' },
      { slug: 'spinner',  label: 'Spinner',  description: 'Animated loading indicator — 4 sizes, 3 colors', icon: '⟳', color: '#F59E0B' },
      { slug: 'divider',  label: 'Divider',  description: 'Thin separator — horizontal or vertical, optional label', icon: '─', color: '#6B7280' },
      { slug: 'skeleton', label: 'Skeleton', description: 'Loading placeholder — text, rect, circle, card variants', icon: '▭', color: '#6B7280' },
    ],
  },
  {
    label: 'Forms',
    items: [
      { slug: 'input',      label: 'Input',        description: 'Text field with slots, error state, clearable', icon: '▤', color: '#3BB3E5' },
      { slug: 'textarea',   label: 'Textarea',     description: 'Multi-line field — same look as Input', icon: '¶', color: '#3BB3E5' },
      { slug: 'combobox',   label: 'Combobox',     description: 'Searchable single / multi picker — value-in-field vs chips', icon: '⌕', color: '#3BB3E5' },
      { slug: 'select',     label: 'Select',       description: 'Dropdown for predefined option lists', icon: '▾', color: '#3BB3E5' },
      { slug: 'toggle',     label: 'Toggle',       description: 'Binary switch for immediate-effect settings', icon: '⏻', color: '#10B981' },
      { slug: 'checkbox',   label: 'Checkbox',     description: 'Multi-select and acknowledgement, supports indeterminate', icon: '▤', color: '#3BB3E5' },
      { slug: 'progress',   label: 'Progress Bar', description: 'Linear 0–100% — quota, completion, upload', icon: '▬', color: '#10B981' },
      { slug: 'form-field', label: 'Form Field',   description: 'Label + hint + error wrapper for any input', icon: '▤', color: '#6B7280' },
    ],
  },
  {
    label: 'Interaction',
    items: [
      { slug: 'chip',            label: 'Chip',            description: 'Pill label — 7 variants, removable, count badge', icon: '◇', color: '#3BB3E5' },
      { slug: 'info-chip',       label: 'Info Chip',       description: 'Directional data chip — ↗ trend indicator', icon: '↗', color: '#10B981' },
      { slug: 'segment-control', label: 'Segment Control', description: 'Pill-group switcher — My Activities / Team', icon: '⊙', color: '#3BB3E5' },
      { slug: 'view-tabs',       label: 'View Tabs',       description: 'Underline tabs — Table / Calendar / Kanban', icon: '⊟', color: '#3BB3E5' },
      { slug: 'radio-card',      label: 'Radio Card',      description: 'Selectable card with icon, title, description', icon: '◉', color: '#A78BFA' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { slug: 'modal',   label: 'Modal',   description: 'Centered dialog — focus in / out, Esc, pinned footer', icon: '▢', color: '#3BB3E5' },
      { slug: 'drawer',  label: 'Drawer',  description: 'Side panel for details and secondary forms', icon: '▐', color: '#3BB3E5' },
      { slug: 'popover', label: 'Popover', description: 'Click-to-open panel — filters, quick settings', icon: '◫', color: '#3BB3E5' },
      { slug: 'toast',   label: 'Toast',   description: 'Bottom-right confirmation via ui.toast()', icon: '✓', color: '#10B981' },
    ],
  },
  {
    label: 'Gamification',
    items: [
      { slug: 'period-tabs', label: 'Period Tabs', description: 'Week / Month / Quarter / Year switch with elapsed bars', icon: '▤', color: '#3BB3E5' },
      { slug: 'countdown',   label: 'Countdown',   description: 'Live mono-tile timer to the end of a race', icon: '◷', color: '#3BB3E5' },
      { slug: 'xp-bar',      label: 'XP Bar',      description: 'Gold level progress fed from auth.levelInfo', icon: '▤', color: '#F5B623' },
      { slug: 'reward-box',  label: 'Reward Box',  description: 'Animated daily-bonus box with claim burst', icon: '◆', color: '#F5B623' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { slug: 'empty-state', label: 'Empty State', description: 'Zero-state UI with icon, title, and action slot', icon: '○', color: '#6B7280' },
    ],
  },
]
</script>

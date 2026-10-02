<template>
  <div class="space-y-4">
    <!-- Type filter -->
    <div role="group" aria-label="Filter events by type" class="flex flex-wrap gap-2">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        :aria-pressed="type === f.value"
        :class="[
          'h-9 px-3.5 rounded-full text-sm font-bold flex items-center gap-2 border transition-colors',
          type === f.value ? 'bg-brand/10 border-brand text-fg' : 'bg-surface-1 border-line text-fg-2 hover:text-fg',
        ]"
        @click="type = f.value"
      >
        {{ f.label }}
        <span class="text-xs tabular text-fg-muted">{{ f.count }}</span>
      </button>
    </div>

    <section class="card px-6 py-2" aria-label="Audit log">
      <AdminEventRow v-for="e in filtered" :key="e.id" :event="e" />
      <p v-if="!filtered.length" class="py-10 text-center text-fg-2">No events of this type.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore, AUDIT_TYPES } from '@/stores/useAdminStore'
import AdminEventRow from './AdminEventRow.vue'

const admin = useAdminStore()
const type = ref('all')

const filters = computed(() => [
  { value: 'all', label: 'All', count: admin.auditLog.length },
  ...Object.entries(AUDIT_TYPES)
    .map(([value, meta]) => ({ value, label: meta.label, count: admin.auditLog.filter((e) => e.type === value).length }))
    .filter((f) => f.count > 0),
])

const filtered = computed(() => (type.value === 'all' ? admin.auditLog : admin.auditLog.filter((e) => e.type === type.value)))
</script>

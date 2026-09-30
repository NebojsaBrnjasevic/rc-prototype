<template>
  <div class="w-full overflow-x-auto rounded-xl border border-surface-light-border dark:border-surface-dark-border">
    <table class="w-full text-sm">
      <!-- Head -->
      <thead class="border-b border-surface-light-border dark:border-surface-dark-border">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              'px-4 py-3 text-left text-overline text-subtle font-semibold',
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '',
            ]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="row.id ?? i"
          :class="[
            'border-b last:border-0 border-surface-light-border dark:border-surface-dark-border',
            clickable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-dark-overlay transition-colors' : '',
          ]"
          @click="clickable ? $emit('row-click', row) : undefined"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[
              'px-4 py-3 text-gray-700 dark:text-gray-300',
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '',
            ]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-subtle">
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  /**
   * Array of { key, label, align? } objects
   */
  columns: { type: Array, required: true },
  /**
   * Array of row data objects — each should have an 'id' for stable keying
   */
  rows: { type: Array, default: () => [] },
  /** Make rows clickable — emits 'row-click' with the row object */
  clickable: Boolean,
  emptyText: { type: String, default: 'No data to display.' },
})

defineEmits(['row-click'])
</script>

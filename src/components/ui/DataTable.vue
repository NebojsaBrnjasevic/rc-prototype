<template>
  <div class="relative w-full overflow-x-auto rounded-card border border-line bg-surface-1">
    <table class="w-full text-sm">
      <caption v-if="caption" class="sr-only">{{ caption }}</caption>
      <!-- Head -->
      <thead class="border-b border-line">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            :class="[
              'px-4 py-3 text-left text-overline text-fg-muted whitespace-nowrap',
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '',
              col.class,
            ]"
          >
            <span :class="col.srOnly && 'sr-only'">{{ col.label }}</span>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="row.id ?? i"
          :class="[
            'border-b last:border-0 border-line',
            clickable ? 'cursor-pointer hover:bg-surface-2 transition-colors' : '',
          ]"
          @click="clickable ? $emit('row-click', row) : undefined"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[
              'px-4 py-3 text-fg-2',
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '',
              col.class,
            ]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-fg-2">
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
   * Array of { key, label, align?, class?, srOnly? } objects
   * class is applied to both th and td (e.g. 'hidden lg:table-cell')
   */
  columns: { type: Array, required: true },
  /**
   * Array of row data objects — each should have an 'id' for stable keying
   */
  rows: { type: Array, default: () => [] },
  /** Make rows clickable — emits 'row-click' with the row object */
  clickable: Boolean,
  emptyText: { type: String, default: 'No data to display.' },
  /** Screen-reader caption for the table */
  caption: { type: String, default: null },
})

defineEmits(['row-click'])
</script>

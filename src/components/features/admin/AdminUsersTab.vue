<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row lg:items-center gap-3">
      <AppInput v-model="search" class="lg:w-80" placeholder="Search name or email" aria-label="Search users" clearable>
        <template #leading><MagnifyingGlassIcon class="w-[18px] h-[18px]" /></template>
      </AppInput>
      <AppSelect v-model="role" class="lg:w-44" :options="roleOptions" aria-label="Filter by role" />
      <AppSegmentControl v-model="status" :options="statusOptions" aria-label="Filter by status" />
      <AppButton class="lg:ml-auto" @click="inviteOpen = true">
        <UserPlusIcon class="w-[18px] h-[18px]" />Invite user
      </AppButton>
    </div>

    <DataTable :columns="columns" :rows="filtered" caption="Users" empty-text="No users match these filters.">
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3 min-w-[220px]">
          <AppAvatar :name="row.name" size="md" />
          <div class="min-w-0">
            <p class="text-[15px] font-bold text-fg truncate">
              {{ row.name }}<span v-if="row.id === meId" class="text-brand"> (you)</span>
            </p>
            <p class="text-[13px] text-fg-muted truncate">{{ row.email }}</p>
          </div>
        </div>
      </template>
      <template #cell-role="{ value }">
        <AppBadge :color="value === 'Admin' ? 'brand' : value === 'Manager' ? 'reward' : 'neutral'" :pill="false">{{ value }}</AppBadge>
      </template>
      <template #cell-level="{ value }">
        <span class="font-bold text-fg tabular">Lv {{ value }}</span>
      </template>
      <template #cell-points="{ value }">
        <span class="font-display font-bold text-reward tabular">{{ value.toLocaleString('en-GB') }}</span>
      </template>
      <template #cell-status="{ value }">
        <AppBadge :color="value === 'Active' ? 'success' : 'neutral'" dot>{{ value }}</AppBadge>
      </template>
      <template #cell-actions="{ row }">
        <button
          type="button"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors"
          :aria-label="`Actions for ${row.name}`"
        >
          <EllipsisHorizontalIcon class="w-5 h-5" />
        </button>
      </template>
    </DataTable>

    <p class="text-[13px] text-fg-muted px-1">
      Showing {{ filtered.length }} of {{ admin.stats.users.total }} users
    </p>
    <!-- TODO: invite modal + pagination once the users API exists -->
    <p v-if="inviteOpen" class="hidden">Invite modal placeholder</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon, UserPlusIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '@/stores/useAdminStore'
import { useAuthStore } from '@/stores/useAuthStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppSegmentControl from '@/components/ui/AppSegmentControl.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import DataTable from '@/components/ui/DataTable.vue'

const admin = useAdminStore()
const auth = useAuthStore()
const meId = computed(() => admin.users.find((u) => u.email === auth.user?.email)?.id)

const search = ref('')
const role = ref('all')
const status = ref('all')
const inviteOpen = ref(false)

const roleOptions = [
  { value: 'all', label: 'All roles' },
  { value: 'Admin', label: 'Admins' },
  { value: 'Manager', label: 'Managers' },
  { value: 'Member', label: 'Members' },
]
const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const columns = [
  { key: 'name', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'territory', label: 'Territory', class: 'hidden lg:table-cell whitespace-nowrap' },
  { key: 'level', label: 'Level', class: 'hidden md:table-cell' },
  { key: 'points', label: 'Points', align: 'right' },
  { key: 'status', label: 'Status', class: 'hidden sm:table-cell' },
  { key: 'lastActive', label: 'Last active', class: 'hidden xl:table-cell whitespace-nowrap' },
  { key: 'actions', label: 'Actions', srOnly: true, align: 'right' },
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return admin.users
    .filter((u) => role.value === 'all' || u.role === role.value)
    .filter((u) => status.value === 'all' || u.status === status.value)
    .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    .sort((a, b) => b.points - a.points)
})
</script>

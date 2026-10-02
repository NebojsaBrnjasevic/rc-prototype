<template>
  <div class="relative flex h-screen overflow-hidden bg-page transition-colors duration-250">

    <!-- Sidebar (includes its own mobile backdrop) -->
    <AppSidebar />

    <!-- Main area: offset by sidebar width on md/lg -->
    <div
      :class="[
        'flex flex-col flex-1 min-w-0 md:ml-16 transition-[margin] duration-200',
        uiStore.sidebarCollapsed ? '' : 'lg:ml-64',
      ]"
    >

      <!-- Topbar (in flow, not fixed) -->
      <AppTopbar />

      <!-- Scrollable content -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8">
          <slot />
        </div>
      </main>

    </div>

    <!-- App-wide overlays: Log activity, activity details, toasts -->
    <ActivityModal />
    <ActivityDrawer />
    <AppToaster />
  </div>
</template>

<script setup>
import AppTopbar from './AppTopbar.vue'
import AppSidebar from './AppSidebar.vue'
import ActivityModal from '@/components/features/activity/ActivityModal.vue'
import ActivityDrawer from '@/components/features/activity/ActivityDrawer.vue'
import AppToaster from '@/components/ui/AppToaster.vue'
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()
</script>

<template>
  <AppLayout>
    <div v-if="vendor">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs text-subtle mb-5">
        <RouterLink to="/directory" class="hover:text-brand-400 transition-colors">Directory</RouterLink>
        <span>·</span>
        <span class="text-gray-700 dark:text-gray-300">{{ vendor.name }}</span>
      </div>

      <!-- Vendor header card -->
      <div class="card p-5 mb-5">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <AppAvatar :name="vendor.name" size="lg" />
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ vendor.name }}</h1>
                <AppBadge color="neutral">{{ vendor.type }}</AppBadge>
                <AppBadge color="success">{{ vendor.status }}</AppBadge>
              </div>
              <a :href="vendor.website" target="_blank" rel="noopener"
                class="text-xs text-brand-400 hover:text-brand-500 mt-0.5 inline-block">
                {{ vendor.website }} ↗
              </a>
            </div>
          </div>
          <!--
            UX FIX: Pre-populate vendor context when opening the activity modal from here.
            Pass :prefill="{ vendor: vendor.name }" to ActivityModal.
          -->
          <AppButton @click="followUpOpen = true">Create Follow-up</AppButton>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-surface-light-border dark:border-surface-dark-border">
          <StatCard label="Activities" :value="vendor.activities" />
          <StatCard label="Last Activity" :value="vendor.lastActivity" />
          <StatCard label="Dominant Signal" :value="vendor.dominantSignal" />
          <StatCard label="Connected Partners" :value="vendor.connectedPartners" />
        </div>
      </div>

      <!-- TODO: Implement -->
      <!-- <EngagementSnapshot :vendor="vendor" /> -->
      <!-- <VendorActivityList :vendorId="vendor.id" /> -->

      <div class="card p-10 text-center text-subtle">
        <p class="text-sm">Implement EngagementSnapshot + VendorActivityList components here.</p>
      </div>
    </div>

    <div v-else class="py-20 text-center text-subtle">
      <p class="text-sm">Vendor not found.</p>
      <RouterLink to="/directory" class="text-xs text-brand-400 hover:text-brand-500 mt-2 inline-block">← Back to Directory</RouterLink>
    </div>

    <!-- TODO: <ActivityModal v-model="followUpOpen" :prefill="{ vendor: vendor?.name }" /> -->
  </AppLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDirectoryStore } from '@/stores/useDirectoryStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import StatCard from '@/components/ui/StatCard.vue'

const route = useRoute()
const directoryStore = useDirectoryStore()
const vendor = computed(() => directoryStore.getVendorById(route.params.id))
const followUpOpen = ref(false)
</script>

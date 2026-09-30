<template>
  <AppLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      <!-- Identity card -->
      <div class="card p-5 mb-4">
        <div class="flex items-center gap-4 mb-4">
          <AppAvatar :name="auth.user?.name ?? ''" size="xl" />
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ auth.user?.name }}</h2>
            <p class="text-sm text-subtle">{{ auth.user?.email }}</p>
            <AppBadge v-if="auth.user?.isAdmin" color="brand" size="xs" class="mt-1">Admin</AppBadge>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm border-t border-surface-light-border dark:border-surface-dark-border pt-4">
          <div>
            <p class="text-overline text-subtle">Territory</p>
            <p class="text-gray-700 dark:text-gray-300 mt-1">{{ auth.user?.territory }}</p>
          </div>
          <div>
            <p class="text-overline text-subtle">Member since</p>
            <p class="text-gray-700 dark:text-gray-300 mt-1">{{ auth.user?.memberSince }}</p>
          </div>
        </div>
      </div>

      <!-- Gamification -->
      <div class="card p-5 mb-4">
        <p class="text-overline text-subtle mb-3">Rewards & Progress</p>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-reward tabular-nums">{{ auth.user?.points?.toLocaleString() }}</p>
            <p class="text-xs text-subtle mt-0.5">Total Points</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-brand-400">{{ auth.user?.level }}</p>
            <p class="text-xs text-subtle mt-0.5">Level</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">🔥 {{ auth.user?.streak }}</p>
            <p class="text-xs text-subtle mt-0.5">Day Streak</p>
          </div>
        </div>
        <div class="mt-4">
          <AppProgressBar label="Progress to Level 4" :value="40" show-value color="brand" />
        </div>
        <!-- Daily bonus -->
        <div class="mt-4 flex items-center justify-between rounded-xl bg-reward/10 border border-reward/20 p-3">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Daily Bonus</p>
            <p class="text-xs text-subtle">Ready to claim</p>
          </div>
          <AppButton variant="primary" size="sm">Claim Bonus</AppButton>
        </div>
      </div>

      <!-- Security — TODO: implement MFA, passkey management -->
      <div class="card p-5">
        <p class="text-overline text-subtle mb-3">Security</p>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Authenticator App</p>
              <p class="text-xs text-subtle">Two-factor authentication</p>
            </div>
            <AppBadge color="success">Active</AppBadge>
          </div>
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Passkeys</p>
              <p class="text-xs text-subtle">Biometric sign-in</p>
            </div>
            <AppButton variant="secondary" size="sm">+ Add</AppButton>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'

const auth = useAuthStore()
</script>

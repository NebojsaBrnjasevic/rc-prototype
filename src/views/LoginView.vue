<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-light-base dark:bg-surface-dark-base px-4">
    <div class="w-full max-w-sm">
      <div class="flex justify-center mb-8">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-brand-400 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-900 dark:text-white">Race Control</span>
        </div>
      </div>

      <div class="card p-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Sign in</h1>
        <p class="text-sm text-subtle mb-5">Welcome back. Enter your credentials to continue.</p>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input v-model="email" type="email" required autocomplete="email"
              class="w-full h-10 px-3 text-sm rounded-xl border border-surface-light-border dark:border-surface-dark-border
                bg-white dark:bg-surface-dark-overlay text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-brand-400 transition"
              placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input v-model="password" type="password" required autocomplete="current-password"
              class="w-full h-10 px-3 text-sm rounded-xl border border-surface-light-border dark:border-surface-dark-border
                bg-white dark:bg-surface-dark-overlay text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-brand-400 transition"
              placeholder="••••••••" />
          </div>
          <AppButton type="submit" full-width :loading="loading">Sign in</AppButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AppButton from '@/components/ui/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  const result = await auth.signIn(email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push(route.query.redirect ?? '/')
  }
}
</script>

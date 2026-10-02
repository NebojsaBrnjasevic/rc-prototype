<template>
  <main class="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-page">
    <img :src="logoUrl" alt="" class="h-12 w-auto mb-8 opacity-80" width="34" height="48" />
    <p class="font-display font-bold text-[96px] leading-none text-brand tabular">404</p>
    <h1 class="font-display font-bold text-[28px] tracking-tight mt-4">Off the track</h1>
    <p class="text-[15px] text-fg-2 mt-2 max-w-sm">This page doesn't exist, or you don't have permission to view it.</p>
    <AppButton :tag="RouterLink" to="/" class="mt-8">
      <ArrowLeftIcon class="w-4 h-4" />Back to Home
    </AppButton>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import logoUrl from '@/assets/logo.svg'
import AppButton from '@/components/ui/AppButton.vue'
</script>

<template>
  <AppLayout>
    <!-- Page header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {{ auth.user?.name?.split(' ')[0] }} 👋
        </h1>
        <p class="mt-1 text-sm text-subtle">
          See the activity momentum, follow-up discipline, and recognition shaping your week.
        </p>
      </div>
      <AppButton @click="activityModalOpen = true">
        + New Activity
      </AppButton>
    </div>

    <!-- Scope toggle -->
    <div class="flex items-center gap-2 mb-5">
      <button
        v-for="s in ['my', 'team']"
        :key="s"
        :class="[
          'px-3 h-8 rounded-lg text-sm font-medium transition-colors capitalize',
          scope === s
            ? 'bg-gray-100 dark:bg-surface-dark-overlay text-gray-900 dark:text-white'
            : 'text-subtle hover:text-gray-700 dark:hover:text-gray-200',
        ]"
        @click="scope = s"
      >
        {{ s === 'my' ? 'My Activity' : 'Team Activity' }}
      </button>
    </div>

    <!-- Two-column layout: main + sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

      <!-- Left: KPI cards + recent activity -->
      <div class="space-y-5">

        <!-- KPI stat cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Activities"
            :value="activityStore.stats.total"
            sublabel="This month"
          />
          <StatCard
            label="Top Activity Type"
            :value="activityStore.stats.topType ?? '—'"
            sublabel="By volume"
          />
          <StatCard
            label="Pipeline Generated"
            :value="activityStore.stats.pipelineInfluenced > 0 ? '£' + activityStore.stats.pipelineInfluenced.toLocaleString() : '£0'"
            sublabel="This month"
          />
          <StatCard
            label="Total Points"
            :value="auth.user?.points?.toLocaleString() ?? '0'"
            sublabel="All time"
          />
        </div>

        <!-- Recent activity -->
        <div class="card p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs text-subtle uppercase tracking-widest font-semibold">Pipeline</p>
              <h2 class="text-base font-semibold text-gray-900 dark:text-white mt-0.5">Recent activity</h2>
              <p class="text-xs text-subtle">Your latest activity, follow-up commitments, and linked opportunities.</p>
            </div>
            <RouterLink to="/activity" class="text-xs text-brand-400 hover:text-brand-500 font-medium flex items-center gap-1">
              View all
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </RouterLink>
          </div>

          <!-- TODO: Replace with <ActivityList :activities="activityStore.filtered" /> -->
          <div v-if="activityStore.filtered.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
            <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center">
              <svg class="w-5 h-5 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p class="text-sm text-subtle">No activities yet</p>
            <AppButton size="sm" @click="activityModalOpen = true">+ Create your first activity</AppButton>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="act in activityStore.filtered.slice(0, 5)"
              :key="act.id"
              class="flex items-center justify-between py-3 border-b last:border-0 border-surface-light-border dark:border-surface-dark-border"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ act.vendor }}</p>
                <p class="text-xs text-subtle truncate">{{ act.type }} · {{ act.date }}</p>
              </div>
              <AppBadge :color="act.recordType === 'Completed' ? 'success' : 'brand'">
                {{ act.recordType }}
              </AppBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: sidebar widgets -->
      <div class="space-y-4">

        <!-- Period Progress -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-overline text-subtle">Period elapsed</p>
            <!-- UX FIX: Label clarifies these are time-elapsed bars, not completion % -->
            <RouterLink to="/activity" class="text-xs text-brand-400 font-medium">+ Log activity</RouterLink>
          </div>
          <div class="space-y-3">
            <AppProgressBar label="Week" :value="35" show-value size="sm" color="brand" />
            <AppProgressBar label="Month" :value="98" show-value size="sm" color="warning" />
            <AppProgressBar label="Quarter" :value="99" show-value size="sm" color="warning" />
          </div>
          <p class="text-2xs text-subtle mt-2">Time remaining in each period — log now to hit targets.</p>
        </div>

        <!-- Level & Points -->
        <div class="card p-4">
          <p class="text-overline text-subtle mb-3">Your progress</p>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-brand-400/10 flex items-center justify-center">
              <span class="text-xl font-bold text-brand-400">{{ auth.user?.level ?? 1 }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Level {{ auth.user?.level }}</p>
              <p class="text-xs text-subtle">{{ auth.user?.points?.toLocaleString() }} pts · 300 to next level</p>
            </div>
          </div>
          <AppProgressBar :value="40" color="brand" size="sm" />
        </div>

        <!-- Leaderboard -->
        <div class="card p-4">
          <p class="text-overline text-subtle mb-3">Leading this week</p>
          <!-- TODO: Replace with real leaderboard data from API -->
          <div class="space-y-2">
            <div
              v-for="(entry, i) in leaderboard"
              :key="entry.name"
              class="flex items-center gap-2.5"
            >
              <span class="text-xs font-bold text-subtle w-4 tabular-nums">{{ i + 1 }}</span>
              <AppAvatar :name="entry.name" size="xs" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 dark:text-white truncate">{{ entry.name }}</p>
                <p class="text-2xs text-subtle">{{ entry.activities }} activities</p>
              </div>
              <span class="text-xs font-semibold text-reward tabular-nums">{{ entry.points.toLocaleString() }}</span>
            </div>
          </div>
          <RouterLink to="/dashboards" class="block mt-3 text-xs text-brand-400 hover:text-brand-500 font-medium">
            View full rankings →
          </RouterLink>
        </div>

      </div>
    </div>

    <!-- TODO: Wire up <ActivityModal v-model="activityModalOpen" /> -->
    <p v-if="activityModalOpen" class="hidden">Activity modal placeholder — implement ActivityModal component</p>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useActivityStore } from '@/stores/useActivityStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'

const auth = useAuthStore()
const activityStore = useActivityStore()

const scope = ref('my')
const activityModalOpen = ref(false)

// TODO: replace with real leaderboard API data
const leaderboard = [
  { name: 'Wolfgang Hohenthanner', points: 1400, activities: 11 },
  { name: 'Chris Faulkner',        points: 300,  activities: 3  },
  { name: 'Darren Goswell',        points: 200,  activities: 2  },
  { name: 'Arno van Doorn',        points: 200,  activities: 2  },
]
</script>

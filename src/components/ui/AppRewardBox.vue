<template>
  <div
    class="relative inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <button
      type="button"
      :class="[
        'reward-box relative inline-flex items-center justify-center rounded-control flex-shrink-0 select-none',
        size === 'sm' ? 'w-9 h-9' : 'w-11 h-11',
        available || bursting
          ? ['bg-reward-fill text-reward-on', available && animate && 'is-idle']
          : 'bg-surface-2 border border-line text-fg-muted cursor-default',
        bursting && 'is-bursting',
      ]"
      :aria-disabled="!available"
      :aria-label="available ? `Claim daily bonus, ${points} points` : 'Daily bonus claimed'"
      :aria-describedby="popover ? popoverId : undefined"
      @click="onClick"
      @keydown.esc="open = false"
    >
      <!-- Shimmer sweep (clipped to the box) -->
      <span v-if="available && animate" class="shimmer" aria-hidden="true" />

      <!-- Icon: open box once claimed -->
      <GiftIcon v-if="available || bursting" :class="['icon relative', size === 'sm' ? 'w-[18px] h-[18px]' : 'w-5 h-5']" />
      <CheckIcon v-else :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'" />

      <!-- Notification dot with ping -->
      <span v-if="available && dot" class="absolute -top-1 -right-1 w-3 h-3" aria-hidden="true">
        <span v-if="animate" class="ping absolute inset-0 rounded-full bg-[#EC4899]" />
        <span class="absolute inset-0 rounded-full bg-[#EC4899] ring-2 ring-page" />
      </span>

      <!-- Claim burst: particles + floating points -->
      <template v-if="bursting">
        <span
          v-for="i in 10"
          :key="i"
          class="particle"
          :style="{ '--a': `${i * 36}deg`, '--d': `${22 + (i % 3) * 8}px` }"
          aria-hidden="true"
        />
        <span class="float-pts font-display font-bold text-reward" aria-hidden="true">+{{ points }}</span>
      </template>
    </button>

    <!-- Popover -->
    <Transition name="reward-pop">
      <div
        v-if="popover"
        v-show="open"
        :id="popoverId"
        role="tooltip"
        :class="[
          'absolute z-50 w-64 rounded-2xl border bg-surface-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-4 text-left',
          available ? 'border-reward-fill/35' : 'border-line',
          placement === 'right'
            ? 'left-full top-1/2 -translate-y-1/2 ml-3'
            : 'top-full mt-3 -left-2 sm:left-1/2 sm:-translate-x-1/2',  // left-aligned on phones so it stays on screen
        ]"
      >
        <!-- Arrow -->
        <span
          :class="[
            'absolute w-3 h-3 rotate-45 bg-surface-1 border',
            available ? 'border-reward-fill/35' : 'border-line',
            placement === 'right'
              ? '-left-[7px] top-1/2 -translate-y-1/2 border-r-0 border-t-0'
              : '-top-[7px] left-6 sm:left-1/2 sm:-translate-x-1/2 border-r-0 border-b-0',
          ]"
          aria-hidden="true"
        />

        <!-- Soft gold glow behind the content -->
        <span
          v-if="available"
          class="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,rgb(var(--rc-reward-fill)/0.14),transparent_60%)]"
          aria-hidden="true"
        />

        <div class="relative flex items-center justify-between gap-2">
          <span class="flex items-center gap-2">
            <span :class="['w-7 h-7 rounded-lg flex items-center justify-center', available ? 'bg-reward-fill text-reward-on' : 'bg-surface-3 text-fg-muted']">
              <GiftIcon class="w-4 h-4" />
            </span>
            <span class="text-sm font-extrabold">Daily bonus</span>
          </span>
          <span
            :class="['h-6 px-2 rounded-md text-[11px] font-extrabold uppercase tracking-[0.06em] flex items-center', available ? 'bg-success/15 text-success' : 'bg-surface-3 text-fg-2']"
          >{{ available ? 'Ready' : 'Claimed' }}</span>
        </div>

        <p :class="['relative font-display font-bold text-[32px] leading-none tabular mt-3', available ? 'text-reward' : 'text-fg-muted line-through decoration-2']">
          +{{ points }}<span class="text-base ml-1">pts</span>
        </p>

        <p class="relative text-[13px] text-fg-2 mt-2">
          <template v-if="available">Click the box to claim. Resets in <span class="font-mono font-bold text-fg">{{ resetIn }}</span>.</template>
          <template v-else>Next bonus in <span class="font-mono font-bold text-fg">{{ resetIn }}</span>.</template>
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { GiftIcon, CheckIcon } from '@heroicons/vue/24/outline'

/**
 * Animated reward box (daily bonus).
 * Idle: periodic wiggle + glow pulse + shimmer + pinging dot.
 * Claim: particle burst and floating "+N", then settles to the claimed state.
 * All motion is disabled under prefers-reduced-motion.
 */
const props = defineProps({
  /** Reward ready to claim */
  available: { type: Boolean, default: true },
  /** Points shown in the burst / labels */
  points:    { type: Number, default: 50 },
  /** 'sm' (36px) | 'md' (44px) */
  size:      { type: String, default: 'md' },
  /** Idle attention animation — turn off when another box on screen already animates */
  animate:   { type: Boolean, default: true },
  /** Pink notification dot */
  dot:       { type: Boolean, default: true },
  /** Show the hover / focus popover */
  popover:   { type: Boolean, default: true },
  /** 'bottom' (topbar) | 'right' (sidebar rail) */
  placement: { type: String, default: 'bottom' },
})
const emit = defineEmits(['claim'])

const bursting = ref(false)
let timer = null

// ── Popover ────────────────────────────────────────────────────────────────
const popoverId = `reward-pop-${Math.random().toString(36).slice(2, 8)}`
const open = ref(false)
let hideTimer = null
function show() { clearTimeout(hideTimer); open.value = true }
// Small delay so moving the pointer from the box to the popover doesn't flicker
function hide() { clearTimeout(hideTimer); hideTimer = setTimeout(() => { open.value = false }, 120) }

// Daily reset at local midnight — TODO: use the server's reset time
const now = ref(Date.now())
let clock = null
onMounted(() => { clock = setInterval(() => { now.value = Date.now() }, 30_000) })
const resetIn = computed(() => {
  const d = new Date(now.value)
  const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime()
  const mins = Math.max(0, Math.floor((midnight - now.value) / 60_000))
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}h ${String(mins % 60).padStart(2, '0')}m`
})

function onClick() {
  if (!props.available || bursting.value) return
  bursting.value = true
  emit('claim')
  timer = setTimeout(() => { bursting.value = false }, 900)
}
onUnmounted(() => { clearTimeout(timer); clearTimeout(hideTimer); clearInterval(clock) })
</script>

<style scoped>
.reward-box {
  overflow: visible;
  transition: transform 0.15s ease, background-color 0.2s ease;
}
.reward-box.is-idle {
  animation: reward-glow 2.4s ease-out infinite;
}
.reward-box.is-idle:hover {
  transform: translateY(-2px) scale(1.06);
}
.reward-box.is-idle .icon {
  animation: reward-wiggle 3.2s ease-in-out infinite;
  transform-origin: 50% 85%;
}

/* Shimmer — a diagonal highlight sweeping across, synced with the wiggle */
.shimmer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}
.shimmer::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
  transform: rotate(20deg);
  animation: reward-shimmer 3.2s ease-in-out infinite;
}

.ping {
  animation: reward-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Claim */
.reward-box.is-bursting .icon {
  animation: reward-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 2px;
  background: rgb(var(--rc-reward-fill));
  pointer-events: none;
  animation: reward-particle 0.75s ease-out forwards;
}
.particle:nth-child(3n) { background: #EC4899; border-radius: 99px; }
.particle:nth-child(3n + 1) { background: rgb(var(--rc-brand)); }
.float-pts {
  position: absolute;
  left: 50%;
  bottom: 100%;
  font-size: 13px;
  white-space: nowrap;
  pointer-events: none;
  animation: reward-float 0.9s ease-out forwards;
}

@keyframes reward-wiggle {
  0%, 62%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  66% { transform: translateY(-4px) rotate(-14deg) scale(1.12); }
  70% { transform: translateY(-4px) rotate(12deg) scale(1.12); }
  74% { transform: translateY(-3px) rotate(-10deg) scale(1.08); }
  78% { transform: translateY(-2px) rotate(7deg) scale(1.04); }
  82% { transform: translateY(0) rotate(-3deg) scale(1); }
  86% { transform: translateY(0) rotate(0deg); }
}
@keyframes reward-glow {
  0%   { box-shadow: 0 0 0 0 rgb(var(--rc-reward-fill) / 0.55), 0 6px 18px -6px rgb(var(--rc-reward-fill) / 0.7); }
  70%  { box-shadow: 0 0 0 10px rgb(var(--rc-reward-fill) / 0), 0 6px 18px -6px rgb(var(--rc-reward-fill) / 0.7); }
  100% { box-shadow: 0 0 0 0 rgb(var(--rc-reward-fill) / 0), 0 6px 18px -6px rgb(var(--rc-reward-fill) / 0.7); }
}
@keyframes reward-shimmer {
  0%, 60% { left: -60%; }
  80%, 100% { left: 130%; }
}
@keyframes reward-ping {
  75%, 100% { transform: scale(2.2); opacity: 0; }
}
@keyframes reward-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.45) rotate(-10deg); }
  100% { transform: scale(1) rotate(0); }
}
@keyframes reward-particle {
  0%   { transform: rotate(var(--a)) translateY(0) scale(1); opacity: 1; }
  100% { transform: rotate(var(--a)) translateY(calc(var(--d) * -1)) scale(0.3); opacity: 0; }
}
@keyframes reward-float {
  0%   { transform: translate(-50%, 6px) scale(0.8); opacity: 0; }
  25%  { transform: translate(-50%, 0) scale(1.1); opacity: 1; }
  100% { transform: translate(-50%, -22px) scale(1); opacity: 0; }
}

.reward-pop-enter-active,
.reward-pop-leave-active {
  transition: opacity 0.16s ease, translate 0.16s ease;
}
.reward-pop-enter-from,
.reward-pop-leave-to {
  opacity: 0;
  translate: 0 -4px;
}

@media (prefers-reduced-motion: reduce) {
  .reward-box,
  .reward-box *,
  .shimmer::after {
    animation: none !important;
    transition: none !important;
  }
  .reward-box.is-idle { box-shadow: 0 0 0 2px rgb(var(--rc-reward-fill) / 0.45); }
  .particle { display: none; }
}
</style>

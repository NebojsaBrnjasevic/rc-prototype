<template>
  <canvas ref="canvas" class="pointer-events-none select-none" aria-hidden="true" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Swirling flow lines: a bundle of silky lines running diagonally from the lower
 * left up to the top-right corner. They slowly twist and breathe, and part around
 * the mouse pointer. Mouse events are read from the parent element (the canvas
 * itself ignores the pointer so the content above stays clickable).
 * Canvas + requestAnimationFrame, token colours (light/dark), pauses when the tab is
 * hidden, single still frame for prefers-reduced-motion.
 */
const props = defineProps({
  lines:  { type: Number, default: 34 },
  /** Pointer influence radius, px */
  radius: { type: Number, default: 190 },
})

const canvas = ref(null)
let ctx, raf, ro, mo, host, w = 0, h = 0, dpr = 1
let dark = true
let palette = []
let origin, dir, perp, pathLen
const SAMPLES = 70
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Pointer, eased so the lines glide instead of snapping
const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, power: 0, tpower: 0 }

function readColors() {
  const css = getComputedStyle(document.documentElement)
  const v = (name) => css.getPropertyValue(name).trim().split(/\s+/).join(',')
  dark = document.documentElement.classList.contains('dark')
  palette = [v('--rc-brand'), v('--rc-presales'), v('--rc-reward-fill')].map((c) => c || '59,179,229')
}

function layout() {
  const rect = canvas.value.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = rect.width
  h = rect.height
  canvas.value.width = Math.round(w * dpr)
  canvas.value.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  origin = { x: -0.12 * w, y: 0.94 * h }
  const end = { x: 1.12 * w, y: 0.04 * h }
  const dx = end.x - origin.x
  const dy = end.y - origin.y
  pathLen = Math.hypot(dx, dy)
  dir = { x: dx / pathLen, y: dy / pathLen }
  perp = { x: -dir.y, y: dir.x }
}

function colorFor(i) {
  if (i % 11 === 5) return palette[2]          // the odd gold line
  return i % 3 === 0 ? palette[1] : palette[0] // mostly brand, some presales
}

function draw(time) {
  const t = time / 1000
  ctx.clearRect(0, 0, w, h)
  ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  mouse.x += (mouse.tx - mouse.x) * 0.12
  mouse.y += (mouse.ty - mouse.y) * 0.12
  mouse.power += (mouse.tpower - mouse.power) * 0.06

  const spread = h * 0.55
  const R = props.radius
  const pts = new Array(SAMPLES)

  for (let i = 0; i < props.lines; i++) {
    const k = i / (props.lines - 1) - 0.5 // -0.5 … 0.5 across the bundle
    const phase = i * 0.37

    let glow = 0
    for (let j = 0; j < SAMPLES; j++) {
      const s = j / (SAMPLES - 1)

      // Bundle pinches and fans out along its length — reads as a slow twist
      const pinch = 0.35 + 0.65 * Math.abs(Math.sin(s * Math.PI * 1.15 + t * 0.18 + 0.6))
      let off = k * spread * pinch
      // Two layered waves give each line its own swirl
      off += Math.sin(s * 7.0 + t * 0.55 + phase) * h * 0.035
      off += Math.sin(s * 2.6 - t * 0.32 + k * 3.1) * h * 0.06

      const along = s * pathLen
      let x = origin.x + dir.x * along + perp.x * off
      let y = origin.y + dir.y * along + perp.y * off

      // Part around the pointer
      if (mouse.power > 0.01) {
        const mx = x - mouse.x
        const my = y - mouse.y
        const d = Math.hypot(mx, my)
        if (d < R) {
          const f = (1 - d / R) ** 2 * mouse.power
          const push = f * 70
          x += (mx / (d || 1)) * push
          y += (my / (d || 1)) * push
          glow = Math.max(glow, f)
        }
      }
      pts[j] = [x, y]
    }

    // Fade in at the start, out at the end; centre lines a touch brighter
    const [sx, sy] = pts[0]
    const [ex, ey] = pts[SAMPLES - 1]
    const base = (dark ? 0.16 : 0.12) + (0.5 - Math.abs(k)) * (dark ? 0.32 : 0.22)
    const a = Math.min(1, base + glow * 0.6)
    const c = colorFor(i)
    const g = ctx.createLinearGradient(sx, sy, ex, ey)
    g.addColorStop(0, `rgba(${c},0)`)
    g.addColorStop(0.25, `rgba(${c},${a})`)
    g.addColorStop(0.7, `rgba(${c},${a})`)
    g.addColorStop(1, `rgba(${c},0)`)

    ctx.strokeStyle = g
    ctx.lineWidth = (i % 7 === 0 ? 1.6 : 1) + glow * 1.2
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let j = 1; j < SAMPLES - 1; j++) {
      const mxp = (pts[j][0] + pts[j + 1][0]) / 2
      const myp = (pts[j][1] + pts[j + 1][1]) / 2
      ctx.quadraticCurveTo(pts[j][0], pts[j][1], mxp, myp)
    }
    ctx.lineTo(ex, ey)
    ctx.stroke()
  }
}

function frame(now) {
  draw(now)
  raf = requestAnimationFrame(frame)
}

function start() {
  cancelAnimationFrame(raf)
  if (reduced) { draw(8000); return }
  raf = requestAnimationFrame(frame)
}

function onMove(e) {
  const r = canvas.value.getBoundingClientRect()
  mouse.tx = e.clientX - r.left
  mouse.ty = e.clientY - r.top
  if (mouse.power < 0.01) { mouse.x = mouse.tx; mouse.y = mouse.ty }
  mouse.tpower = 1
}
function onLeave() { mouse.tpower = 0 }
function onVisibility() {
  if (document.hidden) cancelAnimationFrame(raf)
  else start()
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  readColors()
  layout()
  start()
  ro = new ResizeObserver(() => { layout(); if (reduced) draw(8000) })
  ro.observe(canvas.value)
  mo = new MutationObserver(() => { readColors(); if (reduced) draw(8000) })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  document.addEventListener('visibilitychange', onVisibility)
  host = canvas.value.parentElement
  if (!reduced && host) {
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  mo?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
  host?.removeEventListener('pointermove', onMove)
  host?.removeEventListener('pointerleave', onLeave)
})
</script>

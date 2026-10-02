import {
  ArrowTrendingUpIcon, ViewfinderCircleIcon, MegaphoneIcon,
  BuildingStorefrontIcon, BuildingOffice2Icon, UserGroupIcon,
} from '@heroicons/vue/24/outline'

/** Visual identity per record type — full class strings so Tailwind keeps them. */
export const RECORD_STYLE = {
  Sales:       { icon: ArrowTrendingUpIcon,  text: 'text-sales',     soft: 'bg-sales/15 text-sales',         dot: 'bg-sales',     border: 'border-sales/40' },
  'Pre-Sales': { icon: ViewfinderCircleIcon, text: 'text-presales',  soft: 'bg-presales/15 text-presales',   dot: 'bg-presales',  border: 'border-presales/40' },
  Marketing:   { icon: MegaphoneIcon,        text: 'text-marketing', soft: 'bg-marketing/15 text-marketing', dot: 'bg-marketing', border: 'border-marketing/40' },
}

export const RECORD_DESCRIPTION = {
  Sales: 'Sales-related activities',
  'Pre-Sales': 'Technical pre-sales activities',
  Marketing: 'Marketing and promotional activities',
}

const DAY = 86_400_000

export function formatDate(iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(iso).toLocaleDateString('en-GB', opts)
}

/** "today", "1 day ago", "in 3 days", "2 months ago" */
export function relativeDays(iso, now = Date.now()) {
  const d = Math.round((new Date(iso).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / DAY)
  if (d === 0) return 'today'
  const abs = Math.abs(d)
  const unit = abs >= 60 ? [Math.round(abs / 30), 'month'] : [abs, 'day']
  const s = `${unit[0]} ${unit[1]}${unit[0] === 1 ? '' : 's'}`
  return d < 0 ? `${s} ago` : `in ${s}`
}

/** First sentence of the description, used as the activity's title. */
export function activityTitle(a) {
  const first = (a.description ?? '').split(/(?<=[.!?])\s/)[0]
  return first || a.activityType
}

export const gbp = (n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n ?? 0)

/** Visual identity per company kind (vendor / reseller / end user). */
export const COMPANY_STYLE = {
  vendor:   { icon: BuildingStorefrontIcon, soft: 'bg-presales/15 text-presales' },
  reseller: { icon: BuildingOffice2Icon,    soft: 'bg-brand/15 text-brand' },
  endUser:  { icon: UserGroupIcon,          soft: 'bg-warning/15 text-warning' },
}

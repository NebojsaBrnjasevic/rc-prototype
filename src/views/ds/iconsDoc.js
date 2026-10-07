import { ref, computed, defineComponent, h } from 'vue'
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowTrendingUpIcon,
  ArrowUturnRightIcon,
  BanknotesIcon,
  BoltIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloudIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FireIcon,
  FunnelIcon,
  GiftIcon,
  GlobeAltIcon,
  HomeIcon,
  InformationCircleIcon,
  LightBulbIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Squares2X2Icon,
  SwatchIcon,
  TableCellsIcon,
  TagIcon,
  TrophyIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  ViewColumnsIcon,
  ViewfinderCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { TrophyIcon as STrophy, BoltIcon as SBolt, GiftIcon as SGift, FireIcon as SFire, HomeIcon as SHome } from '@heroicons/vue/24/solid'
import { TrophyIcon as MTrophy, BoltIcon as MBolt, GiftIcon as MGift, FireIcon as MFire, HomeIcon as MHome } from '@heroicons/vue/20/solid'
import { TrophyIcon as uTrophy, BoltIcon as uBolt, GiftIcon as uGift, FireIcon as uFire, HomeIcon as uHome } from '@heroicons/vue/16/solid'
import { useUiStore } from '@/stores/useUiStore'

// Explicit imports keep the bundle small (a namespace import would pull in every icon)
const Outline = { AdjustmentsHorizontalIcon, ArrowDownTrayIcon, ArrowPathIcon, ArrowRightOnRectangleIcon, ArrowTopRightOnSquareIcon, ArrowTrendingUpIcon, ArrowUturnRightIcon, BanknotesIcon, BoltIcon, BookOpenIcon, BuildingOffice2Icon, BuildingStorefrontIcon, CalendarDaysIcon, CheckCircleIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, CloudIcon, Cog6ToothIcon, DocumentDuplicateIcon, EllipsisHorizontalIcon, EnvelopeIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon, FireIcon, FunnelIcon, GiftIcon, GlobeAltIcon, HomeIcon, InformationCircleIcon, LightBulbIcon, LinkIcon, MagnifyingGlassIcon, MegaphoneIcon, PencilIcon, PlusIcon, ShieldCheckIcon, SparklesIcon, Squares2X2Icon, SwatchIcon, TableCellsIcon, TagIcon, TrophyIcon, UserCircleIcon, UserGroupIcon, UserIcon, UserPlusIcon, UsersIcon, ViewColumnsIcon, ViewfinderCircleIcon, XCircleIcon, XMarkIcon }
const Solid = { TrophyIcon: STrophy, BoltIcon: SBolt, GiftIcon: SGift, FireIcon: SFire, HomeIcon: SHome }
const Mini  = { TrophyIcon: MTrophy, BoltIcon: MBolt, GiftIcon: MGift, FireIcon: MFire, HomeIcon: MHome }
const Micro = { TrophyIcon: uTrophy, BoltIcon: uBolt, GiftIcon: uGift, FireIcon: uFire, HomeIcon: uHome }

/**
 * Design System → Foundations → Iconography.
 * Heroicons v2 (@heroicons/vue). The app uses the 24px outline set only.
 */

// The app's icon vocabulary: one meaning per icon, grouped by job.
const CATALOG = [
  {
    group: 'Navigation',
    items: [
      ['HomeIcon', 'Home'],
      ['BoltIcon', 'Activity'],
      ['BuildingOffice2Icon', 'Directory · reseller'],
      ['TrophyIcon', 'Race · rank'],
      ['UserCircleIcon', 'Profile'],
      ['ShieldCheckIcon', 'Admin · security'],
      ['BookOpenIcon', 'Guide'],
      ['SwatchIcon', 'Design System'],
      ['Squares2X2Icon', 'More (mobile)'],
      ['ChevronLeftIcon', 'Back · collapse'],
      ['ChevronRightIcon', 'Go to · next'],
      ['ChevronDownIcon', 'Open menu'],
    ],
  },
  {
    group: 'Actions',
    items: [
      ['PlusIcon', 'Create · log activity'],
      ['PencilIcon', 'Edit'],
      ['XMarkIcon', 'Close · clear'],
      ['MagnifyingGlassIcon', 'Search'],
      ['FunnelIcon', 'Filter'],
      ['AdjustmentsHorizontalIcon', 'Options'],
      ['ArrowDownTrayIcon', 'Export · download'],
      ['ArrowPathIcon', 'Retry · sync again'],
      ['ArrowUturnRightIcon', 'Follow-up'],
      ['LinkIcon', 'Linked record'],
      ['DocumentDuplicateIcon', 'Copy'],
      ['ArrowTopRightOnSquareIcon', 'Open in Salesforce'],
      ['Cog6ToothIcon', 'Settings'],
      ['ArrowRightOnRectangleIcon', 'Sign out'],
      ['EyeIcon', 'Show password'],
      ['EyeSlashIcon', 'Hide password'],
      ['EllipsisHorizontalIcon', 'Row menu'],
    ],
  },
  {
    group: 'Status & feedback',
    items: [
      ['CheckCircleIcon', 'Success · synced'],
      ['CheckIcon', 'Selected · done'],
      ['ExclamationTriangleIcon', 'Warning · failed sync'],
      ['XCircleIcon', 'Error'],
      ['InformationCircleIcon', 'Info'],
      ['ClockIcon', 'Upcoming · pending'],
      ['CloudIcon', 'Salesforce'],
      ['SparklesIcon', 'New · insight'],
      ['LightBulbIcon', 'Tip'],
    ],
  },
  {
    group: 'Records & entities',
    items: [
      ['ArrowTrendingUpIcon', 'Sales'],
      ['ViewfinderCircleIcon', 'Pre-Sales'],
      ['MegaphoneIcon', 'Marketing'],
      ['BuildingStorefrontIcon', 'Vendor'],
      ['UserGroupIcon', 'End user · team'],
      ['UsersIcon', 'Attendees'],
      ['UserIcon', 'Person'],
      ['UserPlusIcon', 'Invite · request access'],
      ['CalendarDaysIcon', 'Date · calendar view'],
      ['BanknotesIcon', 'Pipeline value'],
      ['TagIcon', 'Category'],
      ['GlobeAltIcon', 'Website · territory'],
      ['EnvelopeIcon', 'Email'],
    ],
  },
  {
    group: 'Gamification',
    items: [
      ['TrophyIcon', 'Race · podium'],
      ['FireIcon', 'Streak'],
      ['GiftIcon', 'Daily bonus · reward'],
      ['ArrowTrendingUpIcon', 'Momentum'],
    ],
  },
  {
    group: 'Views',
    items: [
      ['TableCellsIcon', 'Table'],
      ['CalendarDaysIcon', 'Calendar'],
      ['ViewColumnsIcon', 'Kanban'],
    ],
  },
]

const label = (name) => name.replace(/Icon$/, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2')

export const iconsDoc = {
  title: 'Iconography',
  description: 'Heroicons v2 (@heroicons/vue), by the makers of Tailwind. The app uses one set only: 24px outline. Each icon has one meaning across the app, so a trophy always means the race and a bolt always means activity. Icons are Vue components; they inherit colour from text-* and size from w-*/h-*.',
  whenToUse: [
    'Import from @heroicons/vue/24/outline — the only set used in the app',
    'Pair icons with a text label; icon-only buttons need aria-label',
    'Size with w-*/h-*: 16px in chips and sm buttons, 18px in md buttons, 20px in nav and lg buttons, 24px in the mobile bar and feature tiles',
    'Colour with text-* tokens; inside a tile use the soft pattern (bg-brand/10 text-brand)',
    'Reuse the icon from the catalog below when the meaning already exists',
  ],
  whenNotTo: [
    "Don't mix in solid / mini / micro icons — they read heavier and break the rhythm",
    "Don't give one meaning two icons, or one icon two meanings",
    "Don't use emoji or other icon libraries",
    "Don't scale icons with font-size — set w-* and h-*",
    "Don't hard-code colours (#hex) on icons — use tokens",
  ],
  stories: [
    {
      name: 'Variants',
      description: 'Heroicons ships four styles. We use Outline 24 everywhere; the others are shown for reference only.',
      snippet: `// ✅ The app's set
import { TrophyIcon } from '@heroicons/vue/24/outline'

// Reference only — not used in the app
import { TrophyIcon } from '@heroicons/vue/24/solid'  // Solid 24
import { TrophyIcon } from '@heroicons/vue/20/solid'  // Mini 20
import { TrophyIcon } from '@heroicons/vue/16/solid'  // Micro 16`,
      demo: defineComponent({ setup() {
        const names = ['TrophyIcon', 'BoltIcon', 'GiftIcon', 'FireIcon', 'HomeIcon']
        const sets = [
          { label: 'Outline 24', path: '24/outline', lib: Outline, used: true },
          { label: 'Solid 24', path: '24/solid', lib: Solid },
          { label: 'Mini 20', path: '20/solid', lib: Mini },
          { label: 'Micro 16', path: '16/solid', lib: Micro },
        ]
        return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3' }, sets.map((s) =>
          h('div', { class: ['rounded-2xl p-4 border', s.used ? 'border-brand/50 bg-brand/[0.06]' : 'border-line bg-surface-2 opacity-70'] }, [
            h('div', { class: 'flex items-center justify-between mb-4' }, [
              h('p', { class: 'text-sm font-extrabold' }, s.label),
              h('span', { class: ['text-[11px] font-bold px-2 py-0.5 rounded-md', s.used ? 'bg-brand text-brand-on' : 'bg-surface-3 text-fg-muted'] }, s.used ? 'In use' : 'Reference'),
            ]),
            h('div', { class: 'flex items-center gap-4 text-fg' }, names.map((n) => h(s.lib[n], { class: 'w-6 h-6' }))),
            h('p', { class: 'font-mono text-[11px] text-fg-muted mt-4' }, `@heroicons/vue/${s.path}`),
          ])
        ))
      } }),
    },
    {
      name: 'Sizes',
      description: 'Four sizes, tied to where the icon sits. Always set both width and height.',
      snippet: `<PlusIcon class="w-4 h-4" />          <!-- 16 · chips, sm buttons, inline links -->
<PlusIcon class="w-[18px] h-[18px]" />  <!-- 18 · md buttons -->
<PlusIcon class="w-5 h-5" />          <!-- 20 · sidebar nav, lg buttons, list rows -->
<PlusIcon class="w-6 h-6" />          <!-- 24 · mobile bottom bar, feature tiles -->

<!-- Emphasis: thicker stroke on the primary action -->
<PlusIcon class="w-[18px] h-[18px] stroke-[2.5]" />`,
      demo: defineComponent({ setup() {
        const sizes = [
          { cls: 'w-4 h-4', px: 16, use: 'Chips, sm buttons, inline links' },
          { cls: 'w-[18px] h-[18px]', px: 18, use: 'md buttons' },
          { cls: 'w-5 h-5', px: 20, use: 'Sidebar nav, lg buttons, list rows' },
          { cls: 'w-6 h-6', px: 24, use: 'Mobile bottom bar, feature tiles' },
        ]
        return () => h('div', { class: 'space-y-3' }, [
          ...sizes.map((s) => h('div', { class: 'flex items-center gap-4 py-1 border-b border-line last:border-0' }, [
            h('span', { class: 'font-mono text-xs text-fg-muted w-36 flex-shrink-0' }, s.cls),
            h('span', { class: 'w-8 flex justify-center text-fg' }, [h(Outline.TrophyIcon, { class: s.cls })]),
            h('span', { class: 'text-sm text-fg-2' }, `${s.px}px — ${s.use}`),
          ])),
          h('div', { class: 'flex items-center gap-4 pt-2' }, [
            h('span', { class: 'font-mono text-xs text-fg-muted w-36 flex-shrink-0' }, 'stroke-[2.5]'),
            h('span', { class: 'w-8 flex justify-center gap-1 text-fg' }, [h(Outline.PlusIcon, { class: 'w-5 h-5' }), h(Outline.PlusIcon, { class: 'w-5 h-5 stroke-[2.5]' })]),
            h('span', { class: 'text-sm text-fg-2' }, 'Default vs. emphasised stroke — only for the primary action (+)'),
          ]),
        ])
      } }),
    },
    {
      name: 'Colour & tiles',
      description: 'Icons take the text colour of their context. In feature tiles, use the soft pattern: 10–15% tinted background with the full colour on the icon.',
      snippet: `<!-- Inline: inherits text colour -->
<span class="text-fg-2"><ClockIcon class="w-4 h-4" /> 3 days ago</span>

<!-- Tile (soft pattern) -->
<span class="w-12 h-12 rounded-[14px] bg-brand/10 text-brand flex items-center justify-center">
  <TrophyIcon class="w-6 h-6" />
</span>

<!-- Record types: RECORD_STYLE from @/utils/activity -->
<component :is="RECORD_STYLE[type].icon" :class="RECORD_STYLE[type].text" />`,
      demo: defineComponent({ setup() {
        const tiles = [
          { icon: Outline.TrophyIcon, cls: 'bg-brand/10 text-brand', name: 'brand' },
          { icon: Outline.GiftIcon, cls: 'bg-reward-fill/15 text-reward', name: 'reward' },
          { icon: Outline.CheckCircleIcon, cls: 'bg-success/15 text-success', name: 'success' },
          { icon: Outline.ExclamationTriangleIcon, cls: 'bg-warning/15 text-warning', name: 'warning' },
          { icon: Outline.XCircleIcon, cls: 'bg-danger/15 text-danger', name: 'danger' },
          { icon: Outline.ArrowTrendingUpIcon, cls: 'bg-sales/15 text-sales', name: 'sales' },
          { icon: Outline.ViewfinderCircleIcon, cls: 'bg-presales/15 text-presales', name: 'presales' },
          { icon: Outline.MegaphoneIcon, cls: 'bg-marketing/15 text-marketing', name: 'marketing' },
        ]
        return () => h('div', { class: 'flex flex-wrap gap-4' }, tiles.map((t) =>
          h('div', { class: 'flex flex-col items-center gap-2 w-20' }, [
            h('span', { class: ['w-12 h-12 rounded-[14px] flex items-center justify-center', t.cls] }, [h(t.icon, { class: 'w-6 h-6' })]),
            h('span', { class: 'font-mono text-[11px] text-fg-muted' }, t.name),
          ])
        ))
      } }),
    },
    {
      name: 'App icon catalog',
      description: 'Every icon the app uses and what it means. Search by name or meaning; click an icon to copy its import.',
      snippet: `import { TrophyIcon } from '@heroicons/vue/24/outline'

<TrophyIcon class="w-5 h-5" aria-hidden="true" />`,
      demo: defineComponent({ setup() {
        const ui = useUiStore()
        const q = ref('')
        const groups = computed(() => {
          const term = q.value.trim().toLowerCase()
          return CATALOG
            .map((g) => ({ ...g, items: g.items.filter(([n, m]) => !term || n.toLowerCase().includes(term) || m.toLowerCase().includes(term)) }))
            .filter((g) => g.items.length)
        })
        async function copy(name) {
          const line = `import { ${name} } from '@heroicons/vue/24/outline'`
          try { await navigator.clipboard.writeText(line); ui.toast(`Copied ${name} import`) } catch { ui.toast(line, 'warning') }
        }
        return () => h('div', { class: 'space-y-6' }, [
          h('div', { class: 'relative max-w-sm' }, [
            h(Outline.MagnifyingGlassIcon, { class: 'w-4 h-4 text-fg-muted absolute left-3 top-1/2 -translate-y-1/2', 'aria-hidden': 'true' }),
            h('input', {
              value: q.value,
              onInput: (e) => { q.value = e.target.value },
              type: 'search',
              placeholder: 'Search icons… e.g. trophy, sync, vendor',
              'aria-label': 'Search icons',
              class: 'w-full h-10 pl-9 pr-3 rounded-control bg-surface-2 border border-line text-sm outline-none focus:ring-2 focus:ring-brand focus:border-brand',
            }),
          ]),
          groups.value.length
            ? groups.value.map((g) => h('section', { key: g.group }, [
                h('p', { class: 'text-overline text-fg-2 mb-3' }, `${g.group} · ${g.items.length}`),
                h('div', { class: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2' }, g.items.map(([name, meaning]) =>
                  h('button', {
                    key: name + meaning,
                    type: 'button',
                    title: `Copy import for ${name}`,
                    class: 'group flex flex-col items-center gap-2 rounded-xl border border-line bg-surface-2 p-3 text-center hover:border-brand/50 hover:bg-surface-3 transition-colors',
                    onClick: () => copy(name),
                  }, [
                    h(Outline[name], { class: 'w-6 h-6 text-fg group-hover:text-brand transition-colors', 'aria-hidden': 'true' }),
                    h('span', { class: 'text-[12px] font-bold leading-tight' }, meaning),
                    h('span', { class: 'font-mono text-[10px] text-fg-muted leading-tight break-all' }, label(name)),
                  ])
                )),
              ]))
            : h('p', { class: 'text-sm text-fg-muted' }, `No icon matches "${q.value}". Browse the full set at heroicons.com.`),
        ])
      } }),
    },
    {
      name: 'Accessibility',
      description: 'Decorative icons are hidden from screen readers; icon-only controls get a label.',
      snippet: `<!-- Next to text: decorative -->
<AppButton><PlusIcon class="w-[18px] h-[18px]" aria-hidden="true" />Log activity</AppButton>

<!-- Icon-only: the button carries the name -->
<button aria-label="Close"><XMarkIcon class="w-5 h-5" /></button>

<!-- Meaning carried by colour + icon? Add text too -->
<AppBadge color="success" dot>Synced</AppBadge>`,
      demo: defineComponent({ setup() {
        const row = (ok, text) => h('li', { class: 'flex items-start gap-2.5 text-sm' }, [
          h(ok ? Outline.CheckCircleIcon : Outline.XCircleIcon, { class: ['w-5 h-5 flex-shrink-0', ok ? 'text-success' : 'text-danger'], 'aria-hidden': 'true' }),
          h('span', { class: 'text-fg-2' }, text),
        ])
        return () => h('ul', { class: 'space-y-2.5' }, [
          row(true, 'Icon + visible label — the icon is decoration, the label is the name'),
          row(true, 'Icon-only button with aria-label (close, theme toggle, collapse)'),
          row(true, 'Status shown with icon, colour and text together'),
          row(false, 'Icon-only button without a label — screen readers announce "button"'),
          row(false, 'Colour or icon alone to signal an error'),
        ])
      } }),
    },
  ],
}

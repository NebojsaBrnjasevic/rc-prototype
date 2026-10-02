import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRaceStore } from '@/stores/useRaceStore'
import {
  HomeIcon,
  BoltIcon,
  BuildingOffice2Icon,
  TrophyIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  SwatchIcon,
} from '@heroicons/vue/24/outline'

/**
 * App navigation — one source for the sidebar (md+) and the bottom bar (phones).
 * Items marked adminOnly are filtered out for non-admins.
 */
export function useNav() {
  const route = useRoute()
  const auth = useAuthStore()
  const race = useRaceStore()

  // Week race always shows its countdown in the nav, whatever period Home has open
  const raceTag = computed(() => {
    const d = race.periods.find((p) => p.key === 'week')?.daysLeft
    return d > 0 ? `${d}d` : '<1d'
  })

  const allowed = (items) => items.filter((i) => !i.adminOnly || auth.user?.isAdmin)

  const groups = computed(() => [
    {
      title: 'Workspace',
      items: [
        { to: '/',          label: 'Home',      icon: HomeIcon },
        { to: '/activity',  label: 'Activity',  icon: BoltIcon },
        { to: '/directory', label: 'Directory', icon: BuildingOffice2Icon },
      ],
    },
    {
      title: 'Compete',
      items: [
        { to: '/race',    label: 'Race',    icon: TrophyIcon, tag: raceTag.value },
        { to: '/profile', label: 'Profile', icon: UserCircleIcon },
      ],
    },
    {
      title: 'Admin',
      items: [
        { to: '/admin', label: 'Admin', icon: ShieldCheckIcon, adminOnly: true },
        { to: '/guide', label: 'Guide', icon: BookOpenIcon },
      ],
    },
  ].map((g) => ({ ...g, items: allowed(g.items) })).filter((g) => g.items.length))

  // Pinned to the bottom of the sidebar, apart from the main nav
  const footerItems = computed(() => allowed([
    { to: '/ds', label: 'Design System', icon: SwatchIcon, adminOnly: true },
  ]))

  function isActive(item) {
    return item.to === '/' ? route.path === '/' : route.path.startsWith(item.to)
  }

  return { groups, footerItems, raceTag, isActive }
}

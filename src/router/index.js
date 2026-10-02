import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

// ── Views (lazy-loaded for code splitting) ────────────────────────────────────
const MetricsView    = () => import('@/views/MetricsView.vue')
const ActivityView   = () => import('@/views/ActivityView.vue')
const DirectoryView  = () => import('@/views/DirectoryView.vue')
const CompanyView    = () => import('@/views/CompanyView.vue')
const ProfileView    = () => import('@/views/ProfileView.vue')
const ChangelogView  = () => import('@/views/ChangelogView.vue')
const GuideView      = () => import('@/views/GuideView.vue')
const AdminView      = () => import('@/views/AdminView.vue')
const SettingsView   = () => import('@/views/SettingsView.vue')
const LoginView      = () => import('@/views/LoginView.vue')
const NotFoundView      = () => import('@/views/NotFoundView.vue')
const DesignSystemView  = () => import('@/views/DesignSystemView.vue')
const DsComponentView   = () => import('@/views/DsComponentView.vue')
const RaceView          = () => import('@/views/RaceView.vue')

const routes = [
  // ── Public ────────────────────────────────────────────────────────────────
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true, layout: 'bare' },
  },

  // ── App ───────────────────────────────────────────────────────────────────
  {
    path: '/',
    name: 'home',
    component: MetricsView,
    meta: { requiresAuth: true, title: 'Home' },
  },
  {
    path: '/activity',
    name: 'activity',
    component: ActivityView,
    meta: { requiresAuth: true },
  },
  {
    path: '/race',
    name: 'race',
    component: RaceView,
    meta: { requiresAuth: true, title: 'Race' },
  },
  {
    path: '/directory',
    name: 'directory',
    component: DirectoryView,
    meta: { requiresAuth: true },
  },
  {
    // One detail page for vendors, resellers and end users
    path: '/directory/:kind(vendor|reseller|end-user)/:id',
    name: 'company',
    component: CompanyView,
    meta: { requiresAuth: true, title: 'Directory' },
  },
  // Dashboards was merged into Home (Insights section). Keep old links working.
  { path: '/dashboards', redirect: { path: '/', hash: '#insights' } },
  { path: '/dashboard',  redirect: { path: '/', hash: '#insights' } },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/changelog',
    name: 'changelog',
    component: ChangelogView,
    meta: { requiresAuth: true },
  },
  {
    path: '/guide',
    name: 'guide',
    component: GuideView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/ds',
    name: 'design-system',
    component: DesignSystemView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/ds/:slug',
    name: 'design-system-component',
    component: DsComponentView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // ── Catch-all ─────────────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // The app shell scrolls inside <main>, not the window — pages handle their own
    // hash targets (see MetricsView #insights), so never scroll the window here.
    if (savedPosition) return savedPosition
    if (to.hash) return false
    return { top: 0 }
  },
})

// ── Navigation guards ─────────────────────────────────────────────────────────
router.beforeEach((to) => {
  const auth = useAuthStore()

  // Requires auth but not logged in
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Requires admin but user is not admin
  if (to.meta.requiresAdmin && !auth.user?.isAdmin) {
    return { name: 'home' }
  }

  // Already logged in, trying to reach login
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

// ── Document title per route ──────────────────────────────────────────────────
router.afterEach((to) => {
  const name = to.meta.title ?? (typeof to.name === 'string' ? to.name.replace(/-/g, ' ') : '')
  const label = name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
  document.title = label && to.name !== 'home' ? `${label} · Race Control` : 'Race Control'
})

export default router

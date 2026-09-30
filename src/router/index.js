import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

// ── Views (lazy-loaded for code splitting) ────────────────────────────────────
const HomeView       = () => import('@/views/HomeView.vue')
const ActivityView   = () => import('@/views/ActivityView.vue')
const DirectoryView  = () => import('@/views/DirectoryView.vue')
const VendorView     = () => import('@/views/VendorView.vue')
const DashboardView  = () => import('@/views/DashboardView.vue')
const ProfileView    = () => import('@/views/ProfileView.vue')
const ChangelogView  = () => import('@/views/ChangelogView.vue')
const GuideView      = () => import('@/views/GuideView.vue')
const AdminView      = () => import('@/views/AdminView.vue')
const SettingsView   = () => import('@/views/SettingsView.vue')
const LoginView      = () => import('@/views/LoginView.vue')
const NotFoundView   = () => import('@/views/NotFoundView.vue')

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
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/activity',
    name: 'activity',
    component: ActivityView,
    meta: { requiresAuth: true },
  },
  {
    path: '/directory',
    name: 'directory',
    component: DirectoryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/directory/vendor/:id',
    name: 'vendor',
    component: VendorView,
    meta: { requiresAuth: true },
  },
  // ── UX FIX: redirect /dashboard → /dashboards (original app 404'd on singular)
  {
    path: '/dashboard',
    redirect: '/dashboards',
  },
  {
    path: '/dashboards',
    name: 'dashboards',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
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
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
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

export default router

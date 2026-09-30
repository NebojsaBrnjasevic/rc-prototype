import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

// ── Restore auth session before mounting ──────────────────────────────────────
import { useAuthStore } from './stores/useAuthStore'
import { useThemeStore } from './stores/useThemeStore'

const auth = useAuthStore()
const theme = useThemeStore() // Initialises theme immediately (reads localStorage)

auth.restoreSession().then(() => {
  app.mount('#app')
})

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Initialise from localStorage, fallback to system preference
  const storedTheme = localStorage.getItem('rc-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = ref(storedTheme ? storedTheme === 'dark' : prefersDark)

  // Apply class to <html> immediately
  function apply(dark) {
    document.documentElement.classList.toggle('dark', dark)
  }
  apply(isDark.value)

  function toggle() {
    isDark.value = !isDark.value
  }

  function setDark(val) {
    isDark.value = val
  }

  // Persist + apply on change
  watch(isDark, (val) => {
    apply(val)
    localStorage.setItem('rc-theme', val ? 'dark' : 'light')
  })

  return { isDark, toggle, setDark }
})

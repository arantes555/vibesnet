import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

function getSystemTheme (): 'light' | 'dark' {
  return darkQuery.matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(loadFromStorage<ThemeMode>(STORAGE_KEY) ?? 'system')

  const effectiveTheme = computed<'light' | 'dark'>(() => {
    if (mode.value === 'system') return getSystemTheme()
    return mode.value
  })

  function apply () {
    document.documentElement.setAttribute('data-theme', effectiveTheme.value)
  }

  function cycle () {
    const order: ThemeMode[] = ['system', 'light', 'dark']
    const idx = order.indexOf(mode.value)
    mode.value = order[(idx + 1) % order.length]
  }

  watch(mode, (val) => {
    saveToStorage(STORAGE_KEY, val)
    apply()
  })

  darkQuery.addEventListener('change', () => {
    if (mode.value === 'system') apply()
  })

  apply()

  return { mode, effectiveTheme, cycle }
})

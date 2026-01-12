import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { DashboardWidget, WidgetConfig, WidgetPosition } from '@/components/widgets/types'
import { WIDGET_DEFAULTS } from '@/components/widgets/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const widgets = ref<DashboardWidget[]>([])
  const isEditMode = ref(false)
  const isLoaded = ref(false)

  const layoutItems = computed({
    get: () => widgets.value.map((w) => ({
      ...w.position,
      i: w.config.id
    })),
    set: (newLayout: WidgetPosition[]) => {
      newLayout.forEach((pos) => {
        const widget = widgets.value.find((w) => w.config.id === pos.i)
        if (widget) {
          widget.position = { ...pos }
        }
      })
    }
  })

  function getWidgetById (id: string) {
    return widgets.value.find((w) => w.config.id === id)
  }

  function addWidget (config: WidgetConfig, position?: Partial<WidgetPosition>) {
    const defaults = WIDGET_DEFAULTS[config.type]
    const newPosition: WidgetPosition = {
      x: 0,
      y: Infinity,
      w: defaults.w,
      h: defaults.h,
      i: config.id,
      ...position
    }

    widgets.value.push({
      config,
      position: newPosition
    })
  }

  function removeWidget (id: string) {
    const index = widgets.value.findIndex((w) => w.config.id === id)
    if (index !== -1) {
      widgets.value.splice(index, 1)
    }
  }

  function setWidgetConfig (id: string, config: WidgetConfig) {
    const widget = widgets.value.find((w) => w.config.id === id)
    if (widget) {
      widget.config = config
    }
  }

  function updateLayout (newLayout: WidgetPosition[]) {
    newLayout.forEach((pos) => {
      const widget = widgets.value.find((w) => w.config.id === pos.i)
      if (widget) {
        widget.position = { ...pos }
      }
    })
  }

  function loadDashboard () {
    const saved = loadFromStorage<DashboardWidget[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      widgets.value = saved
    } else {
      initializeDefaultDashboard()
    }
    isLoaded.value = true
  }

  function saveDashboard () {
    saveToStorage(STORAGE_KEY, widgets.value)
  }

  function initializeDefaultDashboard () {
    addWidget({
      id: crypto.randomUUID(),
      type: 'clock',
      title: 'Clock',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      format: '24h',
      showSeconds: true
    })
  }

  function toggleEditMode () {
    isEditMode.value = !isEditMode.value
  }

  watch(widgets, saveDashboard, { deep: true })

  return {
    widgets,
    isEditMode,
    isLoaded,
    layoutItems,
    getWidgetById,
    addWidget,
    removeWidget,
    setWidgetConfig,
    updateLayout,
    loadDashboard,
    saveDashboard,
    toggleEditMode
  }
})

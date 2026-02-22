import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { DashboardWidget, WidgetConfig, WidgetPosition } from '@/components/widgets/types'
import { WIDGET_DEFAULTS } from '@/components/widgets/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const widgets = ref<DashboardWidget[]>([])
  const layoutItems = ref<WidgetPosition[]>([])
  const isLoaded = ref(false)

  function syncLayoutToWidgets () {
    layoutItems.value.forEach((pos) => {
      const widget = widgets.value.find((w) => w.config.id === pos.i)
      if (widget) {
        widget.position.x = pos.x
        widget.position.y = pos.y
        widget.position.w = pos.w
        widget.position.h = pos.h
      }
    })
  }

  function syncWidgetsToLayout () {
    layoutItems.value = widgets.value.map((w) => ({
      ...w.position,
      i: w.config.id
    }))
  }

  function hasValidPosition (pos: WidgetPosition): boolean {
    return Number.isFinite(pos.x) && Number.isFinite(pos.y) &&
           pos.x !== null && pos.y !== null &&
           pos.x >= 0 && pos.y >= 0
  }

  function markOccupied (occupied: boolean[][], pos: WidgetPosition) {
    for (let dy = 0; dy < pos.h; dy++) {
      const row = occupied[pos.y + dy] ?? (occupied[pos.y + dy] = [])
      for (let dx = 0; dx < pos.w; dx++) {
        row[pos.x + dx] = true
      }
    }
  }

  function findFreePosition (occupied: boolean[][], w: number, h: number, colNum: number): { x: number, y: number } {
    for (let y = 0; ; y++) {
      for (let x = 0; x <= colNum - w; x++) {
        let canPlace = true
        for (let dy = 0; dy < h && canPlace; dy++) {
          for (let dx = 0; dx < w && canPlace; dx++) {
            if (occupied[y + dy]?.[x + dx]) {
              canPlace = false
            }
          }
        }
        if (canPlace) {
          return { x, y }
        }
      }
    }
  }

  function normalizeLayout () {
    const colNum = 3
    const occupied: boolean[][] = []

    const validWidgets = widgets.value.filter(w => hasValidPosition(w.position))
    const invalidWidgets = widgets.value.filter(w => !hasValidPosition(w.position))

    validWidgets
      .sort((a, b) => a.position.y !== b.position.y ? a.position.y - b.position.y : a.position.x - b.position.x)
      .forEach(widget => markOccupied(occupied, widget.position))

    invalidWidgets.forEach((widget) => {
      const pos = widget.position
      const free = findFreePosition(occupied, pos.w, pos.h, colNum)
      pos.x = free.x
      pos.y = free.y
      markOccupied(occupied, pos)
    })
  }

  function getWidgetById (id: string) {
    return widgets.value.find((w) => w.config.id === id)
  }

  function addWidget (config: WidgetConfig, position?: Partial<WidgetPosition>) {
    const defaults = WIDGET_DEFAULTS[config.type]
    const newPosition: WidgetPosition = {
      x: -1,
      y: -1,
      w: defaults.w,
      h: defaults.h,
      i: config.id,
      ...position
    }

    widgets.value.push({
      config,
      position: newPosition
    })
    normalizeLayout()
    syncWidgetsToLayout()
  }

  function removeWidget (id: string) {
    const index = widgets.value.findIndex((w) => w.config.id === id)
    if (index !== -1) {
      widgets.value.splice(index, 1)
      syncWidgetsToLayout()
    }
  }

  function setWidgetConfig (id: string, config: WidgetConfig) {
    const widget = widgets.value.find((w) => w.config.id === id)
    if (widget) {
      widget.config = config
    }
  }

  function updateLayout () {
    syncLayoutToWidgets()
  }

  function loadDashboard () {
    const saved = loadFromStorage<DashboardWidget[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      widgets.value = saved
      normalizeLayout()
    } else {
      initializeDefaultDashboard()
    }
    syncWidgetsToLayout()
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

  watch(widgets, saveDashboard, { deep: true })

  return {
    widgets,
    isLoaded,
    layoutItems,
    getWidgetById,
    addWidget,
    removeWidget,
    setWidgetConfig,
    updateLayout,
    loadDashboard,
    saveDashboard
  }
})

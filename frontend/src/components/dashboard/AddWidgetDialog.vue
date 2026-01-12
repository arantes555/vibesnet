<script lang="ts">
import { defineComponent } from 'vue'
import type { WidgetType, WidgetConfig } from '@/components/widgets/types'
import { useDashboardStore } from '@/stores/dashboard'

interface WidgetOption {
  type: WidgetType
  name: string
  description: string
}

export default defineComponent({
  name: 'AddWidgetDialog',

  props: {
    open: {
      type: Boolean,
      required: true
    }
  },

  emits: ['update:open'],

  setup () {
    const store = useDashboardStore()
    return { store }
  },

  data () {
    return {
      selectedType: null as WidgetType | null,
      rssUrl: '',
      weatherLat: '',
      weatherLon: '',
      widgetTypes: [
        { type: 'clock', name: 'Clock', description: 'Display time and date' },
        { type: 'notes', name: 'Notes', description: 'Quick notes and text' },
        { type: 'bookmarks', name: 'Bookmarks', description: 'Save your favorite links' },
        { type: 'rss', name: 'RSS Feed', description: 'Follow news and blogs' },
        { type: 'weather', name: 'Weather', description: 'Current weather conditions' }
      ] as WidgetOption[]
    }
  },

  methods: {
    close () {
      this.$emit('update:open', false)
      this.selectedType = null
      this.rssUrl = ''
      this.weatherLat = ''
      this.weatherLon = ''
    },

    createWidget () {
      if (!this.selectedType) return

      let config: WidgetConfig

      switch (this.selectedType) {
        case 'clock':
          config = {
            id: crypto.randomUUID(),
            type: 'clock',
            title: 'Clock',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            format: '24h',
            showSeconds: true
          }
          break
        case 'notes':
          config = {
            id: crypto.randomUUID(),
            type: 'notes',
            title: 'Notes',
            content: ''
          }
          break
        case 'bookmarks':
          config = {
            id: crypto.randomUUID(),
            type: 'bookmarks',
            title: 'Bookmarks',
            bookmarks: []
          }
          break
        case 'rss':
          config = {
            id: crypto.randomUUID(),
            type: 'rss',
            title: 'RSS Feed',
            feedUrl: this.rssUrl,
            refreshInterval: 15,
            maxItems: 10
          }
          break
        case 'weather':
          config = {
            id: crypto.randomUUID(),
            type: 'weather',
            title: 'Weather',
            latitude: parseFloat(this.weatherLat) || 48.8566,
            longitude: parseFloat(this.weatherLon) || 2.3522,
            units: 'celsius'
          }
          break
      }

      this.store.addWidget(config)
      this.close()
    },

    useCurrentLocation () {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.weatherLat = position.coords.latitude.toFixed(4)
          this.weatherLon = position.coords.longitude.toFixed(4)
        })
      }
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dialog-overlay" @click.self="close">
      <div class="dialog">
        <header class="dialog-header">
          <h2>Add Widget</h2>
          <button class="dialog-close" @click="close">&times;</button>
        </header>

        <div class="dialog-content">
          <div v-if="!selectedType" class="widget-grid">
            <button
              v-for="widget in widgetTypes"
              :key="widget.type"
              class="widget-option"
              @click="selectedType = widget.type"
            >
              <span class="widget-option-name">{{ widget.name }}</span>
              <span class="widget-option-desc">{{ widget.description }}</span>
            </button>
          </div>

          <div v-else class="widget-config">
            <template v-if="selectedType === 'rss'">
              <label class="form-label">
                Feed URL
                <input v-model="rssUrl" type="url" class="form-input" placeholder="https://example.com/feed.xml">
              </label>
            </template>

            <template v-else-if="selectedType === 'weather'">
              <div class="form-row">
                <label class="form-label">
                  Latitude
                  <input v-model="weatherLat" type="text" class="form-input" placeholder="48.8566">
                </label>
                <label class="form-label">
                  Longitude
                  <input v-model="weatherLon" type="text" class="form-input" placeholder="2.3522">
                </label>
              </div>
              <button class="btn btn-secondary" @click="useCurrentLocation">
                Use Current Location
              </button>
            </template>

            <template v-else>
              <p class="form-hint">Click "Add" to create the widget.</p>
            </template>
          </div>
        </div>

        <footer class="dialog-footer">
          <button v-if="selectedType" class="btn btn-secondary" @click="selectedType = null">
            Back
          </button>
          <button v-if="selectedType" class="btn btn-primary" @click="createWidget">
            Add
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.125rem;
}

.dialog-close {
  padding: 0;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
  line-height: 1;
}

.dialog-content {
  padding: 1rem;
  overflow: auto;
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.widget-grid {
  display: grid;
  gap: 0.5rem;
}

.widget-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  cursor: pointer;
  text-align: left;
}

.widget-option:hover {
  background: var(--color-background-mute);
}

.widget-option-name {
  font-weight: 600;
  color: var(--color-heading);
}

.widget-option-desc {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.8;
}

.widget-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

.form-input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-border-hover);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.form-hint {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.875rem;
  margin: 0;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-heading);
  color: var(--color-background);
  border-color: var(--color-heading);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
}

.btn:hover {
  opacity: 0.9;
}
</style>

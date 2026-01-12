<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { WeatherWidgetConfig } from '../types'

export default defineComponent({
  name: 'WeatherEditDialog',

  props: {
    open: {
      type: Boolean,
      required: true
    },
    config: {
      type: Object as PropType<WeatherWidgetConfig>,
      required: true
    }
  },

  emits: ['update:open', 'save'],

  data () {
    return {
      title: this.config.title,
      latitude: this.config.latitude.toString(),
      longitude: this.config.longitude.toString(),
      units: this.config.units
    }
  },

  watch: {
    config: {
      handler (newConfig: WeatherWidgetConfig) {
        this.title = newConfig.title
        this.latitude = newConfig.latitude.toString()
        this.longitude = newConfig.longitude.toString()
        this.units = newConfig.units
      },
      deep: true
    }
  },

  methods: {
    close () {
      this.$emit('update:open', false)
    },

    save () {
      this.$emit('save', {
        ...this.config,
        title: this.title,
        latitude: parseFloat(this.latitude) || 0,
        longitude: parseFloat(this.longitude) || 0,
        units: this.units
      })
      this.close()
    },

    useCurrentLocation () {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude.toFixed(4)
          this.longitude = position.coords.longitude.toFixed(4)
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
          <h2>Edit Weather</h2>
          <button class="dialog-close" @click="close">&times;</button>
        </header>

        <div class="dialog-content">
          <label class="form-label">
            Title
            <input v-model="title" type="text" class="form-input">
          </label>

          <div class="form-row">
            <label class="form-label">
              Latitude
              <input v-model="latitude" type="text" class="form-input" placeholder="48.8566">
            </label>
            <label class="form-label">
              Longitude
              <input v-model="longitude" type="text" class="form-input" placeholder="2.3522">
            </label>
          </div>

          <button type="button" class="btn btn-secondary btn-block" @click="useCurrentLocation">
            Use Current Location
          </button>

          <label class="form-label">
            Units
            <select v-model="units" class="form-input">
              <option value="celsius">Celsius</option>
              <option value="fahrenheit">Fahrenheit</option>
            </select>
          </label>
        </div>

        <footer class="dialog-footer">
          <button class="btn btn-secondary" @click="close">Cancel</button>
          <button class="btn btn-primary" @click="save">Save</button>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
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

.btn-block {
  width: 100%;
}

.btn:hover {
  opacity: 0.9;
}
</style>

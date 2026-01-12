<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { WeatherWidgetConfig } from './types'
import { fetchWeather, getWeatherDescription, getWeatherEmoji, type WeatherData } from '@/services/weather'

export default defineComponent({
  name: 'WeatherWidget',

  props: {
    config: {
      type: Object as PropType<WeatherWidgetConfig>,
      required: true
    }
  },

  data () {
    return {
      weather: null as WeatherData | null,
      loading: false,
      error: null as string | null
    }
  },

  computed: {
    formattedTemperature (): string {
      if (!this.weather) return ''
      const temp = this.weather.temperature
      if (this.config.units === 'fahrenheit') {
        return `${Math.round(temp * 9 / 5 + 32)}°F`
      }
      return `${Math.round(temp)}°C`
    },

    weatherEmoji (): string {
      return this.weather ? getWeatherEmoji(this.weather.weatherCode, this.weather.isDay) : ''
    },

    weatherDescription (): string {
      return this.weather ? getWeatherDescription(this.weather.weatherCode) : ''
    }
  },

  watch: {
    'config.latitude': 'loadWeather',
    'config.longitude': 'loadWeather'
  },

  mounted () {
    this.loadWeather()
  },

  methods: {
    async loadWeather () {
      if (!this.config.latitude || !this.config.longitude) return

      this.loading = true
      this.error = null

      try {
        this.weather = await fetchWeather(this.config.latitude, this.config.longitude)
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to fetch weather'
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<template>
  <div class="weather">
    <div v-if="loading && !weather" class="weather-loading">
      Loading...
    </div>

    <div v-else-if="error" class="weather-error">
      {{ error }}
    </div>

    <div v-else-if="weather" class="weather-content">
      <div class="weather-emoji">
        {{ weatherEmoji }}
      </div>
      <div class="weather-temp">
        {{ formattedTemperature }}
      </div>
      <div class="weather-desc">
        {{ weatherDescription }}
      </div>
    </div>

    <div v-else class="weather-empty">
      No location set
    </div>
  </div>
</template>

<style scoped>
.weather {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.weather-loading,
.weather-error,
.weather-empty {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.875rem;
}

.weather-error {
  color: #e53935;
}

.weather-content {
  text-align: center;
}

.weather-emoji {
  font-size: 3rem;
  line-height: 1;
}

.weather-temp {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-top: 0.25rem;
}

.weather-desc {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.8;
}
</style>

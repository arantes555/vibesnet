<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ClockWidgetConfig } from './types'

export default defineComponent({
  name: 'ClockWidget',

  props: {
    config: {
      type: Object as PropType<ClockWidgetConfig>,
      required: true
    }
  },

  data () {
    return {
      now: new Date(),
      intervalId: undefined as number | undefined
    }
  },

  computed: {
    formattedTime (): string {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: this.config.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: this.config.format === '12h'
      }
      if (this.config.showSeconds) {
        options.second = '2-digit'
      }
      return this.now.toLocaleTimeString(undefined, options)
    },

    formattedDate (): string {
      return this.now.toLocaleDateString(undefined, {
        timeZone: this.config.timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },

  mounted () {
    this.intervalId = window.setInterval(() => {
      this.now = new Date()
    }, 1000)
  },

  beforeUnmount () {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
})
</script>

<template>
  <div class="clock">
    <div class="clock-time">{{ formattedTime }}</div>
    <div class="clock-date">{{ formattedDate }}</div>
  </div>
</template>

<style scoped>
.clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.clock-time {
  font-size: 2rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-heading);
}

.clock-date {
  font-size: 0.875rem;
  color: var(--color-text);
  margin-top: 0.25rem;
}
</style>

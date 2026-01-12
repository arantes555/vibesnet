<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { WidgetConfig } from './types'

export default defineComponent({
  name: 'BaseWidget',

  props: {
    config: {
      type: Object as PropType<WidgetConfig>,
      required: true
    }
  }
})
</script>

<template>
  <div class="widget">
    <header class="widget-header">
      <h3 class="widget-title">{{ config.title }}</h3>
      <div class="widget-actions">
        <slot name="menu" />
      </div>
    </header>
    <div class="widget-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border);
  cursor: move;
}

.widget-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-heading);
}

.widget-actions {
  display: flex;
  gap: 0.25rem;
}

.widget-content {
  flex: 1;
  padding: 0.75rem;
  overflow: auto;
}
</style>

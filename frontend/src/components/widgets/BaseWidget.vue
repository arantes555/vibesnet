<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { WidgetConfig } from './types'

export default defineComponent({
  name: 'BaseWidget',

  props: {
    config: {
      type: Object as PropType<WidgetConfig>,
      required: true
    },
    draggable: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<template>
  <div class="widget">
    <header class="widget-header" :class="{ 'widget-header--draggable': draggable }">
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
}

.widget-header--draggable {
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

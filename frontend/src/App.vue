<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import AddWidgetDialog from '@/components/dashboard/AddWidgetDialog.vue'
import { useThemeStore } from '@/stores/theme'

export default defineComponent({
  name: 'App',

  components: {
    RouterView,
    AddWidgetDialog
  },

  setup () {
    const theme = useThemeStore()
    return { theme }
  },

  data () {
    return {
      showAddWidget: false
    }
  },

  computed: {
    themeIcon (): string {
      switch (this.theme.mode) {
        case 'light': return '\u2600'
        case 'dark': return '\u263E'
        default: return '\u25D1'
      }
    },

    themeTitle (): string {
      switch (this.theme.mode) {
        case 'light': return 'Theme: Light (click to switch)'
        case 'dark': return 'Theme: Dark (click to switch)'
        default: return 'Theme: System (click to switch)'
      }
    }
  }
})
</script>

<template>
  <header class="app-header">
    <h1 class="app-title">VibesNet</h1>
    <div class="app-actions">
      <button class="header-btn theme-btn" :title="themeTitle" @click="theme.cycle()">
        {{ themeIcon }}
      </button>
      <button class="header-btn" @click="showAddWidget = true">
        + Add Widget
      </button>
    </div>
  </header>

  <RouterView />

  <AddWidgetDialog v-model:open="showAddWidget" />
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-accent);
}

.app-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.app-actions {
  display: flex;
  gap: 0.5rem;
}

.header-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.22);
}

.theme-btn {
  font-size: 1rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
}
</style>

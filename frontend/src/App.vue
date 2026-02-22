<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import AddWidgetDialog from '@/components/dashboard/AddWidgetDialog.vue'

export default defineComponent({
  name: 'App',

  components: {
    RouterView,
    AddWidgetDialog
  },

  data () {
    return {
      showAddWidget: false
    }
  }
})
</script>

<template>
  <header class="app-header">
    <h1 class="app-title">VibesNet</h1>
    <div class="app-actions">
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
</style>

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
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

.app-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
}

.app-actions {
  display: flex;
  gap: 0.5rem;
}

.header-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
}

.header-btn:hover {
  background: var(--color-background-mute);
}
</style>

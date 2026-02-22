<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { RssWidgetConfig } from '../types'

export default defineComponent({
  name: 'RssEditDialog',

  props: {
    open: {
      type: Boolean,
      required: true
    },
    config: {
      type: Object as PropType<RssWidgetConfig>,
      required: true
    }
  },

  emits: ['update:open', 'save'],

  data () {
    return {
      title: this.config.title,
      feedUrl: this.config.feedUrl,
      refreshInterval: this.config.refreshInterval,
      maxItems: this.config.maxItems
    }
  },

  watch: {
    config: {
      handler (newConfig: RssWidgetConfig) {
        this.title = newConfig.title
        this.feedUrl = newConfig.feedUrl
        this.refreshInterval = newConfig.refreshInterval
        this.maxItems = newConfig.maxItems
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
        feedUrl: this.feedUrl,
        refreshInterval: this.refreshInterval,
        maxItems: this.maxItems
      })
      this.close()
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dialog-overlay" @click.self="close">
      <div class="dialog">
        <header class="dialog-header">
          <h2>Edit RSS Feed</h2>
          <button class="dialog-close" @click="close">&times;</button>
        </header>

        <div class="dialog-content">
          <label class="form-label">
            Title
            <input v-model="title" type="text" class="form-input">
          </label>

          <label class="form-label">
            Feed URL
            <input v-model="feedUrl" type="url" class="form-input" placeholder="https://example.com/feed.xml">
          </label>

          <label class="form-label">
            Refresh interval (minutes)
            <input v-model.number="refreshInterval" type="number" min="1" max="60" class="form-input">
          </label>

          <label class="form-label">
            Max items to display
            <input v-model.number="maxItems" type="number" min="1" max="50" class="form-input">
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
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-soft);
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
}

.btn:hover {
  opacity: 0.9;
}
</style>

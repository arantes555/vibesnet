<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmDialog',

  props: {
    open: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Confirm'
    },
    message: {
      type: String,
      default: 'Are you sure?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    danger: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:open', 'confirm', 'cancel'],

  methods: {
    close () {
      this.$emit('update:open', false)
      this.$emit('cancel')
    },

    confirm () {
      this.$emit('update:open', false)
      this.$emit('confirm')
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dialog-overlay" @click.self="close">
      <div class="dialog">
        <header class="dialog-header">
          <h2>{{ title }}</h2>
        </header>

        <div class="dialog-content">
          <p>{{ message }}</p>
        </div>

        <footer class="dialog-footer">
          <button class="btn btn-secondary" @click="close">
            {{ cancelText }}
          </button>
          <button
            class="btn"
            :class="danger ? 'btn-danger' : 'btn-primary'"
            @click="confirm"
          >
            {{ confirmText }}
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
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.125rem;
}

.dialog-content {
  padding: 1rem;
}

.dialog-content p {
  margin: 0;
  color: var(--color-text);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
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

.btn-danger {
  background: #e53935;
  color: white;
  border-color: #e53935;
}

.btn:hover {
  opacity: 0.9;
}
</style>

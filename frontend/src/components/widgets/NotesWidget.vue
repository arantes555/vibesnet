<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { NotesWidgetConfig } from './types'

export default defineComponent({
  name: 'NotesWidget',

  props: {
    config: {
      type: Object as PropType<NotesWidgetConfig>,
      required: true
    }
  },

  emits: ['update:config'],

  data () {
    return {
      localContent: this.config.content,
      debounceTimeout: undefined as number | undefined
    }
  },

  watch: {
    'config.content' (newContent: string) {
      if (newContent !== this.localContent) {
        this.localContent = newContent
      }
    },

    localContent (newContent: string) {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }
      this.debounceTimeout = window.setTimeout(() => {
        this.$emit('update:config', { ...this.config, content: newContent })
      }, 500)
    }
  },

  beforeUnmount () {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }
  }
})
</script>

<template>
  <div class="notes">
    <textarea
      v-model="localContent"
      class="notes-textarea"
      placeholder="Write your notes here..."
    />
  </div>
</template>

<style scoped>
.notes {
  height: 100%;
}

.notes-textarea {
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: none;
}

.notes-textarea:focus {
  outline: none;
}

.notes-textarea::placeholder {
  color: var(--color-text);
  opacity: 0.5;
}
</style>

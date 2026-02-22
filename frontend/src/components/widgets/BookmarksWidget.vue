<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { BookmarksWidgetConfig, Bookmark } from './types'

export default defineComponent({
  name: 'BookmarksWidget',

  props: {
    config: {
      type: Object as PropType<BookmarksWidgetConfig>,
      required: true
    }
  },

  emits: ['update:config'],

  data () {
    return {
      isAdding: false,
      newName: '',
      newUrl: ''
    }
  },

  methods: {
    addBookmark () {
      if (!this.newName.trim() || !this.newUrl.trim()) return

      let url = this.newUrl.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      const bookmark: Bookmark = {
        id: crypto.randomUUID(),
        name: this.newName.trim(),
        url
      }

      this.$emit('update:config', {
        ...this.config,
        bookmarks: [...this.config.bookmarks, bookmark]
      })

      this.newName = ''
      this.newUrl = ''
      this.isAdding = false
    },

    removeBookmark (id: string) {
      this.$emit('update:config', {
        ...this.config,
        bookmarks: this.config.bookmarks.filter(b => b.id !== id)
      })
    },

    getFaviconUrl (url: string): string | null {
      try {
        const hostname = new URL(url).hostname
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
      } catch {
        return null
      }
    }
  }
})
</script>

<template>
  <div class="bookmarks">
    <ul class="bookmarks-list">
      <li v-for="bookmark in config.bookmarks" :key="bookmark.id" class="bookmark-item">
        <a :href="bookmark.url" target="_blank" rel="noopener" class="bookmark-link">
          <img
            v-if="getFaviconUrl(bookmark.url)"
            :src="getFaviconUrl(bookmark.url)!"
            class="bookmark-icon"
            alt=""
          >
          <span class="bookmark-name">{{ bookmark.name }}</span>
        </a>
        <button class="bookmark-remove" title="Remove" @click="removeBookmark(bookmark.id)">
          &times;
        </button>
      </li>
    </ul>

    <div v-if="isAdding" class="bookmark-form">
      <input
        v-model="newName"
        type="text"
        placeholder="Name"
        class="bookmark-input"
        @keyup.enter="addBookmark"
      >
      <input
        v-model="newUrl"
        type="text"
        placeholder="URL"
        class="bookmark-input"
        @keyup.enter="addBookmark"
      >
      <div class="bookmark-form-actions">
        <button class="btn btn-sm" @click="addBookmark">Add</button>
        <button class="btn btn-sm btn-secondary" @click="isAdding = false">Cancel</button>
      </div>
    </div>

    <button v-else class="btn btn-sm add-btn" @click="isAdding = true">
      + Add Bookmark
    </button>
  </div>
</template>

<style scoped>
.bookmarks {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bookmarks-list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow: auto;
}

.bookmark-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
  border-bottom: 1px solid var(--color-border);
}

.bookmark-item:last-child {
  border-bottom: none;
}

.bookmark-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  color: var(--color-text);
  text-decoration: none;
  min-width: 0;
}

.bookmark-link:hover {
  color: var(--color-heading);
}

.bookmark-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.bookmark-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
}

.bookmark-remove {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text);
  opacity: 0.5;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.bookmark-remove:hover {
  opacity: 1;
}

.bookmark-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.bookmark-input {
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
}

.bookmark-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-soft);
}

.bookmark-form-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.75rem;
  cursor: pointer;
}

.btn:hover {
  background: var(--color-background-mute);
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}

.btn-secondary {
  background: transparent;
}

.add-btn {
  margin-top: auto;
}
</style>

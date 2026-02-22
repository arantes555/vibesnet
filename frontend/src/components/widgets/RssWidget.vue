<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { RssWidgetConfig } from './types'
import { fetchRssFeed, mergeItems, type RssFeedData } from '@/services/rss'

const ITEM_HEIGHT_ESTIMATE = 50
const BATCH_SIZE = 20

export default defineComponent({
  name: 'RssWidget',

  props: {
    config: {
      type: Object as PropType<RssWidgetConfig>,
      required: true
    }
  },

  emits: ['update:config', 'update:loading'],

  data () {
    return {
      feed: null as RssFeedData | null,
      loading: false,
      error: null as string | null,
      refreshInterval: undefined as number | undefined,
      displayCount: BATCH_SIZE
    }
  },

  computed: {
    allItems () {
      return this.config.cachedItems ?? this.feed?.items ?? []
    },

    displayedItems () {
      return this.allItems.slice(0, this.displayCount)
    },

    hasMore (): boolean {
      return this.displayCount < this.allItems.length
    }
  },

  watch: {
    'config.feedUrl': {
      handler () {
        this.loadFeed()
      },
      immediate: true
    },

    'config.refreshInterval': {
      handler () {
        this.setupRefresh()
      },
      immediate: true
    },

    loading (val: boolean) {
      this.$emit('update:loading', val)
    }
  },

  mounted () {
    this.computeInitialCount()
  },

  beforeUnmount () {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },

  methods: {
    computeInitialCount () {
      const el = this.$refs.scroller as HTMLElement | undefined
      if (!el) return
      const visibleHeight = el.clientHeight
      const fitCount = Math.ceil(visibleHeight / ITEM_HEIGHT_ESTIMATE)
      this.displayCount = Math.max(fitCount * 2, BATCH_SIZE)
    },

    onScroll (event: Event) {
      if (!this.hasMore) return
      const el = event.target as HTMLElement
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200
      if (nearBottom) {
        this.displayCount += BATCH_SIZE
      }
    },

    async loadFeed () {
      if (!this.config.feedUrl) return

      this.loading = true
      this.error = null

      try {
        const isInitial = !this.config.cachedItems?.length
        const { data, usedProxy } = await fetchRssFeed(this.config.feedUrl, this.config.useProxy)
        this.feed = data
        const cached = mergeItems(this.config.cachedItems ?? [], data.items)
        const updates: Partial<RssWidgetConfig> = { cachedItems: cached, useProxy: usedProxy }
        if (isInitial && data.title) {
          updates.title = data.title
        }
        this.$emit('update:config', { ...this.config, ...updates })
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to fetch feed'
      } finally {
        this.loading = false
      }
    },

    setupRefresh () {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
      }
      if (this.config.refreshInterval > 0) {
        this.refreshInterval = window.setInterval(
          () => this.loadFeed(),
          this.config.refreshInterval * 60 * 1000
        )
      }
    },

    formatDate (dateStr: string): string {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleDateString()
    }
  }
})
</script>

<template>
  <div ref="scroller" class="rss" @scroll="onScroll">
    <div v-if="error && !displayedItems.length" class="rss-error">
      {{ error }}
    </div>

    <div v-else-if="loading && !displayedItems.length" class="rss-loading">
      Loading...
    </div>

    <ul v-else-if="displayedItems.length" class="rss-list">
      <li
        v-for="(item, index) in displayedItems"
        :key="index"
        class="rss-item"
      >
        <a :href="item.link" target="_blank" rel="noopener" class="rss-link">
          <img
            v-if="item.image"
            :src="item.image"
            alt=""
            class="rss-image"
            loading="lazy"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          >
          <div class="rss-content">
            <span class="rss-title">{{ item.title }}</span>
            <span v-if="item.pubDate" class="rss-date">{{ formatDate(item.pubDate) }}</span>
          </div>
        </a>
      </li>
    </ul>

    <div v-else class="rss-empty">
      No feed URL configured
    </div>
  </div>
</template>

<style scoped>
.rss {
  height: 100%;
  overflow: auto;
}

.rss-loading,
.rss-error,
.rss-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.875rem;
}

.rss-error {
  color: #e53935;
}

.rss-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rss-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.rss-item:last-child {
  border-bottom: none;
}

.rss-link {
  display: flex;
  gap: 0.5rem;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.4;
}

.rss-link:hover {
  color: var(--color-heading);
}

.rss-image {
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.rss-content {
  flex: 1;
  min-width: 0;
}

.rss-title {
  display: block;
}

.rss-date {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.6;
  margin-top: 0.125rem;
}
</style>

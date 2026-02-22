<script lang="ts">
import { defineComponent, defineAsyncComponent, type PropType } from 'vue'
import type { WidgetConfig, WidgetType } from './types'
import BaseWidget from './BaseWidget.vue'
import WidgetMenu from '@/components/ui/WidgetMenu.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ClockEditDialog from './dialogs/ClockEditDialog.vue'
import RssEditDialog from './dialogs/RssEditDialog.vue'
import WeatherEditDialog from './dialogs/WeatherEditDialog.vue'

const widgetComponents: Record<WidgetType, ReturnType<typeof defineAsyncComponent>> = {
  rss: defineAsyncComponent(() => import('./RssWidget.vue')),
  weather: defineAsyncComponent(() => import('./WeatherWidget.vue')),
  clock: defineAsyncComponent(() => import('./ClockWidget.vue')),
  notes: defineAsyncComponent(() => import('./NotesWidget.vue')),
  bookmarks: defineAsyncComponent(() => import('./BookmarksWidget.vue'))
}

const editableWidgets: WidgetType[] = ['clock', 'rss', 'weather']

export default defineComponent({
  name: 'WidgetFactory',

  components: {
    BaseWidget,
    WidgetMenu,
    ConfirmDialog,
    ClockEditDialog,
    RssEditDialog,
    WeatherEditDialog
  },

  props: {
    config: {
      type: Object as PropType<WidgetConfig>,
      required: true
    }
  },

  emits: ['remove', 'update:config'],

  data () {
    return {
      showEditDialog: false,
      showDeleteConfirm: false,
      childLoading: false,
      unreadCount: 0
    }
  },

  computed: {
    widgetComponent () {
      return widgetComponents[this.config.type]
    },

    hasEditDialog (): boolean {
      return editableWidgets.includes(this.config.type)
    },

    menuItems () {
      const items = []

      if (this.hasEditDialog) {
        items.push({ label: 'Edit', action: 'edit' })
      }

      items.push({ label: 'Remove', action: 'remove', danger: true })

      return items
    }
  },

  methods: {
    handleMenuSelect (action: string) {
      if (action === 'edit') {
        this.showEditDialog = true
      } else if (action === 'remove') {
        this.showDeleteConfirm = true
      }
    },

    handleEditSave (updatedConfig: WidgetConfig) {
      this.$emit('update:config', updatedConfig)
    },

    handleDeleteConfirm () {
      this.$emit('remove')
    },

    refreshChild () {
      const child = this.$refs.widgetChild as { loadFeed?: () => void } | undefined
      if (child?.loadFeed) {
        child.loadFeed()
      }
    },

    markAllRead () {
      const child = this.$refs.widgetChild as { markAllAsRead?: () => void } | undefined
      if (child?.markAllAsRead) {
        child.markAllAsRead()
      }
    }
  }
})
</script>

<template>
  <BaseWidget :config="config" :draggable="true">
    <template #header-status>
      <button
        v-if="config.type === 'rss' && unreadCount > 0"
        class="header-btn header-btn--badge"
        title="Mark all as read"
        @click="markAllRead"
      >
        <span class="unread-badge">{{ unreadCount }}</span>
      </button>
      <button
        v-if="config.type === 'rss' && !childLoading"
        class="header-btn"
        title="Refresh"
        @click="refreshChild"
      >
        &#8635;
      </button>
      <span
        v-else-if="config.type === 'rss' && childLoading"
        class="header-spinner"
        title="Loading..."
      />
    </template>

    <template #menu>
      <WidgetMenu :items="menuItems" @select="handleMenuSelect" />
    </template>

    <component
      :is="widgetComponent"
      ref="widgetChild"
      :config="config"
      @update:config="$emit('update:config', $event)"
      @update:loading="childLoading = $event"
      @update:unread-count="unreadCount = $event"
    />
  </BaseWidget>

  <ClockEditDialog
    v-if="config.type === 'clock'"
    v-model:open="showEditDialog"
    :config="config"
    @save="handleEditSave"
  />

  <RssEditDialog
    v-if="config.type === 'rss'"
    v-model:open="showEditDialog"
    :config="config"
    @save="handleEditSave"
  />

  <WeatherEditDialog
    v-if="config.type === 'weather'"
    v-model:open="showEditDialog"
    :config="config"
    @save="handleEditSave"
  />

  <ConfirmDialog
    v-model:open="showDeleteConfirm"
    title="Remove Widget"
    message="Are you sure you want to remove this widget?"
    confirm-text="Remove"
    :danger="true"
    @confirm="handleDeleteConfirm"
  />
</template>

<style scoped>
.header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.875rem;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.header-btn:hover {
  opacity: 1;
}

.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: #ffffff;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1;
}

.header-spinner {
  display: inline-block;
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

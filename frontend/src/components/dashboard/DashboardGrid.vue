<script lang="ts">
import { defineComponent } from 'vue'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useDashboardStore } from '@/stores/dashboard'
import WidgetFactory from '@/components/widgets/WidgetFactory.vue'
export default defineComponent({
  name: 'DashboardGrid',

  components: {
    GridLayout,
    GridItem,
    WidgetFactory
  },

  setup () {
    const store = useDashboardStore()
    return { store }
  },

  mounted () {
    this.store.loadDashboard()
  },

  methods: {
    onLayoutUpdate () {
      this.store.updateLayout()
    }
  }
})
</script>

<template>
  <div class="dashboard">
    <GridLayout
      v-if="store.isLoaded"
      v-model:layout="store.layoutItems"
      :col-num="3"
      :row-height="80"
      :is-draggable="true"
      :is-resizable="false"
      :vertical-compact="true"
      :use-css-transforms="true"
      :responsive="true"
      :breakpoints="{ lg: 768, md: 768, sm: 0, xs: 0, xxs: 0 }"
      :cols="{ lg: 3, md: 3, sm: 1, xs: 1, xxs: 1 }"
      @layout-updated="onLayoutUpdate"
    >
      <GridItem
        v-for="widget in store.widgets"
        :key="widget.config.id"
        :x="widget.position.x"
        :y="widget.position.y"
        :w="widget.position.w"
        :h="widget.position.h"
        :i="widget.config.id"
        drag-allow-from=".widget-header"
      >
        <WidgetFactory
          :config="widget.config"
          @remove="store.removeWidget(widget.config.id)"
          @update:config="store.setWidgetConfig(widget.config.id, $event)"
        />
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1rem;
  min-height: calc(100vh - 4rem);
}

.dashboard :deep(.vgl-layout) {
  --vgl-placeholder-bg: var(--color-border);
  --vgl-placeholder-opacity: 50%;
}
</style>

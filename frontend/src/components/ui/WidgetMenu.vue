<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface MenuItem {
  label: string
  action: string
  danger?: boolean
}

export default defineComponent({
  name: 'WidgetMenu',

  props: {
    items: {
      type: Array as PropType<MenuItem[]>,
      required: true
    }
  },

  emits: ['select'],

  data () {
    return {
      isOpen: false
    }
  },

  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    },

    select (action: string) {
      this.isOpen = false
      this.$emit('select', action)
    },

    handleClickOutside (event: Event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false
      }
    }
  },

  mounted () {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount () {
    document.removeEventListener('click', this.handleClickOutside)
  }
})
</script>

<template>
  <div class="widget-menu">
    <button class="menu-trigger" title="Menu" @click.stop="toggle">
      <span class="menu-icon">&#8942;</span>
    </button>

    <div v-if="isOpen" class="menu-dropdown">
      <button
        v-for="item in items"
        :key="item.action"
        class="menu-item"
        :class="{ 'menu-item-danger': item.danger }"
        @click="select(item.action)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.widget-menu {
  position: relative;
}

.menu-trigger {
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
  font-size: 1rem;
}

.menu-trigger:hover {
  background: var(--color-border-hover);
}

.menu-icon {
  line-height: 1;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  min-width: 120px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background: var(--color-background-mute);
}

.menu-item-danger {
  color: #e53935;
}

.menu-item-danger:hover {
  background: rgba(229, 57, 53, 0.1);
}
</style>

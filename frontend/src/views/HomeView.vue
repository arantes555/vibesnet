<script lang="ts">
import { defineComponent } from 'vue'
import DashboardGrid from '@/components/dashboard/DashboardGrid.vue'

export default defineComponent({
  name: 'HomeView',

  components: {
    DashboardGrid
  }
})
</script>

<template>
  <main>
    <DashboardGrid />
  </main>
</template>

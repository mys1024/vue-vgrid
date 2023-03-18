<script setup lang="ts">
import { ref } from 'vue'

import VirtualGrid from './VirtualGrid.vue'

const visible = ref(false)

const rows = new Array(100000).fill(0).map((_, y) => {
  return new Array(100).fill(0).map((_, x) => `(${y}, ${x}, This is a test string)`)
})
</script>

<template>
  <div>
    <div>
      <button @click="visible = !visible">
        Toggle visible
      </button>
    </div>
    <VirtualGrid
      v-if="visible"
      :view-height="800" :view-width="900"
      :row-height="25" :col-width="400"
      :row-count="rows.length" :col-count="rows[0].length"
    >
      <template #cell="{ y, x }">
        <div
          :style="{
            fontFamily: 'Consolas, monospace',
          }"
        >
          {{ rows[y][x] }}
        </div>
      </template>
    </VirtualGrid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VGrid } from 'vue-vgrid'
import 'vue-vgrid/style.css'

const visible = ref(false)

const rows = new Array(100000).fill(0).map((_, y) => {
  return new Array(100).fill(0).map((_, x) => `(${y}, ${x}, This is a test string)`)
})
</script>

<template>
  <div>
    <div style="margin-bottom: 16px;">
      <button @click="visible = !visible">
        Toggle visible
      </button>
    </div>
    <VGrid
      v-if="visible"
      :view-height="600" :view-width="600"
      :row-height="25" :col-width="360"
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
    </VGrid>
  </div>
</template>

<script setup lang="ts">
import VTable from './VTable.vue'
</script>

<template>
  <div>
    <VTable  
      :view-height="600" :view-width="600"
      :row-height="24" :col-width="100"
      :row-count="10000" :col-count="1000"
    />
  </div>
</template>

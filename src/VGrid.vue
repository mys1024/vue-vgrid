<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  viewHeight: number
  viewWidth: number
  rowCount: number
  rowHeight: number | number[]
  colCount: number
  colWidth: number | number[]
}>()

const viewScrollTop = ref(0)
const viewScrollLeft = ref(0)

const rowOffsets = computed(() => {
  if (!Array.isArray(props.rowHeight))
    return []
  const offsets = new Array<number>(props.rowHeight.length + 1)
  let acc = 0
  props.rowHeight.forEach((height, y) => {
    offsets[y] = acc
    acc += height
  })
  offsets[offsets.length - 1] = acc
  return offsets
})
const colOffsets = computed(() => {
  if (!Array.isArray(props.colWidth))
    return []
  const offsets = new Array<number>(props.colWidth.length + 1)
  let acc = 0
  props.colWidth.forEach((width, x) => {
    offsets[x] = acc
    acc += width
  })
  offsets[offsets.length - 1] = acc
  return offsets
})

const containerHeight = computed(() => (
  Array.isArray(props.rowHeight)
    ? rowOffsets.value[rowOffsets.value.length - 1]
    : props.rowHeight * props.rowCount
))
const containerWidth = computed(() => (
  Array.isArray(props.colWidth)
    ? colOffsets.value[colOffsets.value.length - 1]
    : props.colWidth * props.colCount
))

const viewHeightStr = computed(() => `${props.viewHeight}px`)
const viewWidthStr = computed(() => `${props.viewWidth}px`)
const containerHeightStr = computed(() => `${containerHeight.value}px`)
const containerWidthStr = computed(() => `${containerWidth.value}px`)

const xStart = computed(() => (
  Array.isArray(props.colWidth)
    ? ensureX(binarySearch(colOffsets.value, viewScrollLeft.value) - 1)
    : Math.floor(viewScrollLeft.value / props.colWidth)
))
const xEnd  = computed(() => (
  Array.isArray(props.colWidth)
    ? ensureX(binarySearch(colOffsets.value, viewScrollLeft.value + props.viewWidth, props.colCount - 1))
    : ensureX(Math.floor((viewScrollLeft.value + props.viewWidth) / props.colWidth))
))
const yStart = computed(() => (
  Array.isArray(props.rowHeight)
    ? ensureY(binarySearch(rowOffsets.value, viewScrollTop.value) - 1)
    : Math.floor(viewScrollTop.value / props.rowHeight)
))
const yEnd  = computed(() => (Array.isArray(props.rowHeight)
    ? ensureY(binarySearch(rowOffsets.value, viewScrollTop.value + props.viewHeight, props.rowCount - 1))
    : ensureY(Math.floor((viewScrollTop.value + props.viewHeight) / props.rowHeight))
))

function ensureX(x: number) {
  return x < 0 ? 0 : (x > props.colCount - 1 ? props.colCount - 1 : x)
}

function ensureY(y: number) {
  return y < 0 ? 0 : (y > props.rowCount - 1 ? props.rowCount - 1 : y)
}

function getColWidth(x: number) {
  return Array.isArray(props.colWidth) ? props.colWidth[x] : props.colWidth
}

function getRowHeight(y: number) {
  return Array.isArray(props.rowHeight) ? props.rowHeight[y] : props.rowHeight
}

function getXOffset(x: number) {
  return Array.isArray(props.colWidth) ? colOffsets.value[x] : x * props.colWidth
}

function getYOffset(y: number) {
  return Array.isArray(props.rowHeight) ? rowOffsets.value[y] : y * props.rowHeight
}

function *range(start: number, end: number) {
  for (let i = start; i < end; i++)
    yield i
}

function binarySearch(sortedArr: number[], greaterThan: number, fallback = -1) {
  let left = 0;
  let right = sortedArr.length - 1;
  let index = fallback;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] > greaterThan) {
      index = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return index;
}

function onScroll(event: Event) {
  const target = event.target as HTMLElement
  viewScrollTop.value = target.scrollTop
  viewScrollLeft.value = target.scrollLeft
}
</script>

<template>
  <div class="virtual-grid-view" @scroll="onScroll">
    <div class="virtual-grid-container">
      <div
        v-for="y in range(yStart, yEnd + 1)" :key="y"
        class="virtual-grid-row"
        :style="{
          height: `${getRowHeight(y)}px`,
          transform: `translateY(${getYOffset(y)}px)`
        }"
      >
        <div
          v-for="x in range(xStart, xEnd + 1)" :key="x"
          class="virtual-grid-cell"
          :style="{
            width: `${getColWidth(x)}px`,
            transform: `translateX(${getXOffset(x)}px)`
          }"
        >
          <slot name="cell" :y="y" :x="x" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-grid-view {
  height: v-bind(viewHeightStr);
  width: v-bind(viewWidthStr);
  overflow: auto;
}

.virtual-grid-container {
  height: v-bind(containerHeightStr);
  width: v-bind(containerWidthStr);
  position: relative;
}

.virtual-grid-row {
  width: v-bind(containerWidthStr);
  position: absolute;
  top: 0;
  left: 0;
}

.virtual-grid-cell {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

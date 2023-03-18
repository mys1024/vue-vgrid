import { customRef, watchEffect, computed } from 'vue'

export function memoRef<T>(value: T) {
  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      if (value === newValue)
        return
      value = newValue
      trigger()
    } 
  }))
}

export function memoComputed<T>(getter: () => T) {
  const memo = memoRef(getter())
  watchEffect(() => {
    memo.value = getter()
  })
  return computed(() => memo.value)
}

export function binarySearch(arr: number[], greaterThan: number, fallback = -1): number {
  let left = 0;
  let right = arr.length - 1;
  let ans = fallback;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] > greaterThan) {
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return ans;
}

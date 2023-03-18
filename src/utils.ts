import { customRef, watchEffect, computed } from 'vue'

export function debouncedRef<T>(value: T, delay = 0) {
  let timeout = -1
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

export function debouncedComputed<T>(getter: () => T, delay = 0) {
  const _ref = debouncedRef(getter(), delay)
  watchEffect(() => {
    _ref.value = getter()
  })
  return computed(() => _ref.value)
}

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
  const _ref = memoRef(getter())
  watchEffect(() => {
    _ref.value = getter()
  })
  return computed(() => _ref.value)
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

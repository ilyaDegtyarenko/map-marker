import type { AnyFn } from '@/ts/types/common'
import { readonly, ref } from 'vue'
import { tryOnScopeDispose } from '@/utils/tryOnScopeDispose.ts'

type Options = {
  interval?: boolean
  immediate?: boolean
  callAtStart?: boolean
}

export const useTimer = <Callback extends AnyFn>(
  fn: Callback,
  ms: number,
  options: Options = {},
) => {
  const {
    interval = false,
    immediate = false,
    callAtStart = false,
  } = options

  const pending = ref<boolean>(false)
  const setTimer = interval ? setInterval : setTimeout
  const clearTimer = interval ? clearInterval : clearTimeout

  const timerId = ref<ReturnType<typeof setTimer> | undefined>()
  let startTime: number | undefined
  let remaining = ms

  const clear = (): void => {
    if (!timerId.value) {
      return
    }

    clearTimer(timerId.value)

    timerId.value = undefined
    startTime = undefined
  }

  const stop = (): void => {
    pending.value = false

    clear()
  }

  const start = (...args: unknown[]): number => {
    pending.value = true

    clear()

    if (callAtStart) {
      fn(...args)
    }

    startTime = Date.now()

    timerId.value = setTimer(() => {
      if (!interval) {
        stop()
      }

      fn(...args)
    }, remaining)

    return remaining
  }

  const pause = (): void => {
    clearTimer(timerId.value)

    if (!interval) {
      remaining -= Date.now() - startTime!
    }
  }

  if (immediate) {
    start()
  }

  tryOnScopeDispose(stop)

  return {
    id: timerId,
    pending: readonly(pending),
    start,
    pause,
    stop,
  }
}

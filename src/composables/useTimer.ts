import type { AnyFn } from '@/ts/types/common'
import { readonly, ref } from 'vue'
import { tryOnScopeDispose } from '@/utils/tryOnScopeDispose.ts'

type Options = {
  interval?: boolean
  immediate?: boolean
  callAtStart?: boolean
}

/**
 * A utility function that manages timer functionalities such as starting,
 * pausing, stopping, and controlling execution based on a specified delay or interval.
 *
 * @template Callback - The type of the callback function to be executed.
 * @param fn - The function to be executed after the timer's delay or at set intervals.
 * @param ms - The delay in milliseconds for the timer or the interval between executions.
 * @param [options={}] - Object to configure the timer behavior.
 * @param [options.interval=false] - If true, the timer runs as an interval, executing the callback repeatedly.
 * @param [options.immediate=false] - If true, the timer starts immediately upon initialization.
 * @param [options.callAtStart=false] - If true, the callback is executed immediately when the timer starts.
 * @returns An object providing control over the timer, with the following properties:
 * - `id`: A reactive reference to the timer ID.
 * - `pending`: A readonly reference indicating whether the timer is currently active.
 * - `start`: A function to start or restart the timer, optionally accepting arguments to pass to the callback.
 * - `pause`: A function to pause the timer, preserving the remaining time for resumption.
 * - `stop`: A function to stop and clear the timer completely.
 */
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

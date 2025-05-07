import type { AnyFn } from '@/ts/types/common'
import { useTimer } from '@/composables/useTimer.ts'

type Options = {
  immediate?: boolean
}

/**
 * Creates a debounced version of a function, which delays the execution of the function
 * until after the specified delay time has elapsed since the last time the debounced
 * function was invoked. Optional immediate execution can be configured.
 *
 * @param fn - The function to debounce.
 * @param delay - The amount of delay in milliseconds before the function is invoked.
 * @param [options={}] - Optional configuration object for the debounced behavior.
 * @param [options.immediate=false] - If true, the function will be invoked immediately on the
 * first call instead of waiting for the delay.
 * @returns {AnyFn<void>} A debounced version of the supplied function.
 */
export const debounceFn = (fn: AnyFn, delay: number, options: Options = {}): AnyFn<void> => {
  let immediateCallOccurred = false

  const timer = useTimer((args) => {
    if (immediateCallOccurred) {
      immediateCallOccurred = false
    } else {
      fn(...(args as unknown[]))
    }
  }, delay)

  return (...args: unknown[]): void => {
    if (options.immediate) {
      if (!immediateCallOccurred) {
        immediateCallOccurred = true

        fn(...args)
      }
    }

    timer.start(args)
  }
}

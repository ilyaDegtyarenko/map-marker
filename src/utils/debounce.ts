import type { AnyFn } from '@/ts/types/common'
import { useTimer } from '@/composables/useTimer.ts'

type Options = {
  immediate?: boolean
}

export const debounceFn = (fn: AnyFn, delay: number, options: Options = {}): AnyFn<void> => {
  let immediateCallOccurred = false

  const timer = useTimer((args) => {
    if (immediateCallOccurred) {
      immediateCallOccurred = false
    } else {
      fn(...args as unknown[])
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

import type { AnyFn } from '@/ts/types/common'
import { useTimer } from '@/composables/useTimer.ts'

export const throttleFn = (fn: AnyFn, delay: number): AnyFn<void> => {
  let isThrottled = false
  let lastArgs: unknown[] | undefined

  const timer = useTimer(() => {
    isThrottled = false

    if (lastArgs) {
      handler(...lastArgs)

      lastArgs = undefined
    }
  }, delay)

  const handler = (...args: unknown[]): void => {
    if (isThrottled) {
      lastArgs = args

      return
    }

    isThrottled = true

    fn(...args)

    timer.start()
  }

  return handler
}

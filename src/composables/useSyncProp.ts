import type { WritableComputedRef } from 'vue'
import { computed } from 'vue'

export const useSyncProp = <T>(
  props: ReturnType<typeof defineProps>,
  key: string,
  emit: ReturnType<typeof defineEmits>,
  options?: {
    onGet?: (value: T) => void
    onSet?: (value: T) => void
  },
): WritableComputedRef<T> => {
  return computed<T>({
    get() {
      if (options?.onGet) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options.onGet(props[key])
      }

      return props[key]
    },
    set(value: T) {
      if (options?.onSet) {
        options.onSet(value)
      }

      emit(`update:${ key }`, value)
    },
  })
}

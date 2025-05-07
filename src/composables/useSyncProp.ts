import type { WritableComputedRef } from 'vue'
import { computed } from 'vue'

/**
 * Synchronizes a prop with a local state and emits events when the state changes.
 * This helper is useful for creating two-way bindings between a component's internal state
 * and its props while adding optional hooks for executing custom logic on get and set operations.
 *
 * @template T - The data type of the synchronized property.
 * @param props - The props object output from the `defineProps` function, containing the prop to synchronize.
 * @param key - The key of the prop within the props object to be synchronized.
 * @param emit - The emit function from the `defineEmits` definition, used to emit events for prop updates.
 * @param [options] - Optional configuration for handling custom logic on get and set operations.
 * @param [options.onGet] - A callback function invoked whenever the synchronized prop's value is accessed.
 * @param [options.onSet] - A callback function invoked whenever the synchronized prop's value is updated.
 * @returns {WritableComputedRef<T>} A writable computed reference that synchronizes the specified prop with local state and emits updates.
 */
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
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

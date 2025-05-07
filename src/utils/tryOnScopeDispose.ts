import { getCurrentScope, onScopeDispose } from 'vue'

/**
 * Registers a callback function to be invoked when the current scope is disposed of.
 * This utility function checks if there is an active scope and links the provided
 * callback to it, ensuring the callback is executed as a side effect of the scope's
 * disposal.
 *
 * @param callback - The function to be executed upon scope disposal.
 * @throws Will not register the callback if no current scope exists.
 */
export const tryOnScopeDispose = (callback: VoidFunction): void => {
  if (getCurrentScope()) {
    onScopeDispose(callback)
  }
}

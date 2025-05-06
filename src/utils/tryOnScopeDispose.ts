import { getCurrentScope, onScopeDispose } from 'vue'

export const tryOnScopeDispose = (callback: VoidFunction): void => {
  if (getCurrentScope()) {
    onScopeDispose(callback)
  }
}

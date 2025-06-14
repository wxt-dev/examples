import { writable } from "svelte/store";
import type { StorageItemKey } from "wxt/utils/storage";

// In theory, it should be possible to remove the storageItem.watch call
// and only listen to changes in the svelte store,
// but then the changes don't propagate from popup to content/background.
// Improvements welcome!
function createStore<T>(value: T, storageKey: StorageItemKey) {
  const { subscribe, set } = writable(value);

  const storageItem = storage.defineItem<T>(storageKey, {
    fallback: value,
  });

  storageItem.getValue().then(set);

  const unwatch = storageItem.watch(set); // not sure when or where to call unwatch

  return {
    subscribe,
    set: (value: T) => {
      storageItem.setValue(value);
    },
  };
}

export const someProperty = createStore(true, "local:someProperty");

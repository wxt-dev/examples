import { writable } from "svelte/store";

// In theory, it should be possible to remove the wxtStore.watch call 
// and only listen to changes in the svelte store, 
// but then the changes don't propagate from popup to content/background.
// Improvements welcome!
function createStore<T>(value: T, wxtStoreName: string) {
  const { subscribe, set } = writable(value);

  const wxtStore = storage.defineItem<T>(`local:${wxtStoreName}`, {
    fallback: value,
  });

  wxtStore.getValue().then(set);

  const unwatch = wxtStore.watch(set); // not sure when or where to call unwatch

  return {
    subscribe,
    set: (value: T) => {
      wxtStore.setValue(value);
    },
  };
}

export const someProperty = createStore(true, "someProperty");

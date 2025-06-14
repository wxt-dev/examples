import { counterStore } from "./counter-store.ts";

class CounterState {
  state = $state(counterStore.fallback);

  constructor() {
    counterStore.getValue().then(this.updateCounter);
    counterStore.watch(this.updateCounter);
  }

  updateCounter = (newState: { counter: number } | null) => {
    this.state = newState ?? counterStore.fallback;
  };
}

export const counterState = new CounterState();

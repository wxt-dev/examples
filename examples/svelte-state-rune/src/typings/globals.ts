import type { CounterEvent } from "./example.d.ts";

declare global {
  interface DocumentEventMap {
    "counter:updated": CounterEvent;
  }
}

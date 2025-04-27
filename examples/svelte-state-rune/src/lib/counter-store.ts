export const counterStore = storage.defineItem<{ counter: number }>(
  "session:counter",
  {
    fallback: { counter: 0 }
  }
);

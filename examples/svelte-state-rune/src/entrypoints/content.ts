import { counterStore } from "@/lib/counter-store";

export default defineContentScript({
  matches: ["http://localhost/*"],

  main() {
    document.addEventListener("counter:updated", (event) => {
      void counterStore.setValue(event.detail);
    });
  },
});

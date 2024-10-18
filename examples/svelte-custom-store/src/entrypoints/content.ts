import { someProperty } from "@/lib/store";
import { get } from "svelte/store";

export default defineContentScript({
  matches: ['*://*.example.org/*'],

  // open example.org to see console output when toggling

  main() {
    console.log("someProperty initial value", get(someProperty));

    someProperty.subscribe((value) => {
      console.log("someProperty changed", value);
    });

    // can also be used in background script
  },
});

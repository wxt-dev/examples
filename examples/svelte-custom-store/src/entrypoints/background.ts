import { someProperty } from "@/lib/store";
import { get } from "svelte/store";

export default defineBackground(() => {
    // Listen for the command to open the popup
    console.log("someProperty", get(someProperty));

    someProperty.subscribe((value) => {
        console.log("someProperty changed", value);
    });
  });
  
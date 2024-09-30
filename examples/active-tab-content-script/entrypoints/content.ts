import { CONTENT_SCRIPT_MATCHES } from "@/utils/matches";

export default defineContentScript({
  matches: [CONTENT_SCRIPT_MATCHES],
  // Set "registration" to runtime so this file isn't listed in manifest
  registration: "runtime",

  async main(ctx) {
    console.log("Content script executed!");

    // Optionally, return a value to the background
    return "Hello world!";
  },
});

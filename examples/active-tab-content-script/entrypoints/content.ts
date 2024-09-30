import { CONTENT_SCRIPT_MATCHES } from "@/utils/matches";

export default defineContentScript({
  // Set "registration" to runtime so this file isn't listed in manifest
  registration: "runtime",
  // URL patterns passed here are automatically added to "host_permissions"
  matches: [CONTENT_SCRIPT_MATCHES],

  async main(ctx) {
    console.log("Content script executed!");

    // Optionally, return a value to the background
    return "Hello world!";
  },
});

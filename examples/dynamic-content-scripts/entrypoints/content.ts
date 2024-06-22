export default defineContentScript({
  matches: ["*://*.wxt.dev/*"],
  main() {
    console.info("Content script loaded!");
  },
});

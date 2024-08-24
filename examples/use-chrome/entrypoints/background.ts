export default defineBackground(() => {
  // Keep using `browser` from WXT, but if you disable auto-imports, import it
  // from `wxt/browser/chrome`, not `wxt/browser`
  console.log("Hello background!", { id: browser.runtime.id });
});

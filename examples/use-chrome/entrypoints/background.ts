export default defineBackground(() => {
  // After installing `@types/chrome` and adding it to your tsconfig's `types`
  // array, you can use the `chrome` global with typescript.
  console.log("Hello background!", { id: chrome.runtime.id });
});

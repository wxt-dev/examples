export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    browser.runtime.onMessage.addListener((message, _, sendResponse) => {
      console.log("Content script received message:", message);
      sendResponse(Math.random());
      return true;
    });
  },
});

export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    browser.runtime.onMessage.addListener(async (message) => {
      console.log("Content script recieved message:", message);
      return Math.random();
    });
  },
});

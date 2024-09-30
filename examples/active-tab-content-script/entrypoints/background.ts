const contentMatch = new MatchPattern(CONTENT_SCRIPT_MATCHES);

export default defineBackground(() => {
  (browser.action ?? browser.browserAction).onClicked.addListener(
    async (tab) => {
      if (tab.id && tab.url && contentMatch.includes(tab.url)) {
        const res = await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["/content-scripts/content.js"],
        });
        console.log("result", res);
      }
    },
  );
});

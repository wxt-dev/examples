export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    // Grab tabs matching content scripts
    browser.tabs.query({}).then(async (allTabs) => {
      const contentScriptMatches = new MatchPattern("*://*/*");
      const contentScriptTabs = allTabs.filter(
        (tab) =>
          tab.id != null &&
          tab.url != null &&
          contentScriptMatches.includes(tab.url),
      );
      console.log("Sending message to tabs:", {
        message,
        tabs: contentScriptTabs,
      });

      // Forward message to tabs, collecting the responses
      const responses = await Promise.all(
        contentScriptTabs.map(async (tab) => {
          const response = await browser.tabs.sendMessage(tab.id!, message);
          return { tab: tab.id, response };
        }),
      );
      console.log("Received responses:", responses);

      // Return an array of all responses back to popup.
      sendResponse(responses);
    });

    return true;
  });
});

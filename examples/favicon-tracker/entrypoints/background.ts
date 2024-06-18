export default defineBackground(() => {
  // Open database
  const db = openExtensionDatabase();

  // Register proxy-service so other JS context's can get or insert favicons
  const faviconService = registerFaviconService(db);

  // Store favicons of websites you navigated to
  browser.tabs.onUpdated.addListener(async (id) => {
    // Grab all the tab details
    const tab = await browser.tabs.get(id);
    const url = tab.url ?? tab.pendingUrl;
    const faviconUrl = tab.favIconUrl;
    if (!url || !faviconUrl) return;

    // Add favicon to database
    const hostname = new URL(url).hostname;
    console.log(`Saving ${hostname}: ${faviconUrl}`);
    await faviconService.upsert({ hostname, faviconUrl });
  });
});

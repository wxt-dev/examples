export default defineBackground(() => {
  // See https://developer.chrome.com/docs/extensions/develop/concepts/activeTab#invoking-activeTab
  (browser.action ?? browser.browserAction).onClicked.addListener(
    async (tab) => {
      try {
        const dataUrl = await browser.tabs.captureVisibleTab();
        await downloadImage(dataUrl);
      } catch (err) {
        console.error("Cannot capture screenshot of current tab", tab, err);
      }
    },
  );
});

async function downloadImage(dataUrl: string): Promise<void> {
  const filename = `Screenshot-${new Date().toISOString().replaceAll(":", "-")}.png`;
  console.log(`Downloading image: ${filename}`, { dataUrl });

  if (import.meta.env.MANIFEST_VERSION === 3) {
    // There are known issues with download images in background scripts: https://issues.chromium.org/issues/40774955
    // But this works well enough for small screenshots
    await browser.downloads.download({
      url: dataUrl,
      filename,
    });
  } else {
    // Use "createObjectURL" for MV2
    const blob = dataUrltoBlob(dataUrl);
    const objectUrl = URL.createObjectURL(blob);
    await browser.downloads.download({
      url: objectUrl,
      filename,
    });
  }
}

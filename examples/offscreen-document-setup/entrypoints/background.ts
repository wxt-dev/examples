export default defineBackground(() => {
  // @ts-expect-error: MV3 only API not typed
  browser.offscreen.createDocument({
    url: "/offscreen.html",
    reasons: ["CLIPBOARD"],
    justification: "<your justification here>",
  });
});

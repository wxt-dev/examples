export default defineBackground(() => {
  // Set a value in session storage, don't need to await it.
  const startTime = Date.now();
  void sessionStartTime.setValue(startTime);
  console.log("Setting session start time:", new Date(startTime).toISOString());

  // Set the access level so `browser.storage.session` is defined and availble
  // in content scripts: https://developer.chrome.com/docs/extensions/reference/api/storage#storage_areas
  // @ts-expect-error: setAccessLevel not typed
  void browser.storage.session.setAccessLevel?.({
    accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
  });
});

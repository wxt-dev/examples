export default defineBackground(() => {
  // Set the access level so `browser.storage.session` is defined and availble
  // in content scripts: https://developer.chrome.com/docs/extensions/reference/api/storage#storage_areas
  void browser.storage.session.setAccessLevel?.({
    accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
  });
});

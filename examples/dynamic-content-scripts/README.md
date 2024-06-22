---
name: Dynamic Content Scripts
description: Use "webext-dynamic-content-scripts" and "webext-permission-toggle" to allow users to run content scripts on any page without requesting "*://*/*" on install.
---

```sh
pnpm i
pnpm dev
```

> https://github.com/fregante/webext-dynamic-content-scripts/blob/main/how-to-add-github-enterprise-support-to-web-extensions.md

By default, the content script will run on <https://wxt.dev>. It won't run on <https://google.com>. To run the content script on `google.com`, right click the extension icon and choose "Enable dynamic-content-scripts on this domain", then you'll see the log indicating the content script is running.

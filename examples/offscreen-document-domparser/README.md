---
name: Parse DOM in an Offscreen Document
description: Use the DOMParser API in an offscreen document to process HTML snippets in the background.
apis:
  - DOMParser
---

Docs about the offscreen: https://developer.chrome.com/docs/extensions/reference/api/offscreen

```sh
pnpm i
pnpm dev
```

On any webpage, click the extension icon to log the number of `<script>` elements present. Logs are printed in the service worker's console.

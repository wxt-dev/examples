---
name: Side Panel
description: Cross-browser side panel that works on both Chrome and Firefox
---

```sh
pnpm i
pnpm dev
```

A port of MDN's [annotate-page](https://github.com/mdn/webextensions-examples/tree/main/annotate-page) example to WXT, demonstrating how to use Chrome's `sidePanel` API and Firefox's `sidebarAction` API with a single codebase.

## Features

- Shows current tab info (title and URL)
- Per-page notes saved to `browser.storage.local`
- Works on both Chrome (MV3) and Firefox (MV2)

## Cross-Browser Notes

- **Chrome**: Uses `browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` to open the panel on icon click
- **Firefox**: Uses `browser.sidebarAction.toggle()` on `browserAction.onClicked` to toggle the sidebar
- Tab queries use `windowId` instead of `currentWindow` for Firefox compatibility

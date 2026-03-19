---
name: Dual Firefox Action
description: How to include both a browser_action and page_action for Firefox MV2 extensions.
---

# Dual Firefox Action

By default, WXT only supports one popup entrypoint. That means you need to use hooks or a WXT module to modify the build process to add support.

See [`modules/add-page-action.ts`](./modules/add-page-action.ts) for a simple example. It looks up the entrypoint called "page-popup" then uses it's `<meta>` tags to add the `page_action` to the manifest.

> [!WARNING]
> Note that Chrome does not support `page_action`s in MV3, so this is a niche case for Firefox only.
>
> It is recommended you use a single action so your MV2 and MV3 targets are more similar and easier to maintain.

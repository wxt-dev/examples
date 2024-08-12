---
name: Use Chrome
description: Use the chrome global and disable the webextension-polyfill.
packages:
  - "@types/chrome"
---

```sh
pnpm i
pnpm dev
```

> [!WARNING]
> Be careful with this. While the `chrome` global is defined on all browsers, at least the latest versions of them, not all APIs are available on all browsers, or not all of them behave the same way. The `webextension-polyfill` handles a lot of this for you behind the scenes and with the help of typescript, at the expense of an increased bundle size.

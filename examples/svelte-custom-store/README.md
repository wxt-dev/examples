---
name: Svelte Custom Store
description: A custom svelte store wrapper around wxt/storage to enable clean subscriptions in Svelte (and TS) as well as persisting state.
---

```sh
npm install
npm run dev
```

Visit example.org, open dev tools or the extension service worker logs, click the extension's action icon and toggle the checkbox.
You will see that both content script and background script update their (local) state. When closing and re-opening the Popup, the state is persisted.

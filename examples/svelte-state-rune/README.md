---
name: Svelte State Rune
description: A uses a state rune with WXT's storage to enable clean subscriptions in Svelte (and TS) as well as persisting state.
---

```sh
npm install
npm run dev
```

Demonstrates how the browser.storage API allows different parts of the extension share state and reflect activity on the current page.

- The page fires a "counter:updated" event every second.
- The Content Script handles these events by pushing the event payload into session storage.
- The CounterState class watches the store and updates its reactive state property on change
- App.svelte reflects the value of `counterState.state`

Open dev tools or the extension service worker logs, click the extension's action icon and watch the events being fired by the active page update the counter.

When closing and re-opening the Popup, the state is persisted.

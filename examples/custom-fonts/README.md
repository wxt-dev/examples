---
name: Custom Fonts
description: Show how to use custom fonts throughout your extension.
---

> [!IMPORTANT]
> This example only works for WXT v0.20.7 and above. For older versions, see [React Content Script UI Custom Font](https://github.com/wxt-dev/examples/tree/main/examples/react-content-ui-custom-font) example

In this example, we'll add custom fonts from [Google Fonts](https://fonts.google.com/) to the popup and a ShadowRoot content script UI.

```sh
pnpm i
pnpm dev
```

Important steps:

1. Export the fonts you want to use from Google Fonts using <https://gwfh.mranftl.com/fonts>
   - Set the folder prefix to `web-extension://__MSG_@@extension_id__/fonts/` and copy the CSS into `assets/fonts.css`
   - Move the downloaded font files into the [`public/fonts` directory](public/fonts)

2. Create `assets/style.css`. This file will contain the extension's base styles that all entrypoints will use. Make sure to import the `fonts.css` file:
3. In your HTML files, just link to the `style.css` file like normal:
4. In your content script entrypoint, import the `style.css`. If you're using `createShadowRootUi`, remember to set `cssInjectionMode: "ui"`, just like the [normal setup](https://wxt.dev/guide/essentials/content-scripts.html#shadow-root). There's nothing special here.

---
name: Storybook
description: Integrate Storybook with WXT to develop components.
---

```sh
pnpm i
pnpm storybook
```

To add storybook:

1. Create the `.storybook/vite.config.ts` file from this example
2. Install the vite builder
   ```sh
   pnpm i @storybook/builder-vite
   ```
3. Run `storybook init` like usual
   ```sh
   pnpm dlx storybook@latest init
   ```
4. Update `.storybook/main.ts` to use `./.storybook/vite.config.ts` instead of `./vite.config.ts`
   ```diff
   framework: {
     name: "@storybook/react-vite",
     options: {
   +   builder: {
   +     viteConfigPath: ".storybook/vite.config.ts",
   +   },
     },
   },
   ```

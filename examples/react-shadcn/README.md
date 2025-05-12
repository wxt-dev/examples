---
name: React with Tailwind & shadcn
description: Simple example extension using React, Tailwind CSS, and shadcn UI components.
---

# WXT + React + Tailwind + Shadcn

This example demonstrates how to integrate React 19+, Tailwind CSS v4+, and shadcn UI components within a WXT extension.

## Installation Walkthrough

1. **Initialize a new WXT project:**

   Open your terminal and run the following command to create a new WXT project with the React template:

   ```sh
   pnpm dlx wxt@latest init
   ```

   The CLI will guide you through the project setup. Choose the `react` template and your preferred package manager. For this example, I use pnpm.

   ```
   WXT 0.20.6
   ℹ Initializing new project
   ✔ Project Directory … react-shadcn
   ✔ Choose a template › react
   ✔ Package Manager › pnpm
   ✔ Downloading template
   ✨ WXT project created with the react template.
   Next steps:
     1. cd react-shadcn
     2. pnpm install
   ```

2. **Navigate to the project directory and install dependencies:**

   ```sh
   cd react-shadcn
   pnpm install
   ```

3. **Install Tailwind CSS and `@tailwindcss/vite`:**

   You should follow the official Tailwind Vite installation [guide](https://tailwindcss.com/docs/installation/using-vite). As the time of creating this example, it asked to run the following command:

   ```sh
   pnpm install tailwindcss @tailwindcss/vite
   ```

4. **Configure Tailwind CSS in `wxt.config.ts`:**

   In the official documentation, it will as you to modify `vite.config.ts`, however WXT acts as a wrapper around Vite, and it provides its own config file (`wxt.config.ts`) which is the one we should modify instead of vite config file since this is the one that will manage the build process. So we should update our wxt config file to include tailwind as vite plugin

   ```ts
   import { defineConfig } from "wxt";
   import tailwindcss from "@tailwindcss/vite";
   // See https://wxt.dev/api/config.html
   export default defineConfig({
     modules: ["@wxt-dev/module-react"],
     vite: () => ({
       plugins: [tailwindcss()],
     }),
   });
   ```

5. **Create a `tailwind.css` file:**

   Create a `tailwind.css` file in your `assets` directory (or the root directory of your project if you don't have an assets dir) with the following content:

   ```css
   @import "tailwindcss";
   ```

6. **Import `tailwind.css`:**

   You can now easily import the `tailwind.css` file in your React components:

   ```ts
   import "@/assets/tailwind.css"; // Adjust the path if necessary
   ```

   or you can include it directly in your `index.html` file:

   ```html
   <!doctype html>
   <html>
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <link href="@/assets/tailwind.css" rel="stylesheet" />
     </head>
     <body></body>
   </html>
   ```

   Now you can start styling your components with Tailwind CSS classes.

7. **Install and Configure Shadcn UI:**

   Integrating Shadcn UI requires a few extra steps. You can choose either the [manual installation](https://ui.shadcn.com/docs/installation/manual) or the [Vite installation](https://ui.shadcn.com/docs/installation/vite) method. You can choose either one, both of them have workarounds we need to do, however this guide will use the Vite installation method.

   You also need to decide whether to stick with WXT's default project structure or introduce a `src/` directory to separate source code from configuration files. WXT provides documentation on adding a `src/` directory [here](https://wxt.dev/guide/essentials/project-structure.html#adding-a-src-directory). This guide will continue without a `src/` directory for simplicity.

8. **Configure `tsconfig.json`:**

   Before installing Shadcn UI components, you need to configure your `tsconfig.json` file. Add the following within the `compilerOptions` section:

   ```json
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./*"] // or "./src/*" if using src directory
       }
     }
   ```

9. **Configure `wxt.config.ts` for Alias Resolution:**

   Update your `wxt.config.ts` to include an alias for resolving paths. Make sure to install `@types/node` for the `path` module: `pnpm add -D @types/node`

   ```ts
   import { defineConfig } from "wxt";
   import tailwindcss from "@tailwindcss/vite";
   import path from "path";

   // See https://wxt.dev/api/config.html
   export default defineConfig({
     modules: ["@wxt-dev/module-react"],
     vite: () => ({
       plugins: [tailwindcss()],
       resolve: {
         alias: {
           "@": path.resolve(__dirname, "./"), // or "./src" if using src directory
         },
       },
     }),
   });
   ```

10. **Temporarily Add `vite.config.ts` (Workaround for Shadcn CLI):**

    The Shadcn CLI relies on detecting a `vite.config.ts` file to identify which framework we are in. So before initializing the tool, we have to temporarily create a `vite.config.ts` file with the following content:

    ```ts
    import path from "path";
    import react from "@vitejs/plugin-react";
    import { defineConfig } from "vite";
    import tailwindcss from "@tailwindcss/vite";
    export default defineConfig({
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./"), // or "./src" if using src directory
        },
      },
    });
    ```

    This file ensures that the Shadcn CLI correctly identifies your project as a Vite project and configures the alias. **This file should be deleted after the initialization.**

11. **Initialize Shadcn UI:**

    Run the Shadcn UI initialization command:

    ```sh
    pnpm dlx shadcn-ui@latest init
    ```

    Answer the prompts in the CLI to configure Shadcn UI according to your preferences (color scheme, etc.).

12. **Delete Temporary `vite.config.ts`:**

    After Shadcn UI is initialized, you can safely delete the temporary `vite.config.ts` file you created in step 10.

13. **Add Shadcn UI Components:**

    You can now add Shadcn UI components using the CLI:

    ```sh
    pnpm dlx shadcn-ui@latest add button
    ```

    This will install the button component and its dependencies. Repeat this command for any other components you wish to use.

## Notes

There are some potential conflicts with WXT's recommended configuration and best practices in this setup, particularly in `wxt.config.ts` and `tsconfig.json`.

WXT advises against directly adding paths to `tsconfig.json` and prefers using the `alias` option in `wxt.config.ts` (see [WXT documentation](https://wxt.dev/guide/essentials/config/typescript.html#tsconfig-paths)). However, Shadcn currently fails to resolve paths correctly if they are only defined in `wxt.config.ts`. There is an [open issue](https://github.com/shadcn-ui/ui/issues/6020) about this in the Shadcn UI repository.

**Therefore, the current approach of modifying both `tsconfig.json` and `wxt.config.ts` is a temporary workaround.**

Ideally, the configuration should look like this:

```diff
// tsconfig.ts
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "jsx": "react-jsx",
-    "baseUrl": ".",
-    "paths": {
-      "@/*": ["./*"]
-    }
  }
}
```

```diff
// wxt.config.ts
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
+  alias: {
+    "@": path.resolve(__dirname, "./"),
+  },
  vite: () => ({
    plugins: [tailwindcss()],
-    resolve: {
-      alias: {
-        "@": path.resolve(__dirname, "./"),
-      },
-    },
  }),
});
```

However, this will not work correctly with Shadcn UI until the linked issue is resolved. Remember to monitor the linked issue in the Shadcn UI repository and update your configuration when a fix is available.

For a more in-depth guide that goes through the manual installation process, please check this [detailed guide](https://aabidk.dev/tags/wxt/).

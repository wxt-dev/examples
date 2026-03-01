---
name: React with AntD & Tailwind CSS
description: Simple example extension using React, Tailwind CSS, and AntD components.
---

# WXT + React + AntD + Tailwind CSS

This example demonstrates how to integrate React 19+, Tailwind CSS v4+, and AntD components within a WXT extension.

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
   ✔ Project Directory … react-antd-tailwindcss
   ✔ Choose a template › react
   ✔ Package Manager › pnpm
   ✔ Downloading template
   ✨ WXT project created with the react template.
   Next steps:
     1. cd react-antd-tailwindcss
     2. pnpm install
   ```

2. **Navigate to the project directory and install dependencies:**

   ```sh
   cd react-antd-tailwindcss
   pnpm install
   ```

3. **Install Tailwind CSS and `@tailwindcss/vite`:**

   You should follow the official Tailwind Vite installation [guide](https://tailwindcss.com/docs/installation/using-vite). As the time of creating this example, it asked to run the following command:

   ```sh
   pnpm install tailwindcss @tailwindcss/vite
   ```

4. **Configure Tailwind CSS in `wxt.config.ts`:**

    To configure Tailwind CSS, modify `wxt.config.ts`. While official documentation says to change `vite.config.ts`, WXT configures Vite internally, so you need to update `wxt.config.ts` instead. This file manages the build process. To integrate Tailwind, add it as a Vite plugin within the wxt.config.ts file, as shown here:

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

   Now you can use AntD and TailwindCSS together throughout your project.
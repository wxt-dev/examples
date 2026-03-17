import { defineConfig } from "wxt";

const name = "Cross-Platform Side Panel";
const icons = { 16: "icon/16.png", 32: "icon/32.png", 48: "icon/48.png" };

export default defineConfig({
  manifest: ({ browser }) => ({
    name,
    description: "A side panel extension that works on Chrome and Firefox",
    permissions: ["storage", "tabs"],
    ...(browser === "firefox" && {
      browser_action: {
        default_icon: icons,
        default_title: "Toggle Side Panel",
      },
    }),
  }),
});

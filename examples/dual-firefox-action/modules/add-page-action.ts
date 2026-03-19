import type { Entrypoint } from "wxt";
import { defineWxtModule } from "wxt/modules";

const PAGE_ACTION_POPUP_NAME = "page-popup";

export default defineWxtModule({
  setup(wxt) {
    let pagePopup: Entrypoint | undefined;

    wxt.hook("entrypoints:resolved", (_, entrypoints) => {
      pagePopup = entrypoints.find(
        (entrypoint) => entrypoint.name === PAGE_ACTION_POPUP_NAME,
      );
    });

    wxt.hook("build:manifestGenerated", (_, manifest) => {
      if (!pagePopup) return;

      // The options object here includes all options passed via <meta> tags
      const options = pagePopup.options as Record<string, any>;

      manifest.page_action = {
        default_popup: `${PAGE_ACTION_POPUP_NAME}.html`,
        show_matches: options.showMatches,
        hide_matches: options.hideMatches,
      };
    });
  },
});

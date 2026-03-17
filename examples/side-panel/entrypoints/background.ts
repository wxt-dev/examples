import { browser } from "wxt/browser";

interface BrowserWithSidebar {
  sidebarAction?: {
    toggle(): Promise<void>;
  };
}

export default defineBackground(() => {
  if (browser.sidePanel) {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } else {
    const { sidebarAction } = browser as typeof browser & BrowserWithSidebar;
    if (sidebarAction) {
      browser.browserAction.onClicked.addListener(() => sidebarAction.toggle());
    }
  }
});

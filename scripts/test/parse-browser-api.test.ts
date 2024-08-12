import { describe, expect, it } from "vitest";
import { collectUsedBrowserApi, filterBrowserApi } from "../parse-browser-api";

describe("parse-browser-api", () => {
  describe("collectUsedBrowserApi", () => {
    it("should convert api chrome to browser", () => {
      const file = `
        const a = chrome.action.getBadgeText();
        const b = browser.action.setBadgeText(a);
        const c = globalThis.wxt.someMethod(b);
      `;

      const result = collectUsedBrowserApi(file);
      expect(result).toStrictEqual(
        new Set(["browser.action.getBadgeText", "browser.action.setBadgeText"])
      );
    });

    it("should also correctly return api that use optional chaining", () => {
      const file = `
        const a = browser.action?.getBadgeText();
        const b = browser.action?.setBadgeText(a);
        const c = globalThis.wxt?.someMethod(b);
      `;

      const result = collectUsedBrowserApi(file);
      expect(result).toStrictEqual(
        new Set(["browser.action.getBadgeText", "browser.action.setBadgeText"])
      );
    });

    it("should return correct apis for example code", () => {
      const file = `
        export default defineBackground(() => {
          if (browser.runtime.getManifest().manifest_version === 2) {
          }
          const onClicked =
            browser.action?.onClicked ?? browser.browserAction.onClicked;

          let ports: Runtime.Port[] = [];
          browser.runtime.onConnect.addListener((port) => {
            ports.push(port);
            port.onDisconnect.addListener(() => {
              ports.splice(ports.indexOf(port), 1);
            });
          });

          browser.runtime.onMessage.addListener(async (message) => {
            const allTabs = await browser.tabs.query({});
            return await Promise.all(
              alltabs.map(async (tab) => {
                const response = await browser.tabs.sendMessage(tab.id!, message);
                return { tab: tab.id, response };
              })
            );
          });
        });
      `;

      const result = collectUsedBrowserApi(file);
      expect(result).toStrictEqual(
        new Set([
          "browser.runtime.getManifest",
          "browser.action.onClicked",
          "browser.browserAction.onClicked",
          "browser.runtime.onConnect",
          "browser.runtime.onMessage",
          "browser.tabs.query",
          "browser.tabs.sendMessage",
        ])
      );
    });
  });

  describe("filterBrowserApi", () => {
    it("should return undefined if no parts", () => {
      const result = filterBrowserApi(undefined);
      expect(result).toBe(undefined);
    });

    it("should trim the ignore member name", () => {
      const result = filterBrowserApi([
        "browser",
        "runtime",
        "onMessage",
        "addListener",
      ]);
      expect(result).toStrictEqual(["browser", "runtime", "onMessage"]);
    });

    it("should return api with depth of 3 as is", () => {
      const result = filterBrowserApi(["browser", "tabs", "captureVisibleTab"]);
      expect(result).toStrictEqual(["browser", "tabs", "captureVisibleTab"]);
    });

    it("should return api with depth of 4 as is", () => {
      const result = filterBrowserApi(["browser", "devtools", "panels.create"]);
      expect(result).toStrictEqual(["browser", "devtools", "panels.create"]);
    });

    it("should return undefined for api with depth less than 2", () => {
      const result = filterBrowserApi(["browser", "runtime"]);
      expect(result).toBe(undefined);
    });

    it("should trim for api with depth greater than 5", () => {
      const result = filterBrowserApi([
        "browser",
        "devtools",
        "panels",
        "elements",
        "createSidebarPane",
      ]);
      expect(result).toStrictEqual([
        "browser",
        "devtools",
        "panels",
        "elements",
      ]);
    });
  });
});

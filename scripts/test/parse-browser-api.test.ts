import { describe, expect, it } from "vitest";
import { collectUsedBrowserApi, filterBrowserApi } from "../parse-browser-api";

describe("parse-browser-api", () => {
  describe("collectUsedBrowserApi", () => {
    it("should convert api chrome to browser", () => {
      const file = `
        const a = chrome.action.getBadgeText();
        const b = browser.action.setBadgeText(a);
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
        const c = browser.devtools?.panels?.create()
      `;

      const result = collectUsedBrowserApi(file);
      expect(result).toStrictEqual(
        new Set([
          "browser.action.getBadgeText",
          "browser.action.setBadgeText",
          "browser.devtools.panels.create",
        ])
      );
    });

    it("should not return non-browser API", () => {
      const file = `
        const a = globalThis.wxt?.someMethod(b)
        const b = window.document.querySelector('body')
        const c = myObject.week.monday;
      `;

      const result = collectUsedBrowserApi(file);
      expect(result).toStrictEqual(new Set([]));
    });

    it("should return correct apis for example code (normal)", () => {
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

  it("should return correct apis for example code (special case)", () => {
    const file = `
      const a = (browser.action ?? browser.browserAction).onClicked.addListener(
        () => {
          console.log("(parentheses) with Nullish coalescing");
        }
      );
    `;

    const result = collectUsedBrowserApi(file);
    expect(result).toStrictEqual(
      new Set(["browser.action.onClicked", "browser.browserAction.onClicked"])
    );
  });

  describe("filterBrowserApi", () => {
    it("should return empty if no parts", () => {
      const result = filterBrowserApi([]);
      expect(result).toStrictEqual([]);
    });

    it("should return empty for api with depth less than 2", () => {
      const result = filterBrowserApi([["browser", "runtime"]]);
      expect(result).toStrictEqual([]);
    });

    it("should return length of 3 for APIs in one identifier namespace", () => {
      const result = filterBrowserApi([
        ["browser", "tabs", "captureVisibleTab"],
        ["browser", "tabs", "onCreated", "addListener"],
      ]);
      expect(result).toStrictEqual([
        ["browser", "tabs", "captureVisibleTab"],
        ["browser", "tabs", "onCreated"],
      ]);
    });

    it("should return length of 4 for APIs in two identifiers namespaces", () => {
      const result = filterBrowserApi([
        ["browser", "devtools", "panels", "create"],
        ["browser", "devtools", "panels", "elements", "createSidebarPane"],
      ]);
      expect(result).toStrictEqual([
        ["browser", "devtools", "panels", "create"],
        ["browser", "devtools", "panels", "elements"],
      ]);
    });
    
    it("should return empty for APIs in two identifiers namespaces with length less than 4", () => {
      const result = filterBrowserApi([
        ["browser", "devtools", "panels"],
      ]);
      expect(result).toStrictEqual([]);
    });
  });
});

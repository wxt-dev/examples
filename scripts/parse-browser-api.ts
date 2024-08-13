import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import types from "@babel/types";
import { getBabelParserOptions } from "./libs/babel.js";

// tsx can't be default import, but vitest can be default import
// @ts-expect-error https://github.com/babel/babel/discussions/13093
const traverse = (_traverse.default || _traverse) as typeof _traverse;

type Parts = string[];
type PartsCollection = Parts[];

export function collectUsedBrowserApi(fileContent: string) {
  const ast = parser.parse(fileContent, getBabelParserOptions());

  const usedBrowserApi = new Set<string>();

  traverse(ast, {
    MemberExpression(path) {
      const partsCollection = getFullMemberExpression(path.node);
      const browserApi = pickBrowserApi(partsCollection);
      const filteredBrowserApi = filterBrowserApi(browserApi);
      for (const parts of filteredBrowserApi) {
        usedBrowserApi.add(parts.join("."));
      }
    },
    OptionalMemberExpression(path) {
      const partsCollection = getFullMemberExpression(path.node);
      const browserApi = pickBrowserApi(partsCollection);
      const filteredBrowserApi = filterBrowserApi(browserApi);
      for (const parts of filteredBrowserApi) {
        usedBrowserApi.add(parts.join("."));
      }
    },
  });

  return usedBrowserApi;
}

function getFullMemberExpression(node: types.Node): PartsCollection {
  const partsCollection: PartsCollection = [];
  const parts: Parts = [];

  while (node) {
    if (
      types.isMemberExpression(node) ||
      types.isOptionalMemberExpression(node)
    ) {
      if (types.isIdentifier(node.property)) {
        parts.unshift(node.property.name);
      }
      node = node.object;
    } else if (types.isLogicalExpression(node)) {
      /**
       * Recursively retrieve left and right sides. Then merge it with the member's name.
       * @example (browser.action ?? browser.browserAction).onClicked.addListener
       * left: browser.action
       * right: browser.browserAction
       * parts: onClicked.addListener
       */
      const left = getFullMemberExpression(node.left).flat();
      const right = getFullMemberExpression(node.right).flat();
      partsCollection.push([...left, ...parts]);
      partsCollection.push([...right, ...parts]);
      break;
    } else if (node.type === "Identifier") {
      // Add the object name(chrome, browser, globalThis, ..etc).
      parts.unshift(node.name);
      break;
    } else {
      break;
    }
  }

  return [parts, ...partsCollection].filter((parts) => parts.length > 0);
}

function pickBrowserApi(partsCollection: PartsCollection): PartsCollection {
  const pickedCollection = partsCollection.map((parts) => {
    let objectName = parts.shift();

    if (!objectName || !["chrome", "browser"].includes(objectName)) {
      return;
    }

    if (objectName === "chrome") {
      objectName = "browser";
    }

    parts = [objectName, ...parts];

    return parts;
  });

  return pickedCollection.filter((parts) => !!parts);
}

export function filterBrowserApi(
  partsCollection: PartsCollection
): PartsCollection {
  const filteredCollection = partsCollection.map((parts) => {
    if (!parts) {
      return;
    }

    const IGNORE_MEMBERS = ["addListener"];

    /**
     * Trim target API for ignore.
     * @example
     * before
     *   ["browser", "runtime", "onMessage", "addListener"]
     * after
     *   ["browser", "runtime", "onMessage"]
     */
    const ignoreApiIdx = parts.findLastIndex((name) =>
      IGNORE_MEMBERS.includes(name)
    );
    if (ignoreApiIdx > 0) {
      parts.splice(ignoreApiIdx);
    }

    /**
     * Limit depth to 3 or 4.
     * @example Allow
     *  "browser.tabs.captureVisibleTab"
     *  "browser.devtools.panels.create"
     * @example Disallow
     *  "browser.runtime"
     *  "browser.devtools.panels.elements.createSidebarPane"
     */
    if (parts.length < 3) {
      return;
    }
    if (parts.length > 4) {
      parts.splice(4);
    }

    return parts;
  });

  return filteredCollection.filter((parts) => !!parts);
}

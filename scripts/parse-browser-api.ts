import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import types from "@babel/types";
import { getBabelParserOptions } from "./libs/babel.js";
import { loadExtensionApiMap } from "./libs/loadExtensionApiMap.js";

// tsx can't be default import, but vitest can be default import
// @ts-expect-error https://github.com/babel/babel/discussions/13093
const traverse = (_traverse.default || _traverse) as typeof _traverse;

const EXTENSION_API_MAP = await loadExtensionApiMap();

type Parts = string[];
type PartsCollection = Parts[];
type ApiType = "event" | "method" | "property" | "type" | "unknown";
type BrowserApiItem = {
  namespace: string;
  propertyName: string;
  type: ApiType;
  parts: Parts;
};
type BrowserApiItemCollection = BrowserApiItem[];

export function collectUsedBrowserApi(fileContent: string) {
  const ast = parser.parse(fileContent, getBabelParserOptions());

  const usedBrowserApi = new Set<string>();

  traverse(ast, {
    MemberExpression(path) {
      const partsCollection = getFullMemberExpression(path.node);
      const browserApi = pickBrowserApi(partsCollection);
      const filteredBrowserApi = filterBrowserApi(browserApi);
      for (const { parts } of filteredBrowserApi) {
        usedBrowserApi.add(parts.join("."));
      }
    },
    OptionalMemberExpression(path) {
      const partsCollection = getFullMemberExpression(path.node);
      const browserApi = pickBrowserApi(partsCollection);
      const filteredBrowserApi = filterBrowserApi(browserApi);
      for (const { parts } of filteredBrowserApi) {
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
): BrowserApiItemCollection {
  const filteredCollection = partsCollection.map<BrowserApiItem | undefined>(
    (parts) => {
      if (!parts) {
        return;
      }

      const apiItem = distinguishBrowserApi(parts);

      /**
       * Exclude undefined item & Type API(like Enums)
       * @example
       * `browser.offscreen.Reason`
       */
      if (!apiItem || apiItem.type === "type") {
        return;
      }

      /**
       * Trim target API for ignore.
       * @example
       * before
       *   ["browser", "runtime", "onMessage", "addListener"]
       * after
       *   ["browser", "runtime", "onMessage"]
       */
      const TRIM_MEMBERS = ["addListener"];
      const trimApiIndex = apiItem.parts.findLastIndex((name) =>
        TRIM_MEMBERS.includes(name)
      );
      if (trimApiIndex > 0) {
        apiItem.parts.splice(trimApiIndex);
      }

      if (apiItem.parts.length < 3) {
        return;
      }

      return apiItem;
    }
  );

  return filteredCollection.filter((apiItem) => !!apiItem);
}

/**
 * For some api namespaces consist of two identifiers like `browser.devtools.panels`. Checks for matching joined namespace.
 * And convert Parts to BrowserApiItem.
 */
export function distinguishBrowserApi(
  parts: Parts
): BrowserApiItem | undefined {
  const getApiType = (namespace: string, propertyName: string): ApiType => {
    const apiTypes = EXTENSION_API_MAP[namespace];

    if (apiTypes.methods.includes(propertyName)) {
      return "method";
    }
    if (apiTypes.events.includes(propertyName)) {
      return "event";
    }
    if (apiTypes.properties.includes(propertyName)) {
      return "property";
    }
    if (apiTypes.types.includes(propertyName)) {
      return "type";
    }
    return "unknown";
  };

  const twoNamespace = `${parts[1]}.${parts[2]}`;

  if (EXTENSION_API_MAP[twoNamespace]) {
    const propertyName = parts[3];
    if (!propertyName) {
      return;
    }
    return {
      namespace: twoNamespace,
      propertyName,
      type: getApiType(twoNamespace, propertyName),
      parts,
    };
  } else {
    const namespace = parts[1];
    const propertyName = parts[2];
    if (!propertyName) {
      return;
    }
    return {
      namespace,
      propertyName,
      type: getApiType(namespace, propertyName),
      parts,
    };
  }
}

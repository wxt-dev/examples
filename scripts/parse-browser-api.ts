import parser from "@babel/parser";
import _traverse, { NodePath } from "@babel/traverse";
import types from "@babel/types";
import { getBabelParserOptions } from "./libs/babel.js";

// tsx can't be default import, but vitest can be default import
// @ts-expect-error https://github.com/babel/babel/discussions/13093
const traverse = (_traverse.default || _traverse) as typeof _traverse;

export function collectUsedBrowserApi(fileContent: string) {
  const ast = parser.parse(fileContent, getBabelParserOptions());

  const usedBrowserApi = new Set<string>();

  traverse(ast, {
    MemberExpression(path) {
      const parts = getFullMemberExpression(path);
      const browserApi = pickBrowserApi(parts);
      const filteredBrowserApi = filterBrowserApi(browserApi);
      if (filteredBrowserApi) {
        usedBrowserApi.add(filteredBrowserApi.join("."));
      }
    },
  });

  return usedBrowserApi;
}

function getFullMemberExpression(
  path: NodePath<types.MemberExpression | types.OptionalMemberExpression>
) {
  const parts: string[] = [];

  // First, add object name
  if (types.isIdentifier(path.node.object)) {
    parts.push(path.node.object.name);
  } else {
    // We don't support expressions
    return parts;
  }

  // Recursively retrieving members name
  while (path) {
    if (types.isIdentifier(path.node.property)) {
      parts.push(path.node.property.name);
    } else {
      // We don't support expressions
      break;
    }

    const parentPath = path.parentPath;

    if (
      parentPath &&
      (parentPath.isMemberExpression() ||
        parentPath.isOptionalMemberExpression())
    ) {
      path = parentPath;
    } else {
      // End the recursively
      break;
    }
  }

  return parts;
}

function pickBrowserApi(parts: string[]): string[] | undefined {
  let objectName = parts.shift();

  if (!objectName || !["chrome", "browser"].includes(objectName)) {
    return;
  }

  if (objectName === "chrome") {
    objectName = "browser";
  }

  parts = [objectName, ...parts];

  return parts;
}

export function filterBrowserApi(
  parts: string[] | undefined
): string[] | undefined {
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
}

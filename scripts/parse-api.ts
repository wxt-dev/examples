import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import types from "@babel/types";
import { getBabelParserOptions } from "./libs/babel.js";

// @ts-expect-error https://github.com/babel/babel/discussions/13093
const traverse = _traverse.default as typeof _traverse;

export function collectUsedBrowserApi(fileContent: string) {
  const ast = parser.parse(fileContent, getBabelParserOptions());

  const usedBrowserApi = new Set<string>();

  traverse(ast, {
    MemberExpression(path) {
      const { parts } = getFullMemberExpression(path.node);
      const browserApi = pickBrowserApi(parts);
      if (browserApi && browserApi.parts.length >= 3) {
        usedBrowserApi.add(browserApi.full);
      }
    },
  });

  return usedBrowserApi;
}

function getFullMemberExpression(exp: types.MemberExpression) {
  const parts = [];

  let node: types.Expression = exp;
  // Recursively babbling and retrieving member names
  while (types.isMemberExpression(node)) {
    if (types.isIdentifier(node.property)) {
      parts.unshift(node.property.name);
    }
    const parentObject: types.Expression = node.object;
    node = parentObject;
  }

  // Add first object identifier
  if (types.isIdentifier(node)) {
    parts.unshift(node.name);
  }

  return { parts };
}

function pickBrowserApi(
  parts: string[]
): { parts: string[]; full: string } | undefined {
  let objectName = parts.shift();

  if (!objectName || !["chrome", "browser"].includes(objectName)) {
    return;
  }

  if (objectName === "chrome") {
    objectName = "browser";
  }

  parts = [objectName, ...parts];

  return { parts, full: parts.join(".") };
}

import { ParserOptions, ParserPlugin } from "@babel/parser";

/**
 * @description
 * reference from magicast's option
 * https://github.com/unjs/magicast/blob/7b3f0bd9bdbc07d7c66408645a5dcd309511119e/src/babel.ts
 */
export function getBabelParserOptions(): ParserOptions {
  return {
    sourceType: "module",
    strictMode: false,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 1,
    tokens: true,
    plugins: [
      "asyncGenerators",
      "bigInt",
      "classPrivateMethods",
      "classPrivateProperties",
      "classProperties",
      "classStaticBlock",
      "decimal",
      "decorators-legacy",
      "doExpressions",
      "dynamicImport",
      "exportDefaultFrom",
      "exportExtensions" as any as ParserPlugin,
      "exportNamespaceFrom",
      "functionBind",
      "functionSent",
      "importAssertions",
      "importMeta",
      "nullishCoalescingOperator",
      "numericSeparator",
      "objectRestSpread",
      "optionalCatchBinding",
      "optionalChaining",
      [
        "pipelineOperator",
        {
          proposal: "minimal",
        },
      ] as any as ParserPlugin,
      [
        "recordAndTuple",
        {
          syntaxType: "hash",
        },
      ],
      "throwExpressions",
      "topLevelAwait",
      "v8intrinsic",
      "jsx",
      "typescript",
    ],
  } as const satisfies ParserOptions;
}

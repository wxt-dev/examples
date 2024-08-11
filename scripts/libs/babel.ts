import { ParserOptions, ParserPlugin } from "@babel/parser";

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

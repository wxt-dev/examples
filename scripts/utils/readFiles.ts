import { readFile } from "node:fs/promises";
import glob from "fast-glob";

async function _readFilesInDir(
  globPattern: string
): Promise<Record<string, string>> {
  const files = await glob(globPattern, {
    ignore: ["**/node_modules/**", "**/package.json"],
  });
  const result: Record<string, string> = {};
  for (const file of files) {
    result[file] = await readFile(file, "utf8");
  }
  return result;
}

export function readFilesInDir(dir: string) {
  return _readFilesInDir(`${dir}/**`);
}
export function readJsFilesInDir(dir: string) {
  return _readFilesInDir(`${dir}/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}`);
}

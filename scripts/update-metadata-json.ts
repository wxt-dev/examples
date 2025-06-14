import { readdir, readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { consola } from "consola";
import YAML from "yaml";
import { collectUsedBrowserApi } from "./parse-browser-api.js";
import { readFilesInDir, readJsFilesInDir } from "./utils/readFiles.js";

interface MetadataJson {
  examples: Array<{
    name: string;
    description?: string;
    url: string;
    searchText: string;
    apis: string[];
    packages: string[];
    permissions: string[];
  }>;
  allPackages: string[];
  allPermissions: string[];
  allApis: string[];
}

const examples: MetadataJson["examples"] = [];
const allPackages = new Set<string>();
const allPermissions = new Set<string>();
const allApis = new Set<string>();

const ignoredPackages = new Set([
  "wxt",
  "typescript",
  "vue-tsc",
  "svelte-check",
  "tslib",
  "@tsconfig/svelte",
]);
const ignoredPackagePrefixes = ["@types", "@storybook", "@chromatic-com"];

const includedBundleImports = ["wxt/utils/storage"];

consola.info("Building all extensions...");
execSync(`pnpm -r build`);

consola.info("Processing examples...");
const exampleDirs = (await readdir("examples")).map((dir) => `examples/${dir}`);

function collectPermissions(manifest: any) {
  const permissions: string[] = manifest.permissions ?? [];
  permissions.forEach((permission) => allPermissions.add(permission));
  return permissions;
}

function collectPackages(packageJson: any, files: Record<string, string>) {
  const packages = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ].filter(
    (pkg) =>
      !ignoredPackages.has(pkg) &&
      !ignoredPackagePrefixes.some((prefix) => pkg.startsWith(prefix)),
  );
  Object.values(files).forEach((file) => {
    includedBundleImports.forEach((bundleImport) => {
      const bundleImportMatch = `from "${bundleImport}"`;
      if (file.includes(bundleImportMatch)) {
        packages.push(bundleImport);
      }
    });
  });
  packages.forEach((pkg) => allPackages.add(pkg));
  return [...new Set(packages)];
}

async function collectApis(files: Record<string, string>) {
  const dirApis = new Set<string>();
  for (const textContent of Object.values(files)) {
    const apis = collectUsedBrowserApi(textContent);
    apis.forEach((api) => {
      dirApis.add(api);
      allApis.add(api);
    });
  }
  return [...dirApis];
}

function extractFrontmatter(readmeText: string): any {
  return YAML.parse(readmeText.split("---")[1].trim());
}

for (const exampleDir of exampleDirs) {
  consola.log(`  - \`${exampleDir}\``);

  const packageJsonPath = `${exampleDir}/package.json`;
  const packageJsonText = await readFile(packageJsonPath, "utf8").catch(
    () => void 0,
  );
  if (packageJsonText == null) {
    consola.warn("Skipped, not found:", packageJsonPath);
    continue;
  }
  const packageJson = JSON.parse(packageJsonText);

  const readmePath = `${exampleDir}/README.md`;
  const readmeText = await readFile(readmePath, "utf8").catch(() => void 0);
  if (readmeText == null) {
    consola.warn("Skipped, not found:", readmePath);
    continue;
  }

  const manifestPath = `${exampleDir}/.output/chrome-mv3/manifest.json`;
  const manifestText = await readFile(manifestPath, "utf8").catch(() => void 0);
  if (manifestText == null) {
    consola.warn("Skipped, not found:", manifestPath);
    continue;
  }
  const manifest = JSON.parse(manifestText);

  const frontmatter = extractFrontmatter(readmeText);
  const dirContent = await readFilesInDir(exampleDir);
  const dirJsContent = await readJsFilesInDir(exampleDir);
  const packages = collectPackages(packageJson, dirContent);
  const permissions = collectPermissions(manifest);
  const apis = await collectApis(dirJsContent);
  frontmatter.apis?.forEach((api: string) => {
    allApis.add(api);
    apis.push(api);
  });
  frontmatter.packages?.forEach((pkg: string) => {
    allPackages.add(pkg);
    packages.push(pkg);
  });
  frontmatter.permissions?.forEach((permission: string) => {
    allPermissions.add(permission);
    permissions.push(permission);
  });

  examples.push({
    name: frontmatter.name,
    description: frontmatter.description,
    searchText: [
      frontmatter.name,
      frontmatter.description ?? "",
      ...packages,
      ...permissions,
      ...apis,
    ].join("|"),
    url: `https://github.com/wxt-dev/examples/tree/main/${exampleDir}`,
    apis,
    packages,
    permissions,
  });
}

const metadataJson: MetadataJson = {
  examples,
  allPackages: [...allPackages].sort(),
  allPermissions: [...allPermissions].sort(),
  allApis: [...allApis].sort(),
};

consola.info(`Writing ${examples.length} examples to \`metadata.json\`...`);
await writeFile(
  "metadata.json",
  JSON.stringify(metadataJson, null, 2) + "\n",
  "utf8",
);
consola.success("Done!");

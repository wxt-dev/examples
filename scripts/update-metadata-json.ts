import { readdir, readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { consola } from "consola";
import YAML from "yaml";

interface MetadataJson {
  examples: Array<{
    name: string;
    description?: string;
    url: string;
    searchText: string;
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
const ignoredPackagePrefixes = ["@types"];

consola.info("Building all extensions...");
execSync(`pnpm -r build`);

consola.info("Processing examples...");
const exampleDirs = (await readdir("examples")).map((dir) => `examples/${dir}`);

function collectPermissions(manifest: any) {
  const permissions: string[] = manifest.permissions ?? [];
  permissions.forEach((permission) => allPermissions.add(permission));
  return permissions;
}

function collectPackages(packageJson: any) {
  const packages = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ].filter(
    (pkg) =>
      !ignoredPackages.has(pkg) &&
      !ignoredPackagePrefixes.some((prefix) => pkg.startsWith(prefix)),
  );
  packages.forEach((pkg) => allPackages.add(pkg));
  return packages;
}

async function collectApis(_exampleDir: string) {
  return [];
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

  const { name, description } = extractFrontmatter(readmeText);
  const packages = collectPackages(packageJson);
  const permissions = collectPermissions(manifest);
  const apis = await collectApis(exampleDir);
  examples.push({
    name,
    description,
    searchText: [
      name,
      description ?? "",
      ...packages,
      ...permissions,
      ...apis,
    ].join("|"),
    url: `https://github.com/wxt-dev/examples/tree/main/${exampleDir}`,
  });
}

const metadataJson: MetadataJson = {
  examples,
  allPackages: [...allPackages.values()],
  allPermissions: [...allPermissions.values()],
  allApis: [...allApis.values()],
};

consola.info(`Writing ${examples.length} examples to \`metadata.json\`...`);
await writeFile(
  "metadata.json",
  JSON.stringify(metadataJson, null, 2) + "\n",
  "utf8",
);
consola.success("Done!");

import { PublicPath } from "wxt/browser";

export async function injectScript(
  path: PublicPath,
  options?: { keepInDom?: boolean },
): Promise<void> {
  const url = browser.runtime.getURL(path);
  const script = document.createElement("script");

  if (browser.runtime.getManifest().manifest_version === 2) {
    // MV2 requires using an inline script
    script.innerHTML = await fetch(url).then((res) => res.text());
  } else {
    // MV3 requires using src
    script.src = url;
  }

  if (!options?.keepInDom) {
    script.onload = () => script.remove();
  }

  (document.head ?? document.documentElement).append(script);
}

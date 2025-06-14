---
name: Devcontainers
description: WXT browser extension using Dev Containers.
---

```sh
pnpm i
export CHROME_PATH=$(pnpm dlx @puppeteer/browsers install chrome@stable | awk '{print $2}')
CHROME_EXTRA_FLAGS='--no-sandbox' pnpm dev
```

Open your local browser and navigate to `http://localhost:6080`. You should see a desktop environment. The browser launched by WXT will be visible here.

import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],

	// add font to web accessible resources
	manifest: {
		web_accessible_resources: [{ resources: ["fonts/*"], matches: ["*://*.google.com/*"] }],
	},
})

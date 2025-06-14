import ReactDOM from "react-dom/client"
import App from "./App.tsx"

export default defineContentScript({
	matches: ["*://*.google.com/*"],
	cssInjectionMode: "ui",

	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: "custom-font",
			position: "inline",
			anchor: "body",
			append: "first",
			onMount: (container) => {
				// Load custom font. Don't forget add font to web accessible resources in wxt.config.ts
				const fontUrl = browser.runtime.getURL("/fonts/jbmono.ttf")

				// create a style element
				const fontStyle = document.createElement("style")

				// add font face
				fontStyle.textContent = `
                    @font-face {
                      font-family: 'JB Mono';
                      src: url('${fontUrl}') format('truetype');
                      font-weight: 400;
                      font-style: normal;
                    }
                `
				// append style element to head
				document.head.appendChild(fontStyle)

				const wrapper = document.createElement("div")
				container.append(wrapper)

				const root = ReactDOM.createRoot(wrapper)
				root.render(<App />)
				return { root, wrapper }
			},
			onRemove: (elements) => {
				elements?.root.unmount()
				elements?.wrapper.remove()
			},
		})
		ui.mount()
	},
})

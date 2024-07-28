import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        // Don't mount react app directly on <body>
        const wrapper = document.createElement("div");
        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<App />);
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      },
    });
    console.log('WXT MODE:', {
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
    });

    ui.mount();
  },
});

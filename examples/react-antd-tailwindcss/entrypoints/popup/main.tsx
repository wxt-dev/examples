import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/assets/tailwind.css";
import { ThemeProvider } from "@/provider/Theme.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);

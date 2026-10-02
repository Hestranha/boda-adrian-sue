// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [/** @type {any} */ (tailwindcss())],
		server: {
			allowedHosts: [".ngrok-free.app"],
		},
	},

	integrations: [preact()],
});

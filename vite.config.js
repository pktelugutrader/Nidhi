import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages:
// - If this repo will be published as a PROJECT page
//   (https://<username>.github.io/<repo-name>/), set base to "/<repo-name>/".
// - If this repo IS your user/org page (named exactly
//   <username>.github.io), leave base as "/".
export default defineConfig({
  base: "/pk-alakaapuri-nidhi/",
  plugins: [react()],
});

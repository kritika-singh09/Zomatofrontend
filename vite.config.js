import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // resolve: {
  //   dedupe: ["react", "react-dom"],
  // },
  server: {
    port: 5173,
    host: true, // Add this to listen on all local IPs
    https: false,
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes("node_modules")) {
  //           if (id.includes("react")) return "react-vendor";
  //           if (id.includes("firebase")) return "firebase";
  //           if (id.includes("jspdf") || id.includes("html2canvas"))
  //             return "pdf";
  //           if (id.includes("react-icons")) return "icons";
  //           return "vendor";
  //         }
  //       },
  //     },
  //   },
  // },
});

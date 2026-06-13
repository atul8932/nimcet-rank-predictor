import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 Vite plugin — no postcss config needed
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        // Split large vendors into separate chunks for better caching
        manualChunks: {
          "vendor-react":  ["react", "react-dom", "react-router-dom"],
          "vendor-firebase": ["firebase/app", "firebase/firestore"],
          "vendor-pdf": ["html2pdf.js"],
        },
      },
    },
  },
  server: {
    allowedHosts: ["34be-122-180-203-119.ngrok-free.app"],
  },
});

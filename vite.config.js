import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["34be-122-180-203-119.ngrok-free.app"], // <- your current ngrok domain
  },
});

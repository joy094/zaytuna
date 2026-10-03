import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001", // আপনার backend server
      "/uploads": "http://localhost:3001", // 🔴 এই লাইনটি অবশ্যই যুক্ত করতে হবে
    },
  },
});

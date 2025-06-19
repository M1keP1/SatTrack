import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesium from 'vite-plugin-cesium'
// vite.config.ts
// https://vitejs.dev/config/ 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),cesium(),tailwindcss()],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})





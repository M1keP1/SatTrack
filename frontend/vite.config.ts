import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
// vite.config.ts
// https://vitejs.dev/config/ 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),cesium()],
})





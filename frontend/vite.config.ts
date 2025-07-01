import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), cesium(), tailwindcss()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    minify: 'esbuild', // default is 'esbuild' (fastest)
    target: 'esnext',  // assumes modern browsers
    sourcemap: false,  // disable source maps in prod
    chunkSizeWarningLimit: 1000, // suppress chunk size warnings
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },

  esbuild: {
    drop: ['console', 'debugger'], // 💥 removes all console logs & debuggers
  },
})

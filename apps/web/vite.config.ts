import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { TanStackRouterVite } from '@tanstack/router-plugin/vite'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    // TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: { name: 'AI News', short_name: 'AINews', theme_color: '#1a1a2e', icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }] }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

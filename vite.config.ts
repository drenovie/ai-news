import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: { 
        name: 'AI News', 
        short_name: 'AINews', 
        theme_color: '#1a1a2e', 
        icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }] 
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

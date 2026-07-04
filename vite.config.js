import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // sockjs-client referencia a variável global `global` (padrão Node);
  // no browser mapeamos para globalThis para o cliente WebSocket funcionar.
  define: {
    global: 'globalThis',
  },
  server: {
    allowedHosts: true,
  },
  plugins: [
    react(),
    VitePWA({
      useCredentials: true,
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      manifest: {
        name: 'Sistema de Pedidos',
        short_name: 'Pedidos',
        description: 'Gerenciamento de pedidos do restaurante',
        theme_color: '#E15A27',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
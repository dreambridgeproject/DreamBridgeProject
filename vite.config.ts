import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173, // 5174から5173に戻して通知を再発火
    strictPort: true,
    allowedHosts: true,
    cors: true,
  },
})

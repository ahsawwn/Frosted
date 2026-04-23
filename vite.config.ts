import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Since we fetch '/api/login' but backend route is '/login', 
        // we rewrite it here:
       // rewrite: (path) => path.replace(/^\/api/, ''), 
      }
    }
  }
})
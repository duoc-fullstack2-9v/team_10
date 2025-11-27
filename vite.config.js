import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      '/api/productos': {
        target: 'http://34.202.46.121:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/productos/, '/api/productos')
      },
      '/api/usuarios': {
        target: 'http://34.193.190.24:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/usuarios/, '/api/usuarios')
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
})

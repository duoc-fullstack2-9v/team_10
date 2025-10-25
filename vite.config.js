import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      '/api/productos': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "html-spa"],
      reportOnFailure: true,
      all: true,
      include: [
        "src/components/**/*.{js,jsx}",
        "src/pages/**/*.{js,jsx}"
      ],
      exclude: [
        "src/main.jsx",
        "src/**/*.test.{js,jsx}",
        "src/**/*.spec.{js,jsx}",
        "src/assets/**",
        "src/contexts/**",
        "src/pages/AdminPanel.jsx",
        "src/pages/ReportesAdmin.jsx",
        "**/node_modules/**"
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    // Configuración para reportes HTML personalizados
    outputFile: {
      html: './test-results/test-report.html'
    }
  },
})

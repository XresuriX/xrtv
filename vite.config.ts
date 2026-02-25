import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    // CRITICAL: Single alias with ABSOLUTE path
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    // Explicit extensions for resolver
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: { origin: '*', credentials: true }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    // CRITICAL: Prevent externalization of app modules
    rollupOptions: {
      external: [] // Ensure NO app modules are externalized
    }
  }
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM environments
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/',

  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      // Critical for shadcn – must match tsconfig.json paths
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  // Development server settings – only used in dev mode
  server: {
    host: '0.0.0.0',      // Listen on all network interfaces (for Docker)
    port: 3000,
    strictPort: true,      // Fail if port is already in use
  },

  build: {
    outDir: 'dist',        // Dokploy/Nixpacks expects 'dist' for Vite
    sourcemap: false,      // Smaller production builds
    chunkSizeWarningLimit: 1000, // Babylon.js is large; increase warning threshold

    rollupOptions: {
      output: {
        manualChunks: {
          // Optimize caching by splitting vendor libraries
          'babylon-vendor': ['@babylonjs/core', 'react-babylonjs'],
          // Include common UI dependencies used by shadcn
          'ui-vendor': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            '@radix-ui/react-slot',
            'lucide-react', // if you use shadcn icons
          ],
        },
      },
    },
  },

  // If you load 3D models, tell Vite to treat them as assets
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
});
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Base path for deployment
    base: env.VITE_BASE_PATH || '/',

    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },

    // Development server configuration
    server: {
      host: '0.0.0.0',
      port: 5173,
      cors: {
        origin: '*',
        credentials: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: env.VITE_WS_URL || 'ws://localhost:8000',
          changeOrigin: true,
          ws: true,
        },
      },
    },

    // Build configuration
    build: {
      outDir: 'dist',
      minify: mode === 'production' ? 'esbuild' : false,
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@headlessui/react', '@heroicons/react'],
          },
        },
      },
      target: 'esnext',
      cssCodeSplit: true,
      reportCompressedSize: true,
    },

    // CSS configuration - REMOVED require() calls
    css: {
      devSourcemap: true,
      // Tailwind CSS already includes autoprefixer - NO NEED for separate config
      // PostCSS is handled automatically by Tailwind plugin
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '1.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __IS_PRODUCTION__: mode === 'production',
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@headlessui/react',
        '@heroicons/react',
      ],
      exclude: ['@tailwindcss/vite'],
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: '0.0.0.0',
    },
  }
})
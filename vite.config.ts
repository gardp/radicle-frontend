import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
    // Strips all console.* calls (log, warn, error, etc.) and debugger statements
    // from the production bundle. This improves performance by eliminating
    // synchronous I/O overhead, prevents accidental leakage of sensitive data
    // (tokens, user info, internal state) into the browser console, and keeps
    // production logs clean so real errors are easier to spot.
    // Does NOT affect development builds — logs will still appear during `npm run dev`.
    drop: ['console', 'debugger'],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
      },
    },
  },
})
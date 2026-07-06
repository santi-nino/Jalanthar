import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// IMPORTANT: set `base` to your GitHub repo name for GitHub Pages, e.g. '/jalanthar-site/'
// If deploying to a custom domain or user/org page (username.github.io), set base to '/'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/jalanthar-site/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('reactflow')) return 'reactflow'
          if (id.includes('firebase')) return 'firebase'
        },
      },
    },
  },
})

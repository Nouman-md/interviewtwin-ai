import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  preview: {
    allowedHosts: ['distinguished-optimism-production-28ad.up.railway.app']
  }
})
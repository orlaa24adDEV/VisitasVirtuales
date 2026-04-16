import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const unityHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}

export default defineConfig({
  plugins: [react()],
  server: { headers: unityHeaders },
  preview: { headers: unityHeaders },
})

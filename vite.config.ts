import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const CNAME = readFileSync('./public/CNAME', 'utf8').trim();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `https://${CNAME}/`,
  resolve: {
    alias: {
      '@': resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: 'docs'
  }
})

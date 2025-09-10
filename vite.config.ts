import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is the crucial line for GitHub Pages deployment. 
  // It sets the base path to the repository name.
  base: "/Curated-Video-Collection/",
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the repository name from the homepage URL in package.json
// This assumes your homepage is in the format 'https://<username>.github.io/<repo-name>'
// If you are using a custom domain, you can simply set the base to '/'
const homepage = require('./package.json').homepage;
const repoName = homepage ? `/${homepage.split('/').pop()}/` : '/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base path for the build
  base: repoName,
});

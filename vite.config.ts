import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base 使用相对路径,方便部署到任意子路径(如 GitHub Pages / 自定义域名)
export default defineConfig({
  plugins: [react()],
  base: './',
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


// frontend/vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       // If frontend calls: /generate-article
//       "/generate-article": {
//         target: "http://localhost:8081",
//         changeOrigin: true,
//         rewrite: () => "/api/ai/generate-article",
//       },

//       "/generate-blog-title": {
//         target: "http://localhost:8081",
//         changeOrigin: true,
//         rewrite: () => "/api/ai/generate-blog-title",
//       },

//       "/generate-image": {
//         target: "http://localhost:8081",
//         changeOrigin: true,
//         rewrite: () => "/api/ai/generate-image",
//       },

//       "/remove-background": {
//         target: "http://localhost:8081",
//         changeOrigin: true,
//         rewrite: () => "/api/ai/remove-background",
//       },

//       "/remove-object": {
//         target: "http://localhost:8081",
//         changeOrigin: true,
//         rewrite: () => "/api/ai/remove-object",
//       },

//       "/review-resume": {
//         target: "http://localhost:8081",
//         changeOrigin: true,
//         rewrite: () => "/api/ai/review-resume",
//       },

//       // Also allow any /api/* calls
//       "/api": {
//         target: "http://localhost:8081",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

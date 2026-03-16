import { defineConfig, type Plugin } from 'vite'
import type { OutputOptions, OutputChunk, OutputAsset } from 'rollup'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import fs from 'node:fs'
import path from 'node:path'

// Custom plugin to inject resource hints (prefetch for JS chunks)
function htmlPlugin(): Plugin {
  return {
    name: 'html-Resource-hints',
    transformIndexHtml(html: string) {
      // Add placeholder for prefetch links
      return html.replace('</head>', '    <!-- prefetch-placeholder --></head>');
    },
    async writeBundle(options, bundle) {
      // Get all JS file names from the bundle (excluding entry point)
      const jsFiles = Object.keys(bundle).filter(
        name => name.endsWith('.js') && !name.includes('-entry.js')
      );
      
      const prefetchLinks = jsFiles
        .map(file => `<link rel="prefetch" as="script" href="/${file}">`)
        .join('\n    ');
      
      // Find the HTML file in the output dir
      const outputDir = (options as OutputOptions).dir || 'dist';
      
      const htmlFiles = ['index.html'];
      for (const htmlFile of htmlFiles) {
        const htmlPath = path.join(outputDir, htmlFile);
        if (!fs.existsSync(htmlPath)) continue;
        
        let source = fs.readFileSync(htmlPath, 'utf-8');
        source = source.replace('<!-- prefetch-placeholder -->', prefetchLinks);
        fs.writeFileSync(htmlPath, source);
      }
    }
  };
}

export default defineConfig(({ command, mode }) => {
  const plugins = [
    react(),
    tailwindcss(),
    htmlPlugin(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ];
  
  // Add bundle analyzer when ANALYZE env is set
  if (process.env.ANALYZE) {
    plugins.push(visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }));
  }
  
  return {
    plugins,
    server: {
      port: 3000,
      host: true
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',  // was: 'terser' - esbuild is 10-100x faster
      sourcemap: false,
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunk size
      rollupOptions: {
        output: {
          // Dynamic chunk splitting for better caching
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return;
            
            // Separate large libraries for better caching
            if (id.includes('recharts')) return 'charts';
            if (id.includes('framer-motion')) return 'animations';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('katex') || id.includes('react-katex')) return 'math';
            if (id.includes('@radix-ui')) return 'ui-primitives';
            if (id.includes('supabase')) return 'supabase';
            if (id.includes('react-router-dom')) return 'router';
            if (id.includes('react-dom') || id.includes('react/')) return 'react-core';
            
            return 'vendor';
          },
          // Add content hash for better caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 500
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'recharts']
    }
  }
})

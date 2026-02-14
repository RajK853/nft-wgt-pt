/**
 * Performance Benchmark Script
 * Run with: bun run benchmark
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

const distDir = './dist/assets'

console.log('🚀 NFT Weingarten Performance Benchmark\n')
console.log('='.repeat(50))

// 1. Build the project
console.log('\n📦 Step 1: Building production bundle...\n')
try {
  execSync('bun run build', { stdio: 'inherit' })
  console.log('✅ Build completed successfully\n')
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

// 2. Analyze bundle sizes
console.log('📊 Step 2: Bundle Size Analysis\n')

if (existsSync(distDir)) {
  const files = execSync(`ls -lh ${distDir}`).toString()
  console.log(files)
  
  // Calculate total size
  const totalSize = execSync(`du -sh ${distDir}`).toString().split('\t')[0]
  console.log(`\n📁 Total bundle size: ${totalSize}`)
}

// 3. Check gzip sizes (if gzip is available)
console.log('\n🗜️ Step 3: Gzipped Sizes (optional)\n')
try {
  const gzipCheck = execSync(`which gzip`).toString()
  if (gzipCheck) {
    console.log('Run manually: gzip -k dist/assets/*.js && ls -lh dist/assets/')
  }
} catch {
  console.log('⚠️ gzip not available, skipping gzip analysis')
}

// 4. Manual Lighthouse check
console.log('\n🔍 Step 4: Manual Lighthouse Check')
console.log('-'.repeat(50))
console.log(`
To run Lighthouse benchmark:

1. Start the dev server:
   bun run dev

2. Open Chrome DevTools → Lighthouse tab

3. Select "Navigation" mode and run analysis

4. Target metrics:
   - LCP (Largest Contentful Paint): < 2.5s
   - INP (Interaction to Next Paint): < 200ms  
   - CLS (Cumulative Layout Shift): < 0.1
   - TBT (Total Blocking Time): < 200ms
`)

// 5. Web Vitals check
console.log('🔬 Step 5: Core Web Vitals Targets')
console.log('-'.repeat(50))
console.log(`
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP    | < 2.5s | 2.5s - 4s     | > 4s   |
| INP    | < 200ms | 200ms - 500ms | > 500ms|
| CLS    | < 0.1   | 0.1 - 0.25    | > 0.25 |
`)

console.log('\n' + '='.repeat(50))
console.log('✅ Benchmark complete!')

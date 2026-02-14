# Troubleshooting Guide

This guide helps resolve common issues encountered when developing or deploying the NFT Weingarten Penalty Tracker application.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Development Server Issues](#development-server-issues)
3. [Build Issues](#build-issues)
4. [Runtime Issues](#runtime-issues)
5. [Testing Issues](#testing-issues)
6. [Deployment Issues](#deployment-issues)

---

## Installation Issues

### Bun Installation Fails

**Problem:** Bun fails to install or is not recognized.

**Solution:**
```bash
# Install Bun via official script
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version

# If still not found, add to PATH
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

### Dependencies Fail to Install

**Problem:** `bun install` fails with errors.

**Solution:**
```bash
# Clear bun cache
rm -rf node_modules
rm bun.lockb

# Reinstall with frozen lockfile
bun install --frozen-lockfile

# Or without lockfile
bun install
```

---

## Development Server Issues

### Port**Problem:** ` Already in Use

Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or start on different port
bun run dev --port 3001
```

### Hot Module Replacement Not Working

**Problem:** Changes don't reflect in browser.

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
bun run dev
```

### TypeScript Errors in Development

**Problem:** TypeScript errors preventing development.

**Solution:**
```bash
# Check TypeScript version
bunx tsc --version

# Run type check
bunx tsc --noEmit
```

---

## Build Issues

### Build Fails with Memory Error

**Problem:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" bun run build
```

### CSS Not Loading

**Problem:** Styles not applying in production build.

**Solution:**
1. Check Tailwind CSS is properly configured in `vite.config.ts`
2. Ensure `@tailwind` directives are in `globals.css`
3. Rebuild: `bun run build`

### Module Not Found Errors

**Problem:** `Cannot find module '@/lib/utils'`

**Solution:**
Check `vite.config.ts` has the correct alias:
```typescript
resolve: {
  alias: {
    '@': '/src'
  }
}
```

---

## Runtime Issues

### Blank Page After Loading

**Problem:** Application loads but shows blank page.

**Solution:**
1. Check browser console for errors
2. Verify `main.tsx` is correctly mounting
3. Check App component is rendering

### Authentication Not Working

**Problem:** Users can't sign in or sign up.

**Solution:**
1. Verify Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Check Supabase dashboard for:
   - Email auth enabled in Authentication settings
   - Correct site URL configured

3. Check network tab for auth requests

### Data Not Loading

**Problem:** API calls return no data or errors.

**Solution:**
1. Check Supabase table has data
2. Verify RLS (Row Level Security) policies
3. Check browser network tab for request errors
4. Review Supabase logs in dashboard

### Charts Not Rendering

**Problem:** Charts appear empty or broken.

**Solution:**
1. Verify Recharts is installed: `bun add recharts`
2. Check console for library errors
3. Ensure data format matches chart requirements
4. Verify container has defined height

---

## Testing Issues

### Tests Fail with Import Errors

**Problem:** `Cannot find module` errors in tests.

**Solution:**
1. Ensure vitest-setup.js is configured in `package.json`
2. Add to `package.json`:
```json
"vitest": {
 {
    "environment  "test":": "jsdom",
    "globals": true,
    "setupFiles": ["./vitest-setup.js"]
  }
}
```

### Jest-DOM Matchers Not Found

**Problem:** `toBeInTheDocument` is not a function.

**Solution:**
Ensure `@testing-library/jest-dom` is imported in setup:
```javascript
// vitest-setup.js
import '@testing-library/jest-dom/vitest'
```

### Async Tests Timing Out

**Problem:** Tests fail with timeout errors.

**Solution:**
Use async/await or return promises:
```typescript
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

---

## Deployment Issues

### Build Size Too Large

**Problem:** CI fails due to large build size.

**Solution:**
1. Check bundle analysis: `bun run build && du -sh dist`
2. Enable code splitting in `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        charts: ['recharts']
      }
    }
  }
}
```

### Environment Variables Not Working in Production

**Problem:** Production app missing environment variables.

**Solution:**
1. Prefix variables with `VITE_` for client-side access
2. Set variables in hosting platform dashboard
3. For Vercel: Add in Settings → Environment Variables
4. For Netlify: Add in Site settings → Environment variables

### 404 on Refresh (SPA Routing)

**Problem:** Direct links return 404.

**Solution:**
Configure server to redirect all routes to `index.html`:

**Vercel (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify (`_redirects`):**
```
/*    /index.html   200
```

---

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/RajK853/nft-wgt-pt/issues)
2. Search the [Discussions](https://github.com/RajK853/nft-wgt-pt/discussions)
3. Review the [API Documentation](API.md)
4. Review the [Migration Guide](MIGRATION.md)

---

## Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Bun with verbose output
bun run dev --verbose

# Or set environment variable
DEBUG=* bun run dev
```

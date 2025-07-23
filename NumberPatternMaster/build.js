#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for Vercel deployment...');

try {
  // Build the client
  console.log('Building client...');
  execSync('vite build --outDir dist/public', { stdio: 'inherit' });
  
  // Build the server (not needed for Vercel functions, but good to have)
  console.log('Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
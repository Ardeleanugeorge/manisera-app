const fs = require('fs');
const path = require('path');

// Copy manifest.json from public to dist
const publicManifest = path.join(__dirname, '../public/manifest.json');
const distManifest = path.join(__dirname, '../dist/manifest.json');

// Copy service worker from public to dist
const publicSW = path.join(__dirname, '../public/sw.js');
const distSW = path.join(__dirname, '../dist/sw.js');

if (fs.existsSync(publicManifest)) {
  // Ensure dist directory exists
  const distDir = path.dirname(distManifest);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Copy manifest.json
  fs.copyFileSync(publicManifest, distManifest);
  console.log('✅ manifest.json copied to dist/');
} else {
  console.warn('⚠️  manifest.json not found in public/');
}

if (fs.existsSync(publicSW)) {
  // Ensure dist directory exists
  const distDir = path.dirname(distSW);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Copy service worker
  fs.copyFileSync(publicSW, distSW);
  console.log('✅ sw.js copied to dist/');
} else {
  console.warn('⚠️  sw.js not found in public/');
}




const fs = require('fs');
const path = require('path');

// Copy manifest.json from public to dist
const publicManifest = path.join(__dirname, '../public/manifest.json');
const distManifest = path.join(__dirname, '../dist/manifest.json');

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



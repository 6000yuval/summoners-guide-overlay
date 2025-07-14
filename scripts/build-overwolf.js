const fs = require('fs-extra');
const path = require('path');

async function buildOverwolf() {
  const distDir = path.join(__dirname, '../dist');
  const overwolfDir = path.join(__dirname, '../dist-overwolf');
  
  console.log('Building Overwolf package...');
  
  // Create dist-overwolf directory
  await fs.ensureDir(overwolfDir);
  
  // Copy built files from dist to dist-overwolf
  await fs.copy(distDir, overwolfDir);
  
  // Copy Overwolf-specific files
  const overwolfFiles = [
    'manifest.json',
    'background.html', 
    'background.js'
  ];
  
  for (const file of overwolfFiles) {
    const srcPath = path.join(__dirname, '..', file);
    const destPath = path.join(overwolfDir, file);
    
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
      console.log(`Copied ${file}`);
    } else {
      console.warn(`Warning: ${file} not found`);
    }
  }
  
  // Create icons directory if it doesn't exist
  const iconsDir = path.join(overwolfDir, 'icons');
  await fs.ensureDir(iconsDir);
  
  // Copy favicon as icon if no specific icons exist
  const faviconPath = path.join(overwolfDir, 'favicon.ico');
  const iconPath = path.join(iconsDir, 'icon.png');
  const iconGrayPath = path.join(iconsDir, 'icon_gray.png');
  
  if (await fs.pathExists(faviconPath)) {
    console.log('Note: Using favicon.ico as app icon. Consider adding proper PNG icons to icons/ directory.');
  }
  
  console.log('Overwolf build complete!');
  console.log(`Output directory: ${overwolfDir}`);
}

buildOverwolf().catch(console.error);
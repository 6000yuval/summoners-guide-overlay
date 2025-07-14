const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

async function packageOverwolf() {
  const overwolfDir = path.join(__dirname, '../dist-overwolf');
  const packagePath = path.join(__dirname, '../league-coach-pro-overwolf.zip');
  
  console.log('Packaging Overwolf app...');
  
  // Check if dist-overwolf exists
  if (!(await fs.pathExists(overwolfDir))) {
    console.error('dist-overwolf directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  // Remove existing package
  if (await fs.pathExists(packagePath)) {
    await fs.remove(packagePath);
  }
  
  // Create ZIP archive
  const output = fs.createWriteStream(packagePath);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  
  output.on('close', () => {
    console.log(`Package created: ${packagePath}`);
    console.log(`Package size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log('Ready for Overwolf submission!');
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  archive.pipe(output);
  archive.directory(overwolfDir, false);
  archive.finalize();
}

// Check if archiver is available
try {
  require('archiver');
  packageOverwolf().catch(console.error);
} catch (err) {
  console.log('Installing archiver package...');
  const { execSync } = require('child_process');
  execSync('npm install archiver --save-dev', { stdio: 'inherit' });
  packageOverwolf().catch(console.error);
}
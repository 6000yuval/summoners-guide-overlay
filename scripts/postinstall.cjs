#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Running post-install validation...');

// Check if electron is installed
try {
  require('electron');
  console.log('✅ Electron is available');
} catch (error) {
  console.log('⚠️  Electron not found, but continuing...');
}

// Validate TypeScript compilation
try {
  console.log('🔍 Validating TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript validation passed');
} catch (error) {
  console.log('⚠️  TypeScript validation failed, but continuing...');
}

// Create required directories
const dirs = ['dist', 'dist-electron'];
dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created ${dir} directory`);
  }
});

console.log('✅ Post-install validation complete');
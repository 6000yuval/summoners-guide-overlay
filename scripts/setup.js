#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up League Overlay for local development...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js 16+ is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version:', nodeVersion);

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copying .env.example to .env...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
    console.log('ℹ️  Edit .env file to configure your API keys if needed');
  } else {
    console.log('⚠️  No .env.example found, creating basic .env...');
    const basicEnv = `NODE_ENV=development
ENABLE_MOCKS=true
MOCK_GAME_STATE=ChampSelect
MOCK_CHAMPION=Yasuo
MOCK_ROLE=mid
DEV_PORT=3000
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Basic .env file created');
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies if needed
try {
  console.log('📦 Checking dependencies...');
  execSync('npm list --depth=0', { stdio: 'ignore' });
  console.log('✅ Dependencies are installed');
} catch (error) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
}

// Build assets
try {
  console.log('🔨 Building assets...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Assets built successfully');
} catch (error) {
  console.log('⚠️  Asset build failed, but continuing...');
}

console.log('\n🎉 Setup complete!\n');
console.log('📖 Next steps:');
console.log('   1. Edit .env file if you want to use real API keys');
console.log('   2. Run "npm start" for Electron app');
console.log('   3. Run "npm run dev" for web development');
console.log('   4. Run "npm run dev:electron" for Electron development');
console.log('\n💡 The overlay will use mock data by default, so it works without League running!\n');
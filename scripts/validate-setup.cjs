#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating League Overlay setup...\n');

let hasErrors = false;

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description} missing: ${filePath}`);
    hasErrors = true;
    return false;
  }
}

function checkCommand(command, description) {
  try {
    execSync(command, { stdio: 'ignore' });
    console.log(`✅ ${description}`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed`);
    hasErrors = true;
    return false;
  }
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 16) {
  console.log(`✅ Node.js version: ${nodeVersion}`);
} else {
  console.log(`❌ Node.js 16+ required, found: ${nodeVersion}`);
  hasErrors = true;
}

// Check required files
checkFile('.env', '.env configuration file');
checkFile('.env.example', '.env.example template');
checkFile('src/services/mockService.ts', 'Mock service');
checkFile('electron/main.cjs', 'Electron main process');
checkFile('vite.config.ts', 'Vite configuration');

// Check package.json scripts
try {
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  const requiredScripts = ['dev', 'build', 'start'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script '${script}' found in package.json`);
    } else {
      console.log(`⚠️  Script '${script}' missing in package.json`);
      console.log(`   Add: "${script}": "..." to package.json scripts`);
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
  hasErrors = true;
}

// Check TypeScript compilation
checkCommand('npx tsc --noEmit', 'TypeScript compilation');

// Check if ports are available
function checkPort(port, description) {
  try {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(port, () => {
      server.close(() => {
        console.log(`✅ Port ${port} available for ${description}`);
      });
    });
    
    server.on('error', () => {
      console.log(`⚠️  Port ${port} might be in use (${description})`);
    });
  } catch (error) {
    console.log(`⚠️  Could not check port ${port} (${description})`);
  }
}

checkPort(8080, 'development server');
checkPort(8081, 'HMR');

// Test mock service
try {
  console.log('🧪 Testing mock service...');
  const mockPath = path.join(process.cwd(), 'src/services/mockService.ts');
  if (fs.existsSync(mockPath)) {
    // Basic syntax check
    execSync(`npx tsc --noEmit ${mockPath}`, { stdio: 'ignore' });
    console.log('✅ Mock service syntax valid');
  }
} catch (error) {
  console.log('⚠️  Mock service validation failed');
}

console.log('\n📋 Setup Summary:');
if (hasErrors) {
  console.log('❌ Some issues found. Please fix them before running the app.');
  console.log('\n💡 Quick fixes:');
  console.log('   - Run "npm run setup" to auto-fix common issues');
  console.log('   - Check that all required files exist');
  console.log('   - Ensure Node.js 16+ is installed');
  process.exit(1);
} else {
  console.log('✅ All validation checks passed!');
  console.log('\n🚀 Ready to start development:');
  console.log('   npm run dev      - Web development');
  console.log('   npm start        - Electron app');
  console.log('   npm run setup    - Re-run setup if needed');
}
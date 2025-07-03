# Package.json Scripts Instructions

Since package.json cannot be modified directly, please add these scripts to your package.json file:

```json
{
  "scripts": {
    "setup": "node scripts/setup.js",
    "postinstall": "node scripts/postinstall.js",
    "dev": "vite --port 3000 --host",
    "dev:electron": "concurrently \"npm run dev\" \"wait-on http://localhost:3000 && electron .\"",
    "build": "tsc && vite build",
    "start": "npm run build && electron .",
    "electron": "electron .",
    "dist": "npm run build && electron-builder",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

Also add these dev dependencies if not present:

```bash
npm install --save-dev concurrently wait-on
```

These scripts provide:
- `npm run setup` - One-time setup for new clones
- `npm run dev` - Web development server on port 3000
- `npm run dev:electron` - Electron development with hot-reload
- `npm start` - Production Electron build and start
- `npm run build` - Build the application
- `npm run dist` - Create distributable packages
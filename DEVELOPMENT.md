# Development Guide

This guide covers advanced development topics for the League Overlay project.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Electron      │    │   React App     │    │   League Client │
│   Main Process  │◄──►│   (Renderer)    │◄──►│   (LCU API)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│   Mock Service  │◄─────────────┘
                        │   (Dev Mode)    │
                        └─────────────────┘
```

## Development Modes

### 1. Web Development (`npm run dev`)
- React app only, no Electron
- Perfect for UI development and testing
- Uses mock data automatically
- Hot-reload enabled
- Accessible at `http://localhost:3000`

### 2. Electron Development (`npm run dev:electron`)
- Full Electron app with React renderer
- Includes overlay functionality
- League Client integration (when available)
- Mock data fallback
- Hot-reload for renderer process

### 3. Production Mode (`npm start`)
- Built and packaged Electron app
- Production optimizations
- Real League integration preferred
- Fallback to mock data if needed

## Mock Service Details

The mock service (`src/services/mockService.ts`) provides:

- **Champion Select Data**: Realistic team compositions
- **Live Game Data**: Simulated game state and timers
- **Champion Information**: Full champion stats and abilities
- **Matchup Analysis**: Strategic advice and counter-picks
- **Replay Analysis**: Post-game insights and suggestions

### Customizing Mock Data

Edit `.env` to change mock behavior:

```bash
MOCK_GAME_STATE=ChampSelect    # ChampSelect, InProgress, EndOfGame, None
MOCK_CHAMPION=Yasuo           # Any champion name
MOCK_ROLE=mid                 # top, jungle, mid, bot, support
```

## Service Integration

### LCU Service (`src/services/lcuService.ts`)

Handles League Client connection:

```typescript
// Development: automatic mock fallback
const connected = await lcuService.connect();

// Production: tries real connection first
if (!connected) {
  // Graceful degradation to mock data
}
```

### Riot API Service (`src/services/riotApiService.ts`)

Fetches champion data:

```typescript
// Tries real API, falls back to mock
const champions = await riotApiService.getAllChampions();
```

## Environment Variables

### Required Variables
- `NODE_ENV`: Set automatically by development tools
- `ENABLE_MOCKS`: Controls mock data usage (default: true in dev)

### Optional Variables
- `RIOT_API_KEY`: Real Riot API key (optional)
- `DEV_PORT`: Development server port (default: 3000)
- `MOCK_*`: Mock data configuration

### Electron-Specific
- `ELECTRON_IS_DEV`: Electron development mode
- `ELECTRON_DEBUG`: Show dev tools automatically

## Testing Scenarios

### Test Champion Select
1. Set `MOCK_GAME_STATE=ChampSelect` 
2. Start app
3. Verify champion tips appear
4. Test team composition display

### Test Live Game
1. Set `MOCK_GAME_STATE=InProgress`
2. Start app
3. Verify overlay shows game timer
4. Test strategic advice display

### Test Real League Integration
1. Start League of Legends client
2. Set `ENABLE_MOCKS=false`
3. Start app
4. Verify real connection status

## Build Process

### Development Build
```bash
npm run build        # TypeScript + Vite build
npm run type-check   # TypeScript validation only
```

### Production Distribution
```bash
npm run dist         # Creates distributable packages
```

### Output Directories
- `dist/`: Web build output
- `dist-electron/`: Electron distribution packages

## Debugging

### React DevTools
Available in development mode:
- Web: Use browser devtools
- Electron: Set `ELECTRON_DEBUG=true`

### League Integration Debugging
1. Check console for LCU connection status
2. Verify lockfile detection
3. Test API endpoints manually

### Mock Service Debugging
1. Enable mock service logs in console
2. Verify mock data structure
3. Test state transitions

## Common Development Tasks

### Adding New Champion Data
1. Update `mockService.ts` with new champion
2. Add corresponding image assets
3. Update champion selection UI

### Adding New Game Phases
1. Extend `GameflowPhase` type
2. Update mock service state machine
3. Add corresponding UI components

### Customizing Overlay Appearance
1. Edit overlay components in `src/components/`
2. Update CSS/Tailwind styles
3. Test in both web and Electron modes

## Performance Considerations

### Development
- Mock service is lightweight and fast
- Hot-reload minimizes restart time
- TypeScript compilation is incremental

### Production
- Real API calls are cached
- Electron process separation prevents UI blocking
- Overlay rendering is optimized for minimal impact

## Troubleshooting

### Port Conflicts
- Change `DEV_PORT` in `.env`
- Kill existing processes on port 3000

### TypeScript Errors
- Run `npm run type-check` for detailed errors
- Check mock service type definitions
- Verify import paths

### Electron Issues
- Clear `dist` directory
- Rebuild with `npm run build`
- Check Electron version compatibility

### Mock Data Not Loading
- Verify `.env` configuration
- Check mock service import paths
- Enable development console logging
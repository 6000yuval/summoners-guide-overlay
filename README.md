# Summoner's Guide Overlay

A League of Legends overlay application that provides real-time champion tips, matchup analysis, and game insights directly in your game.

## Features

- 🎮 **Real-time Game Integration**: Connects to League Client for live game data
- 🏆 **Champion Tips**: Get contextual advice during champion select and gameplay
- ⚔️ **Matchup Analysis**: Detailed matchup advice and counter-strategies
- 📊 **Game Sense Engine**: AI-powered gameplay recommendations
- 🎯 **Overlay Mode**: Non-intrusive overlay that works with League of Legends
- 🔄 **Replay Analysis**: Post-game analysis and improvement suggestions

## Quick Start

### Prerequisites

- **Node.js 16+** ([Download here](https://nodejs.org/) or [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm** (comes with Node.js)
- **Git** ([Download here](https://git-scm.com/))
- **League of Legends** (optional - app works with mock data for development)

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/6000yuval/summoners-guide-overlay.git
cd summoners-guide-overlay

# Run the setup script (installs dependencies, creates .env, validates setup)
npm run setup

# Start the application
npm start
```

That's it! The overlay will open and display example summoner data using mock data.

## Local Development

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/6000yuval/summoners-guide-overlay.git
   cd summoners-guide-overlay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file with your preferred settings
   # The app works great with default mock settings!
   ```

4. **Run the setup script** (optional but recommended)
   ```bash
   npm run setup
   ```

5. **Start the development server**
   ```bash
   # For web development (React app only)
   npm run dev
   
   # For Electron development (full overlay app)
   npm run dev:electron
   
   # For production Electron build
   npm start
   ```

### Development Modes

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Web development server (port 3000) | Frontend development, UI testing |
| `npm run dev:electron` | Electron app with hot-reload | Full app development with overlay |
| `npm start` | Production Electron build | Testing production build |
| `npm run setup` | One-time setup script | Initial project setup |

### Environment Configuration

The app uses environment variables for configuration. Copy `.env.example` to `.env` and customize:

```bash
# Development Settings
NODE_ENV=development
ENABLE_MOCKS=true              # Use mock data when League isn't running
DEV_PORT=3000                  # Development server port

# Mock Data Settings (for development without League)
MOCK_GAME_STATE=ChampSelect    # ChampSelect, InProgress, or None
MOCK_CHAMPION=Yasuo           # Default champion for testing
MOCK_ROLE=mid                 # Default role for testing

# API Keys (optional - app works without them in development)
RIOT_API_KEY=your_riot_api_key_here

# League Client Integration
LCU_PORT=2999                 # League Client port (auto-detected normally)
LCU_PASSWORD=mock_password    # Mock password for development
```

### Mock Data Mode

The app includes comprehensive mock data so you can develop and test without League of Legends running:

- **Champion Select Simulation**: Shows realistic champion select with teams
- **Live Game Data**: Simulates in-game overlay with tips and analysis
- **Matchup Analysis**: Provides example champion matchup advice
- **Real API Fallback**: Automatically falls back to mock data if APIs fail

### Development with Docker

For containerized development:

```bash
# Build and run with Docker Compose
docker-compose up

# The app will be available at http://localhost:3000
```

### Available Scripts

```bash
npm run setup          # One-time setup (recommended for new clones)
npm run dev           # Start web development server
npm run dev:electron  # Start Electron app with hot-reload
npm start            # Start production Electron app
npm run build        # Build for production
npm run electron     # Run Electron (after build)
npm run dist         # Build distributable packages
npm test             # Run tests
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Testing the Overlay

After setup, you should see:

1. **Champion Select Mode**: 
   - Shows champion tips and matchup analysis
   - Displays team compositions
   - Provides strategic advice

2. **In-Game Mode**: 
   - Real-time gameplay tips
   - Farm and objective reminders
   - Positioning advice

3. **Overlay Controls**: 
   - Press `Alt + A` to toggle overlay visibility
   - Resize and move overlay windows
   - Settings panel for customization

### Troubleshooting

**Blank white screen?**
- Make sure you ran `npm run setup` 
- Check that `.env` file exists
- Verify Node.js version is 16+

**No champion data showing?**
- The app uses mock data by default, so this should work immediately
- Check browser console for any errors
- Ensure `ENABLE_MOCKS=true` in your `.env` file

**Electron app not starting?**
- Run `npm run build` first
- Check that electron is installed: `npm list electron`
- Try `npm run dev:electron` for development mode

**API errors?**
- The app is designed to work without real APIs
- Mock data is automatically used when APIs are unavailable
- Real League integration only works when League of Legends is running

### Adding Real League Integration

To connect to actual League of Legends:

1. **Start League of Legends client**
2. **Set environment variables** (optional):
   ```bash
   ENABLE_MOCKS=false
   RIOT_API_KEY=your_actual_riot_api_key
   ```
3. **Run the app**: The overlay will automatically detect and connect to League

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with comprehensive tests
4. Ensure `npm run setup` works for new contributors
5. Submit a pull request

## Project Structure

```
summoners-guide-overlay/
├── src/
│   ├── components/          # React components
│   ├── services/           # API and integration services
│   ├── hooks/              # Custom React hooks
│   └── pages/              # Main application pages
├── electron/               # Electron main process
├── scripts/                # Setup and build scripts
├── public/                 # Static assets
└── dist/                   # Built application
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cf784f5c-8634-4b06-80c4-06e74a04ad2f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

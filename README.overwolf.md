# League Coach Pro - Overwolf Edition

Professional League of Legends coaching overlay powered by Overwolf.

## 🎮 Features

- **Real-time Game Integration**: Native Overwolf integration with League of Legends
- **Champion Select Coaching**: Get tips and strategies during champion select
- **In-Game Overlay**: Non-intrusive overlay with real-time coaching
- **Hotkey Support**: Quick access with customizable hotkeys
- **Performance Optimized**: Built specifically for gaming performance

## 🚀 Installation

### From Overwolf Store (Recommended)
1. Install [Overwolf](https://www.overwolf.com/)
2. Search for "League Coach Pro" in the Overwolf App Store
3. Click Install and follow the setup instructions

### Development Installation
1. Clone this repository
2. Install dependencies: `npm install`
3. Build for Overwolf: `npm run build`
4. Load the `dist-overwolf` folder as an unpacked extension in Overwolf

## 🎯 Usage

### Getting Started
1. Launch League of Legends
2. The app will automatically detect the game and activate
3. Use hotkeys to interact with the overlay:
   - `Alt+A`: Toggle overlay visibility
   - `Alt+T`: Show champion tips

### Features Overview

#### Champion Select
- Automatic champion detection
- Matchup analysis and tips
- Role-specific advice
- Counter-pick suggestions

#### In-Game Overlay
- Real-time performance metrics
- Objective timers and reminders
- Gank warnings and map awareness
- Item build suggestions

#### Post-Game Analysis
- Automatic replay analysis
- Performance insights
- Areas for improvement
- Match history tracking

## ⚙️ Configuration

Access settings through the main dashboard:
- Overlay opacity and position
- Notification preferences
- Hotkey customization
- Feature toggles

## 🛠️ Development

### Requirements
- Node.js 16+
- npm or yarn
- Overwolf platform

### Build Commands
```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Build specifically for Overwolf
npm run build:overwolf

# Package for distribution
npm run package
```

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # React hooks
├── services/           # API and integration services
├── pages/             # Main application pages
├── types/             # TypeScript definitions
└── utils/             # Utility functions

overwolf/
├── manifest.json      # Overwolf app manifest
├── background.js      # Background script
└── background.html    # Background page
```

## 🔧 Overwolf Integration

### Manifest Configuration
The app uses Overwolf's game events API to integrate with League of Legends:
- Game state detection
- Champion select events
- Live game data
- Match results

### Window Management
- **Desktop Window**: Main application interface
- **Overlay Window**: In-game overlay
- **Background Process**: Event handling and data management

### Hotkeys
Configurable through Overwolf's hotkey system:
- Global hotkeys work even when League is in focus
- Customizable key combinations
- Visual feedback for hotkey actions

## 📊 Performance

### Optimizations
- Minimal CPU usage during gameplay
- Efficient memory management
- Optimized rendering for overlay performance
- Smart caching for game data

### System Requirements
- Windows 10 64-bit or higher
- Overwolf platform installed
- League of Legends installed
- 4 GB RAM minimum
- 1 GB free disk space

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Overwolf
5. Submit a pull request

### Testing
- Test in Overwolf environment
- Verify League of Legends integration
- Check overlay performance
- Validate hotkey functionality

## 📋 Overwolf Submission Checklist

- [ ] Manifest.json properly configured
- [ ] All required icons included
- [ ] Background script functional
- [ ] Game events properly registered
- [ ] Performance optimized
- [ ] No prohibited APIs used
- [ ] Privacy policy included
- [ ] Terms of service included

## 🐛 Troubleshooting

### Common Issues

**App not detecting League of Legends:**
- Ensure League is running
- Check Overwolf permissions
- Restart both Overwolf and League

**Overlay not showing:**
- Check hotkey bindings
- Verify overlay window permissions
- Try toggling with Alt+A

**Performance issues:**
- Close unnecessary applications
- Check Overwolf GPU acceleration settings
- Reduce overlay opacity if needed

## 📝 Legal

League Coach Pro is not endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.

All trademarks, service marks, trade names, trade dress, product names and logos appearing in the app are the property of their respective owners.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Overwolf Platform](https://www.overwolf.com/)
- [Overwolf Developer Documentation](https://overwolf.github.io/docs/)
- [League of Legends](https://leagueoflegends.com/)
- [Report Issues](https://github.com/your-username/league-coach-pro/issues)
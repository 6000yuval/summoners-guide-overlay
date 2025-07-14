// Overwolf background script for League Coach Pro
console.log('League Coach Pro background script loaded');

let isGameRunning = false;
let overlayWindow = null;
let desktopWindow = null;

// Initialize app
overwolf.extensions.current.getManifest((result) => {
    console.log('App manifest:', result);
    initializeApp();
});

function initializeApp() {
    // Set up game event listeners
    setupGameEvents();
    
    // Set up hotkey listeners
    setupHotkeys();
    
    // Create desktop window
    createDesktopWindow();
}

function setupGameEvents() {
    // Register for League of Legends events
    overwolf.games.events.setRequiredFeatures(['live_client_data', 'matchState', 'match_info'], (info) => {
        if (info.status === 'error') {
            console.error('Failed to set required features:', info.reason);
        } else {
            console.log('Game events features set successfully');
        }
    });

    // Listen for game launches
    overwolf.games.onGameLaunched.addListener((info) => {
        if (info.gameId === 5426) { // League of Legends
            console.log('League of Legends launched');
            isGameRunning = true;
            createOverlayWindow();
        }
    });

    // Listen for game info updates
    overwolf.games.onGameInfoUpdated.addListener((info) => {
        if (info.gameId === 5426) {
            console.log('Game info updated:', info);
            broadcastGameInfo(info);
        }
    });

    // Listen for game events
    overwolf.games.events.onNewEvents.addListener((info) => {
        console.log('New game events:', info);
        broadcastGameEvents(info.events);
    });

    // Listen for game exit
    overwolf.games.onGameClosed.addListener((info) => {
        if (info.gameId === 5426) {
            console.log('League of Legends closed');
            isGameRunning = false;
            closeOverlayWindow();
        }
    });
}

function setupHotkeys() {
    overwolf.settings.hotkeys.onPressed.addListener((result) => {
        console.log('Hotkey pressed:', result);
        
        switch (result.name) {
            case 'toggle_overlay':
                toggleOverlay();
                break;
            case 'show_tips':
                showChampionTips();
                break;
        }
    });
}

function createDesktopWindow() {
    overwolf.windows.obtainDeclaredWindow('desktop', (result) => {
        if (result.status === 'success') {
            desktopWindow = result.window;
            overwolf.windows.restore(desktopWindow.id);
        }
    });
}

function createOverlayWindow() {
    overwolf.windows.obtainDeclaredWindow('overlay', (result) => {
        if (result.status === 'success') {
            overlayWindow = result.window;
            overwolf.windows.restore(overlayWindow.id);
        }
    });
}

function closeOverlayWindow() {
    if (overlayWindow) {
        overwolf.windows.close(overlayWindow.id);
        overlayWindow = null;
    }
}

function toggleOverlay() {
    if (!overlayWindow) {
        createOverlayWindow();
        return;
    }

    overwolf.windows.getWindowState(overlayWindow.id, (result) => {
        if (result.status === 'success') {
            if (result.window_state === 'minimized' || result.window_state === 'hidden') {
                overwolf.windows.restore(overlayWindow.id);
            } else {
                overwolf.windows.minimize(overlayWindow.id);
            }
        }
    });
}

function showChampionTips() {
    if (overlayWindow) {
        overwolf.windows.sendMessage(overlayWindow.id, 'show_champion_tips', {}, () => {});
    }
}

function broadcastGameInfo(info) {
    // Send game info to all windows
    if (desktopWindow) {
        overwolf.windows.sendMessage(desktopWindow.id, 'game_info_update', info, () => {});
    }
    if (overlayWindow) {
        overwolf.windows.sendMessage(overlayWindow.id, 'game_info_update', info, () => {});
    }
}

function broadcastGameEvents(events) {
    // Send game events to all windows
    if (desktopWindow) {
        overwolf.windows.sendMessage(desktopWindow.id, 'game_events', events, () => {});
    }
    if (overlayWindow) {
        overwolf.windows.sendMessage(overlayWindow.id, 'game_events', events, () => {});
    }
}
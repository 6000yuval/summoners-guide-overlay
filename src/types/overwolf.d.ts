// Overwolf API type definitions for League Coach Pro

declare global {
  interface Window {
    overwolf?: {
      extensions: {
        current: {
          getManifest: (callback: (result: any) => void) => void;
        };
      };
      games: {
        getRunningGameInfo: (callback: (result: any) => void) => void;
        onGameLaunched: {
          addListener: (callback: (info: any) => void) => void;
          removeListener: (callback: (info: any) => void) => void;
        };
        onGameClosed: {
          addListener: (callback: (info: any) => void) => void;
          removeListener: (callback: (info: any) => void) => void;
        };
        onGameInfoUpdated: {
          addListener: (callback: (info: any) => void) => void;
          removeListener: (callback: (info: any) => void) => void;
        };
        events: {
          setRequiredFeatures: (features: string[], callback: (result: any) => void) => void;
          onNewEvents: {
            addListener: (callback: (info: any) => void) => void;
            removeListener: (callback: (info: any) => void) => void;
          };
          onInfoUpdates2: {
            addListener: (callback: (info: any) => void) => void;
            removeListener: (callback: (info: any) => void) => void;
          };
        };
      };
      windows: {
        getCurrentWindow: (callback: (result: any) => void) => void;
        obtainDeclaredWindow: (windowName: string, callback: (result: any) => void) => void;
        restore: (windowId: string, callback?: (result: any) => void) => void;
        minimize: (windowId: string, callback?: (result: any) => void) => void;
        maximize: (windowId: string, callback?: (result: any) => void) => void;
        close: (windowId: string, callback?: (result: any) => void) => void;
        hide: (windowId: string, callback?: (result: any) => void) => void;
        getWindowState: (windowId: string, callback: (result: any) => void) => void;
        sendMessage: (windowId: string, messageId: string, messageContent: any, callback: (result: any) => void) => void;
        onMessageReceived: {
          addListener: (callback: (message: any) => void) => void;
          removeListener: (callback: (message: any) => void) => void;
        };
        openDevTools: (windowId: string, callback?: (result: any) => void) => void;
        displayMessageBox: (title: string, message: string, callback: (result: any) => void) => void;
      };
      settings: {
        hotkeys: {
          onPressed: {
            addListener: (callback: (result: any) => void) => void;
            removeListener: (callback: (result: any) => void) => void;
          };
        };
      };
      utils: {
        openUrlInDefaultBrowser: (url: string, callback?: (result: any) => void) => void;
      };
    };
  }
}

// Game-specific types
export interface OverwolfGameInfo {
  gameId: number;
  isRunning: boolean;
  isInFocus: boolean;
  runningChanged: boolean;
  gameChanged: boolean;
  width: number;
  height: number;
  logicalWidth: number;
  logicalHeight: number;
  rendererScalingRatio: number;
}

export interface OverwolfWindow {
  id: string;
  name: string;
  width: number;
  height: number;
  top: number;
  left: number;
  isVisible: boolean;
  state: 'normal' | 'minimized' | 'maximized' | 'closed';
}

export interface OverwolfGameEvent {
  name: string;
  data: any;
}

export interface OverwolfFeature {
  name: string;
  state: 'enabled' | 'disabled';
}

export interface OverwolfHotkeyEvent {
  name: string;
  state: 'down' | 'up';
}

// League of Legends specific event data
export interface LeagueGameData {
  live_client_data?: {
    game_data: {
      gameMode: string;
      gameTime: number;
      mapName: string;
      mapNumber: number;
      mapTerrain: string;
    };
    active_player: {
      championStats: any;
      currentGold: number;
      level: number;
      summonerName: string;
    };
    all_players: any[];
    events: {
      Events: any[];
    };
  };
  match_info?: {
    gameId: string;
    gameMode: string;
    gameTime: number;
    mapId: number;
    participants: any[];
  };
  championSelect?: {
    localPlayerCellId: number;
    timer: {
      adjustedTimeLeftInPhase: number;
      phase: string;
    };
    myTeam: any[];
    theirTeam: any[];
    actions: any[];
  };
}

export {};
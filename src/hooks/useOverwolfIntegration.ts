import { useState, useEffect, useCallback } from 'react';
import { overwolfService, OverwolfGameInfo, GameEvent } from '@/services/overwolfService';

interface OverwolfState {
  connected: boolean;
  gameRunning: boolean;
  gameInfo: OverwolfGameInfo | null;
  gamePhase: string;
  championData: any;
  liveGameData: any;
  events: GameEvent[];
}

export const useOverwolfIntegration = () => {
  const [state, setState] = useState<OverwolfState>({
    connected: false,
    gameRunning: false,
    gameInfo: null,
    gamePhase: 'None',
    championData: null,
    liveGameData: null,
    events: []
  });

  // Handle game info updates
  const handleGameInfoUpdate = useCallback((info: OverwolfGameInfo) => {
    setState(prev => ({
      ...prev,
      gameInfo: info,
      gameRunning: info.isRunning,
      gamePhase: info.isRunning ? 'InProgress' : 'None'
    }));
  }, []);

  // Handle game events
  const handleGameEvents = useCallback((events: GameEvent[]) => {
    setState(prev => ({
      ...prev,
      events: [...prev.events, ...events]
    }));

    // Process specific events
    events.forEach(event => {
      switch (event.name) {
        case 'championSelect':
          setState(prev => ({
            ...prev,
            championData: event.data,
            gamePhase: 'ChampSelect'
          }));
          break;
        case 'live_client_data':
          setState(prev => ({
            ...prev,
            liveGameData: event.data,
            gamePhase: 'InProgress'
          }));
          break;
        case 'matchState':
          if (event.data === 'WaitingForStats' || event.data === 'PreEndOfGame') {
            setState(prev => ({
              ...prev,
              gamePhase: 'EndOfGame'
            }));
          }
          break;
      }
    });
  }, []);

  // Initialize Overwolf integration
  const initializeOverwolf = useCallback(() => {
    if (overwolfService.isOverwolfAvailable()) {
      setState(prev => ({ ...prev, connected: true }));
      
      // Set up listeners
      overwolfService.onGameInfoUpdate(handleGameInfoUpdate);
      overwolfService.onGameEvents(handleGameEvents);
      
      // Get initial game info
      const currentGameInfo = overwolfService.getCurrentGameInfo();
      if (currentGameInfo) {
        handleGameInfoUpdate(currentGameInfo);
      }
    } else {
      // Fallback to mock data for development
      console.log('Overwolf not available, using mock data');
      setState(prev => ({
        ...prev,
        connected: true,
        gameRunning: true,
        gamePhase: 'ChampSelect',
        championData: overwolfService.getMockChampionSelectData(),
        liveGameData: overwolfService.getMockLiveGameData()
      }));
    }
  }, [handleGameInfoUpdate, handleGameEvents]);

  // Get champion select data
  const getChampionSelectData = useCallback(() => {
    if (overwolfService.isOverwolfAvailable()) {
      // In real Overwolf, this would come from game events
      return state.championData;
    } else {
      return overwolfService.getMockChampionSelectData();
    }
  }, [state.championData]);

  // Get live game data
  const getLiveGameData = useCallback(() => {
    if (overwolfService.isOverwolfAvailable()) {
      return state.liveGameData;
    } else {
      return overwolfService.getMockLiveGameData();
    }
  }, [state.liveGameData]);

  // Hotkey handlers
  const registerHotkeys = useCallback(() => {
    overwolfService.registerHotkey('toggle_overlay', () => {
      console.log('Toggle overlay hotkey pressed');
    });

    overwolfService.registerHotkey('show_tips', () => {
      console.log('Show tips hotkey pressed');
      window.dispatchEvent(new CustomEvent('show_champion_tips'));
    });
  }, []);

  // Clean up listeners
  const cleanup = useCallback(() => {
    if (overwolfService.isOverwolfAvailable()) {
      overwolfService.removeGameInfoListener(handleGameInfoUpdate);
      overwolfService.removeGameEventListener(handleGameEvents);
    }
  }, [handleGameInfoUpdate, handleGameEvents]);

  // Initialize on mount
  useEffect(() => {
    initializeOverwolf();
    registerHotkeys();
    
    return cleanup;
  }, [initializeOverwolf, registerHotkeys, cleanup]);

  return {
    ...state,
    getChampionSelectData,
    getLiveGameData,
    isOverwolfAvailable: overwolfService.isOverwolfAvailable(),
    minimizeWindow: overwolfService.minimizeWindow.bind(overwolfService),
    closeWindow: overwolfService.closeWindow.bind(overwolfService),
    maximizeWindow: overwolfService.maximizeWindow.bind(overwolfService),
    restoreWindow: overwolfService.restoreWindow.bind(overwolfService)
  };
};

import { useState, useEffect, useCallback } from 'react';
import { lcuService, GameflowPhase } from '@/services/lcuService';
import { replayService, AnalysisResult } from '@/services/replayService';

interface LeagueState {
  connected: boolean;
  gamePhase: GameflowPhase['phase'];
  championData: any;
  replayAnalysis: AnalysisResult | null;
}

export const useLeagueIntegration = () => {
  const [state, setState] = useState<LeagueState>({
    connected: false,
    gamePhase: 'None',
    championData: null,
    replayAnalysis: null
  });

  // Initialize LCU connection
  const connectToLeague = useCallback(async () => {
    try {
      const connected = await lcuService.connect();
      setState(prev => ({ ...prev, connected }));
      
      if (connected) {
        // Start polling for game state changes
        lcuService.startGameStatePolling((phase) => {
          setState(prev => ({ ...prev, gamePhase: phase.phase }));
          
          // If game just ended, trigger replay analysis
          if (phase.phase === 'EndOfGame') {
            analyzeLastGame();
          }
        });
      }
    } catch (error) {
      console.error('Failed to connect to League:', error);
    }
  }, []);

  // Analyze the most recent replay
  const analyzeLastGame = useCallback(async () => {
    try {
      const analysis = await replayService.autoAnalyzeLatestReplay();
      setState(prev => ({ ...prev, replayAnalysis: analysis }));
    } catch (error) {
      console.error('Failed to analyze replay:', error);
    }
  }, []);

  // Get champion select data
  const getChampionSelectData = useCallback(async () => {
    if (!state.connected) return null;
    
    try {
      const session = await lcuService.getChampSelectSession();
      if (session) {
        setState(prev => ({ ...prev, championData: session }));
      }
      return session;
    } catch (error) {
      console.error('Failed to get champion select data:', error);
      return null;
    }
  }, [state.connected]);

  // Initialize connection on mount
  useEffect(() => {
    connectToLeague();
  }, [connectToLeague]);

  return {
    ...state,
    connectToLeague,
    analyzeLastGame,
    getChampionSelectData
  };
};

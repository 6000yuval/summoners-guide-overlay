
export interface ElectronAPI {
  getLeagueData: () => Promise<{ connected: boolean; gamePhase: string }>;
  analyzeReplay: () => Promise<{ success: boolean; analysisId: number }>;
  onToggleChampionSelect: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


interface LCUCredentials {
  port: number;
  password: string;
  protocol: string;
}

export interface ElectronAPI {
  getLeagueData: () => Promise<{ connected: boolean; gamePhase: string }>;
  analyzeReplay: () => Promise<{ success: boolean; analysisId: number }>;
  readLockfile: () => Promise<LCUCredentials | null>;
  testLCUConnection: (credentials: LCUCredentials) => Promise<boolean>;
  onToggleChampionSelect: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

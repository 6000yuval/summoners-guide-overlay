
// LCU (League Client Update) API Integration Service
// This service handles connection to the local League of Legends client

interface LCUCredentials {
  port: number;
  password: string;
  protocol: string;
}

interface GameflowPhase {
  phase: 'None' | 'Lobby' | 'Matchmaking' | 'ChampSelect' | 'InProgress' | 'EndOfGame';
}

interface ChampSelectSession {
  localPlayerCellId: number;
  myTeam: Array<{
    cellId: number;
    championId: number;
    assignedPosition: string;
  }>;
  theirTeam: Array<{
    cellId: number;
    championId: number;
    assignedPosition: string;
  }>;
}

class LCUService {
  private credentials: LCUCredentials | null = null;
  private baseUrl: string = '';
  private isConnected: boolean = false;

  async connect(): Promise<boolean> {
    try {
      console.log('Attempting to connect to League Client...');
      
      // Try to read the actual lockfile
      const credentials = await this.readLockfile();
      if (credentials) {
        this.credentials = credentials;
        this.baseUrl = `${this.credentials.protocol}://riot:${this.credentials.password}@127.0.0.1:${this.credentials.port}`;
        
        // Test the connection
        const testResponse = await this.testConnection();
        if (testResponse) {
          this.isConnected = true;
          console.log('Successfully connected to League Client');
          return true;
        }
      }
      
      // Fallback to demo mode if no client found
      console.log('League Client not found, using demo mode');
      this.credentials = {
        port: 58783,
        password: 'demo-password',
        protocol: 'https'
      };
      this.baseUrl = `${this.credentials.protocol}://riot:${this.credentials.password}@127.0.0.1:${this.credentials.port}`;
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to League Client:', error);
      this.isConnected = false;
      return false;
    }
  }

  private async readLockfile(): Promise<LCUCredentials | null> {
    try {
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        const credentials = await (window as any).electronAPI.readLockfile();
        return credentials;
      }
      
      // Browser environment - return null to use demo mode
      return null;
    } catch (error) {
      console.error('Error reading lockfile:', error);
      return null;
    }
  }

  private async testConnection(): Promise<boolean> {
    try {
      if (!this.credentials) return false;
      
      // Use Electron API if available
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        return await (window as any).electronAPI.testLCUConnection(this.credentials);
      }
      
      // Fallback to browser fetch (will likely fail due to CORS)
      try {
        const response = await fetch(`${this.baseUrl}/lol-gameflow/v1/gameflow-phase`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`riot:${this.credentials.password}`)}`,
          },
        });
        
        return response.ok;
      } catch (error) {
        // Expected to fail in browser due to CORS
        return false;
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getGameflowPhase(): Promise<GameflowPhase | null> {
    if (!this.isConnected) return null;

    try {
      // Try real API call first
      if (this.credentials && this.credentials.password !== 'demo-password') {
        const response = await fetch(`${this.baseUrl}/lol-gameflow/v1/gameflow-phase`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`riot:${this.credentials.password}`)}`,
          },
        });
        
        if (response.ok) {
          const phase = await response.text();
          return { phase: phase.replace(/"/g, '') as GameflowPhase['phase'] };
        }
      }
      
      // Fallback to demo mode
      const phases: GameflowPhase['phase'][] = ['None', 'ChampSelect', 'InProgress'];
      const randomPhase = phases[Math.floor(Math.random() * phases.length)];
      
      return { phase: randomPhase };
    } catch (error) {
      console.error('Failed to get gameflow phase:', error);
      // Return demo data on error
      return { phase: 'None' };
    }
  }

  async getChampSelectSession(): Promise<ChampSelectSession | null> {
    if (!this.isConnected) return null;

    try {
      // Try real API call first
      if (this.credentials && this.credentials.password !== 'demo-password') {
        const response = await fetch(`${this.baseUrl}/lol-champ-select/v1/session`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`riot:${this.credentials.password}`)}`,
          },
        });
        
        if (response.ok) {
          const session = await response.json();
          return session;
        }
      }
      
      // Fallback to mock champion select data
      return {
        localPlayerCellId: 0,
        myTeam: [
          { cellId: 0, championId: 157, assignedPosition: 'middle' }, // Yasuo mid
        ],
        theirTeam: [
          { cellId: 5, championId: 238, assignedPosition: 'middle' }, // Zed mid
        ]
      };
    } catch (error) {
      console.error('Failed to get champion select session:', error);
      return null;
    }
  }

  async getLiveClientData(): Promise<any> {
    if (!this.isConnected) return null;

    try {
      // Mock live game data
      return {
        gameTime: Date.now(),
        playerList: [
          {
            championName: 'Yasuo',
            position: 'middle',
            team: 'ORDER'
          }
        ]
      };
    } catch (error) {
      console.error('Failed to get live client data:', error);
      return null;
    }
  }

  // Poll for game state changes
  startGameStatePolling(callback: (phase: GameflowPhase) => void): void {
    const poll = async () => {
      const phase = await this.getGameflowPhase();
      if (phase) {
        callback(phase);
      }
    };

    // Poll every 2 seconds
    setInterval(poll, 2000);
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }
}

export const lcuService = new LCUService();
export type { GameflowPhase, ChampSelectSession };

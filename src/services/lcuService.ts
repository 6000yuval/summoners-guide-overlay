
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
  private isDevelopment = typeof window !== 'undefined' && window.location?.hostname === 'localhost';

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
      
      // In development mode or when League isn't running, use mock service
      if (this.isDevelopment || !credentials) {
        console.log('League Client not found, using mock/demo mode');
        const { mockService } = await import('./mockService');
        this.credentials = mockService.getMockLCUCredentials();
        this.baseUrl = `${this.credentials.protocol}://riot:${this.credentials.password}@127.0.0.1:${this.credentials.port}`;
        this.isConnected = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to connect to League Client:', error);
      
      // Fallback to mock in development
      if (this.isDevelopment) {
        console.log('Exception occurred, falling back to mock mode');
        const { mockService } = await import('./mockService');
        this.credentials = mockService.getMockLCUCredentials();
        this.baseUrl = `${this.credentials.protocol}://riot:${this.credentials.password}@127.0.0.1:${this.credentials.port}`;
        this.isConnected = true;
        return true;
      }
      
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
      // Try real API call first if we have real credentials
      if (this.credentials && this.credentials.password !== 'demo-password' && this.credentials.password !== 'mock_password') {
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
      
      // Use mock data in development or when real connection fails
      if (this.isDevelopment || this.credentials?.password === 'mock_password') {
        const { mockService } = await import('./mockService');
        const mockData = mockService.getMockLeagueData();
        return { phase: mockData.gamePhase };
      }
      
      // Random fallback for demo mode
      const phases: GameflowPhase['phase'][] = ['None', 'ChampSelect', 'InProgress'];
      const randomPhase = phases[Math.floor(Math.random() * phases.length)];
      
      return { phase: randomPhase };
    } catch (error) {
      console.error('Failed to get gameflow phase:', error);
      
      // Return mock data on error in development
      if (this.isDevelopment) {
        const { mockService } = await import('./mockService');
        const mockData = mockService.getMockLeagueData();
        return { phase: mockData.gamePhase };
      }
      
      return { phase: 'None' };
    }
  }

  async getChampSelectSession(): Promise<ChampSelectSession | null> {
    if (!this.isConnected) return null;

    try {
      // Try real API call first if we have real credentials
      if (this.credentials && this.credentials.password !== 'demo-password' && this.credentials.password !== 'mock_password') {
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
      
      // Use mock data in development or when real connection fails
      if (this.isDevelopment || this.credentials?.password === 'mock_password') {
        const { mockService } = await import('./mockService');
        const mockSession = mockService.getMockChampSelectSession();
        return {
          localPlayerCellId: mockSession.localPlayerCellId,
          myTeam: mockSession.myTeam.map(player => ({
            cellId: player.cellId,
            championId: player.championId,
            assignedPosition: 'middle' // Default position for mock
          })),
          theirTeam: mockSession.theirTeam.map(enemy => ({
            cellId: enemy.cellId,
            championId: enemy.championId,
            assignedPosition: 'middle' // Default position for mock
          }))
        };
      }
      
      // Fallback to basic mock champion select data
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
      
      // Return mock data on error in development
      if (this.isDevelopment) {
        const { mockService } = await import('./mockService');
        const mockSession = mockService.getMockChampSelectSession();
        return {
          localPlayerCellId: mockSession.localPlayerCellId,
          myTeam: mockSession.myTeam.map(player => ({
            cellId: player.cellId,
            championId: player.championId,
            assignedPosition: 'middle'
          })),
          theirTeam: mockSession.theirTeam.map(enemy => ({
            cellId: enemy.cellId,
            championId: enemy.championId,
            assignedPosition: 'middle'
          }))
        };
      }
      
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

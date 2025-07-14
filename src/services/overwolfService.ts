// Overwolf API service for League Coach Pro

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

export interface GameEvent {
  name: string;
  data: any;
}

export interface ChampionSelectData {
  localPlayerCellId: number;
  actions: any[];
  timer: {
    adjustedTimeLeftInPhase: number;
    phase: string;
  };
  myTeam: any[];
  theirTeam: any[];
}

export interface LiveGameData {
  gameData: {
    gameMode: string;
    gameTime: number;
    mapName: string;
    mapNumber: number;
    mapTerrain: string;
  };
  allPlayers: any[];
  activePlayer: {
    championStats: any;
    currentGold: number;
    level: number;
    summonerName: string;
  };
  events: {
    Events: any[];
  };
}

class OverwolfService {
  private gameInfo: OverwolfGameInfo | null = null;
  private gameEventListeners: ((events: GameEvent[]) => void)[] = [];
  private gameInfoListeners: ((info: OverwolfGameInfo) => void)[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !window.overwolf) {
      console.warn('Overwolf API not available - running in web mode');
      this.isInitialized = false;
      return;
    }

    // Set up message listeners
    window.overwolf.windows.onMessageReceived.addListener((message: any) => {
      this.handleMessage(message);
    });

    // Get current game info
    window.overwolf.games.getRunningGameInfo((result: any) => {
      if (result && result.gameId === 5426) { // League of Legends
        this.gameInfo = result;
        this.notifyGameInfoListeners(result);
      }
    });

    this.isInitialized = true;
    console.log('Overwolf service initialized');
  }

  private handleMessage(message: any): void {
    switch (message.id) {
      case 'game_info_update':
        this.gameInfo = message.content;
        this.notifyGameInfoListeners(message.content);
        break;
      case 'game_events':
        this.notifyGameEventListeners(message.content);
        break;
      case 'show_champion_tips':
        // Handle show champion tips request
        window.dispatchEvent(new CustomEvent('show_champion_tips'));
        break;
    }
  }

  public isOverwolfAvailable(): boolean {
    return this.isInitialized && typeof window !== 'undefined' && !!window.overwolf;
  }

  public isGameRunning(): boolean {
    return this.gameInfo?.isRunning || false;
  }

  public getCurrentGameInfo(): OverwolfGameInfo | null {
    return this.gameInfo;
  }

  public onGameInfoUpdate(listener: (info: OverwolfGameInfo) => void): void {
    this.gameInfoListeners.push(listener);
  }

  public onGameEvents(listener: (events: GameEvent[]) => void): void {
    this.gameEventListeners.push(listener);
  }

  public removeGameInfoListener(listener: (info: OverwolfGameInfo) => void): void {
    const index = this.gameInfoListeners.indexOf(listener);
    if (index > -1) {
      this.gameInfoListeners.splice(index, 1);
    }
  }

  public removeGameEventListener(listener: (events: GameEvent[]) => void): void {
    const index = this.gameEventListeners.indexOf(listener);
    if (index > -1) {
      this.gameEventListeners.splice(index, 1);
    }
  }

  private notifyGameInfoListeners(info: OverwolfGameInfo): void {
    this.gameInfoListeners.forEach(listener => {
      try {
        listener(info);
      } catch (error) {
        console.error('Error in game info listener:', error);
      }
    });
  }

  private notifyGameEventListeners(events: GameEvent[]): void {
    this.gameEventListeners.forEach(listener => {
      try {
        listener(events);
      } catch (error) {
        console.error('Error in game event listener:', error);
      }
    });
  }

  // Mock data for development/web mode
  public getMockChampionSelectData(): ChampionSelectData {
    return {
      localPlayerCellId: 0,
      actions: [],
      timer: {
        adjustedTimeLeftInPhase: 30000,
        phase: 'PLANNING'
      },
      myTeam: [
        {
          cellId: 0,
          championId: 134, // Syndra
          summonerId: 12345,
          spell1Id: 4, // Flash
          spell2Id: 14, // Ignite
          teamId: 100
        }
      ],
      theirTeam: [
        {
          cellId: 5,
          championId: 103, // Ahri
          summonerId: 67890,
          spell1Id: 4, // Flash
          spell2Id: 14, // Ignite
          teamId: 200
        }
      ]
    };
  }

  public getMockLiveGameData(): LiveGameData {
    return {
      gameData: {
        gameMode: 'CLASSIC',
        gameTime: 300, // 5 minutes
        mapName: 'Summoner\'s Rift',
        mapNumber: 11,
        mapTerrain: 'Default'
      },
      allPlayers: [
        {
          championName: 'Syndra',
          isBot: false,
          isDead: false,
          items: [],
          level: 6,
          position: '',
          rawChampionName: 'game_character_displayname_Syndra',
          respawnTimer: 0,
          runes: {},
          scores: {
            assists: 1,
            creepScore: 45,
            deaths: 0,
            kills: 2,
            wardScore: 12
          },
          skinID: 0,
          summonerName: 'TestPlayer',
          summonerSpells: {
            summonerSpellOne: { displayName: 'Flash', rawDescription: '', rawDisplayName: 'SummonerFlash' },
            summonerSpellTwo: { displayName: 'Ignite', rawDescription: '', rawDisplayName: 'SummonerDot' }
          },
          team: 'ORDER'
        }
      ],
      activePlayer: {
        championStats: {
          abilityPower: 45,
          armor: 30,
          armorPenetrationFlat: 0,
          armorPenetrationPercent: 0,
          attackDamage: 55,
          attackRange: 550,
          attackSpeed: 0.625,
          bonusArmorPenetrationPercent: 0,
          bonusMagicPenetrationPercent: 0,
          critChance: 0,
          critDamage: 200,
          currentHealth: 580,
          healthRegenRate: 6.5,
          lifeSteal: 0,
          magicLethality: 0,
          magicPenetrationFlat: 0,
          magicPenetrationPercent: 0,
          magicResist: 30,
          maxHealth: 580,
          moveSpeed: 330,
          physicalLethality: 0,
          resourceMax: 400,
          resourceRegenRate: 8,
          resourceType: 'MANA',
          resourceValue: 350,
          spellVamp: 0,
          tenacity: 0
        },
        currentGold: 1250,
        level: 6,
        summonerName: 'TestPlayer'
      },
      events: {
        Events: [
          {
            EventID: 1,
            EventName: 'GameStart',
            EventTime: 0
          }
        ]
      }
    };
  }

  // Hotkey management
  public registerHotkey(hotkeyName: string, callback: () => void): void {
    if (!this.isOverwolfAvailable()) return;

    window.addEventListener(`hotkey_${hotkeyName}`, callback);
  }

  public unregisterHotkey(hotkeyName: string, callback: () => void): void {
    if (!this.isOverwolfAvailable()) return;

    window.removeEventListener(`hotkey_${hotkeyName}`, callback);
  }

  // Window management
  public minimizeWindow(): void {
    if (!this.isOverwolfAvailable()) return;

    window.overwolf.windows.getCurrentWindow((result: any) => {
      if (result.status === 'success') {
        window.overwolf.windows.minimize(result.window.id);
      }
    });
  }

  public closeWindow(): void {
    if (!this.isOverwolfAvailable()) return;

    window.overwolf.windows.getCurrentWindow((result: any) => {
      if (result.status === 'success') {
        window.overwolf.windows.close(result.window.id);
      }
    });
  }

  public maximizeWindow(): void {
    if (!this.isOverwolfAvailable()) return;

    window.overwolf.windows.getCurrentWindow((result: any) => {
      if (result.status === 'success') {
        window.overwolf.windows.maximize(result.window.id);
      }
    });
  }

  public restoreWindow(): void {
    if (!this.isOverwolfAvailable()) return;

    window.overwolf.windows.getCurrentWindow((result: any) => {
      if (result.status === 'success') {
        window.overwolf.windows.restore(result.window.id);
      }
    });
  }
}

export const overwolfService = new OverwolfService();
export default overwolfService;
// Mock Service for Development
// Provides sample data when League Client is not running

import { ChampionData, MatchupData } from './riotApiService';

export interface MockGameState {
  connected: boolean;
  gamePhase: 'None' | 'ChampSelect' | 'InProgress' | 'EndOfGame';
  playerRole: string;
  gameTime: number;
  championId?: number;
  championName?: string;
}

export interface MockChampSelectData {
  localPlayerCellId: number;
  myTeam: Array<{
    cellId: number;
    championId: number;
    championName: string;
    summonerId: string;
    displayName: string;
  }>;
  theirTeam: Array<{
    cellId: number;
    championId: number;
    championName: string;
  }>;
  timer: {
    phase: string;
    timeRemaining: number;
    totalTime: number;
  };
}

class MockService {
  private gameState: MockGameState = {
    connected: true,
    gamePhase: (process.env.MOCK_GAME_STATE as any) || 'ChampSelect',
    playerRole: process.env.MOCK_ROLE || 'mid',
    gameTime: 0,
    championId: 157, // Yasuo
    championName: process.env.MOCK_CHAMPION || 'Yasuo'
  };

  // Mock League connection data
  getMockLeagueData() {
    return {
      connected: this.gameState.connected,
      gamePhase: this.gameState.gamePhase,
      playerRole: this.gameState.playerRole,
      gameTime: this.gameState.gameTime
    };
  }

  // Mock LCU credentials
  getMockLCUCredentials() {
    return {
      port: parseInt(process.env.LCU_PORT || '2999'),
      password: process.env.LCU_PASSWORD || 'mock_password',
      protocol: 'https'
    };
  }

  // Mock champion select session
  getMockChampSelectSession(): MockChampSelectData {
    return {
      localPlayerCellId: 0,
      myTeam: [
        {
          cellId: 0,
          championId: 157,
          championName: 'Yasuo',
          summonerId: 'player1',
          displayName: 'You'
        },
        {
          cellId: 1,
          championId: 21,
          championName: 'MissFortune',
          summonerId: 'player2',
          displayName: 'Teammate1'
        },
        {
          cellId: 2,
          championId: 412,
          championName: 'Thresh',
          summonerId: 'player3',
          displayName: 'Teammate2'
        },
        {
          cellId: 3,
          championId: 64,
          championName: 'LeeSin',
          summonerId: 'player4',
          displayName: 'Teammate3'
        },
        {
          cellId: 4,
          championId: 86,
          championName: 'Garen',
          summonerId: 'player5',
          displayName: 'Teammate4'
        }
      ],
      theirTeam: [
        {
          cellId: 5,
          championId: 238,
          championName: 'Zed'
        },
        {
          cellId: 6,
          championId: 81,
          championName: 'Ezreal'
        },
        {
          cellId: 7,
          championId: 53,
          championName: 'Blitzcrank'
        },
        {
          cellId: 8,
          championId: 120,
          championName: 'Hecarim'
        },
        {
          cellId: 9,
          championId: 39,
          championName: 'Irelia'
        }
      ],
      timer: {
        phase: 'PLANNING',
        timeRemaining: 30000,
        totalTime: 30000
      }
    };
  }

  // Mock champion data
  getMockChampionData(): Record<string, ChampionData> {
    return {
      'Yasuo': {
        id: 'Yasuo',
        key: '157',
        name: 'Yasuo',
        title: 'the Unforgiven',
        image: { 
          full: 'Yasuo.png', 
          sprite: 'champion0.png', 
          group: 'champion', 
          x: 0, 
          y: 0, 
          w: 48, 
          h: 48 
        },
        tags: ['Fighter', 'Assassin'],
        partype: 'Wind',
        stats: {
          hp: 520, hpperlevel: 87, mp: 0, mpperlevel: 0, movespeed: 345,
          armor: 30, armorperlevel: 3.4, spellblock: 32, spellblockperlevel: 1.25,
          attackrange: 175, hpregen: 6.5, hpregenperlevel: 0.9, mpregen: 0,
          mpregenperlevel: 0, crit: 0, critperlevel: 0, attackdamage: 60,
          attackdamageperlevel: 3.2, attackspeedperlevel: 2.5, attackspeed: 0.67
        }
      },
      'Zed': {
        id: 'Zed',
        key: '238',
        name: 'Zed',
        title: 'the Master of Shadows',
        image: { 
          full: 'Zed.png', 
          sprite: 'champion3.png', 
          group: 'champion', 
          x: 48, 
          y: 96, 
          w: 48, 
          h: 48 
        },
        tags: ['Assassin'],
        partype: 'Energy',
        stats: {
          hp: 584, hpperlevel: 85, mp: 200, mpperlevel: 0, movespeed: 345,
          armor: 32, armorperlevel: 3.9, spellblock: 29, spellblockperlevel: 1.25,
          attackrange: 125, hpregen: 7, hpregenperlevel: 0.65, mpregen: 50,
          mpregenperlevel: 0, crit: 0, critperlevel: 0, attackdamage: 63,
          attackdamageperlevel: 3.4, attackspeedperlevel: 2.1, attackspeed: 0.651
        }
      },
      'MissFortune': {
        id: 'MissFortune',
        key: '21',
        name: 'Miss Fortune',
        title: 'the Bounty Hunter',
        image: { 
          full: 'MissFortune.png', 
          sprite: 'champion1.png', 
          group: 'champion', 
          x: 96, 
          y: 48, 
          w: 48, 
          h: 48 
        },
        tags: ['Marksman'],
        partype: 'Mana',
        stats: {
          hp: 570, hpperlevel: 93, mp: 325, mpperlevel: 35, movespeed: 325,
          armor: 28, armorperlevel: 3, spellblock: 30, spellblockperlevel: 0.5,
          attackrange: 550, hpregen: 3.75, hpregenperlevel: 0.65, mpregen: 8.04,
          mpregenperlevel: 0.65, crit: 0, critperlevel: 0, attackdamage: 52,
          attackdamageperlevel: 2.7, attackspeedperlevel: 3, attackspeed: 0.656
        }
      }
    };
  }

  // Mock matchup advice
  getMockMatchupAdvice(): MatchupData {
    return {
      championId: 157,
      enemyChampionId: 238,
      lane: 'mid',
      advantage: 'unfavorable',
      tips: [
        'Respect Zed\'s level 6 all-in potential',
        'Use Wind Wall to block his Q poke',
        'Consider rushing Plated Steelcaps',
        'Play safe until you get items',
        'Ward both sides of the lane',
        'Don\'t dash into his shadow combo'
      ],
      counters: ['Zhonya\'s Hourglass', 'Plated Steelcaps', 'Exhaust'],
      itemBuilds: ['Immortal Shieldbow', 'Infinity Edge', 'Phantom Dancer', 'Bloodthirster']
    };
  }

  // Mock replay analysis
  getMockReplayAnalysis() {
    return {
      success: true,
      analysisId: Date.now(),
      insights: [
        'Excellent CS at 10 minutes (85/91)',
        'Consider more vision control in river',
        'Good aggressive plays in lane',
        'Work on teamfight positioning',
        'Strong laning phase overall'
      ],
      stats: {
        kda: '8/3/5',
        cs: 245,
        gameTime: '28:45',
        role: 'mid',
        champion: 'Yasuo'
      }
    };
  }

  // Toggle game state for testing
  setGamePhase(phase: MockGameState['gamePhase']) {
    this.gameState.gamePhase = phase;
  }

  // Simulate game time progression
  startGameTimer() {
    if (this.gameState.gamePhase === 'InProgress') {
      setInterval(() => {
        this.gameState.gameTime += 1;
      }, 1000);
    }
  }
}

export const mockService = new MockService();
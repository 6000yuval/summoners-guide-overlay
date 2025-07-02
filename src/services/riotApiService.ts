// Riot Games API Service
// This service handles connection to Riot's public API for additional data

export interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  partype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
}

export interface MatchupData {
  championId: number;
  enemyChampionId: number;
  lane: string;
  advantage: 'favorable' | 'neutral' | 'unfavorable';
  tips: string[];
  counters: string[];
  itemBuilds: string[];
}

class RiotApiService {
  private baseUrl = 'https://ddragon.leagueoflegends.com/cdn';
  private version = '13.24.1';
  
  // Cache for champion data
  private championCache: Map<string, ChampionData> = new Map();
  private allChampions: Record<string, ChampionData> | null = null;

  async getLatestVersion(): Promise<string> {
    try {
      const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      const versions = await response.json();
      this.version = versions[0];
      return this.version;
    } catch (error) {
      console.error('Failed to get latest version:', error);
      return this.version;
    }
  }

  async getAllChampions(): Promise<Record<string, ChampionData>> {
    if (this.allChampions) {
      return this.allChampions;
    }

    try {
      await this.getLatestVersion();
      const response = await fetch(
        `${this.baseUrl}/${this.version}/data/en_US/champion.json`
      );
      const data = await response.json();
      this.allChampions = data.data;
      return this.allChampions;
    } catch (error) {
      console.error('Failed to fetch champion data:', error);
      // Return fallback data
      return {
        'Yasuo': {
          id: 'Yasuo',
          key: '157',
          name: 'Yasuo',
          title: 'the Unforgiven',
          image: { full: 'Yasuo.png', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 },
          tags: ['Fighter', 'Assassin'],
          partype: 'Wind',
          stats: {
            hp: 520, hpperlevel: 87, mp: 0, mpperlevel: 0, movespeed: 345,
            armor: 30, armorperlevel: 3.4, spellblock: 32, spellblockperlevel: 1.25,
            attackrange: 175, hpregen: 6.5, hpregenperlevel: 0.9, mpregen: 0,
            mpregenperlevel: 0, crit: 0, critperlevel: 0, attackdamage: 60,
            attackdamageperlevel: 3.2, attackspeedperlevel: 2.5, attackspeed: 0.67
          }
        }
      };
    }
  }

  async getChampionById(championId: number): Promise<ChampionData | null> {
    const champions = await this.getAllChampions();
    
    for (const champion of Object.values(champions)) {
      if (parseInt(champion.key) === championId) {
        return champion;
      }
    }
    
    return null;
  }

  async getChampionByName(name: string): Promise<ChampionData | null> {
    const champions = await this.getAllChampions();
    return champions[name] || null;
  }

  getChampionImageUrl(championName: string): string {
    return `${this.baseUrl}/${this.version}/img/champion/${championName}.png`;
  }

  // Mock matchup data - in a real app this would come from a database or API
  getMatchupAdvice(playerChampionId: number, enemyChampionId: number, lane: string): MatchupData {
    // Simple matchup logic - in reality this would be much more complex
    const matchups = {
      // Yasuo (157) matchups
      157: {
        238: { // vs Zed
          advantage: 'unfavorable' as const,
          tips: [
            'Respect Zed\'s level 6 all-in potential',
            'Use Wind Wall to block his Q poke',
            'Consider rushing Plated Steelcaps',
            'Play safe until you get items'
          ]
        },
        91: { // vs Talon
          advantage: 'neutral' as const,
          tips: [
            'Watch for roam potential',
            'Wind Wall his W return',
            'Consider early armor'
          ]
        }
      },
      // Add more matchups as needed
    };

    const playerMatchups = matchups[playerChampionId as keyof typeof matchups];
    const specificMatchup = playerMatchups?.[enemyChampionId as keyof typeof playerMatchups];

    return {
      championId: playerChampionId,
      enemyChampionId,
      lane,
      advantage: specificMatchup?.advantage || 'neutral',
      tips: specificMatchup?.tips || ['Play safe and farm', 'Ward river bushes', 'Look for roam opportunities'],
      counters: ['Item counters vary by matchup'],
      itemBuilds: ['Immortal Shieldbow', 'Infinity Edge', 'Phantom Dancer']
    };
  }

  // Get pro player builds for a champion
  async getProBuilds(championName: string): Promise<any> {
    // This would typically call a service like U.GG or OP.GG API
    // For now, return mock data
    return {
      mostCommonBuild: ['Immortal Shieldbow', 'Infinity Edge', 'Phantom Dancer'],
      winRate: 52.3,
      pickRate: 8.7,
      banRate: 45.2,
      runes: {
        primary: 'Precision',
        secondary: 'Resolve',
        keystone: 'Conqueror'
      }
    };
  }
}

export const riotApiService = new RiotApiService();
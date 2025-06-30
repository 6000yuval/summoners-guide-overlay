
// Replay Analysis Service
// This service handles automatic replay file detection, parsing, and analysis

interface ReplayData {
  gameId: string;
  gameDuration: number;
  participants: Array<{
    championName: string;
    position: string;
    kills: number;
    deaths: number;
    assists: number;
    totalMinionsKilled: number;
    visionScore: number;
  }>;
  timeline: Array<{
    timestamp: number;
    type: 'CHAMPION_KILL' | 'BUILDING_KILL' | 'MONSTER_KILL' | 'WARD_PLACED';
    data: any;
  }>;
}

interface AnalysisResult {
  gameInfo: {
    duration: string;
    role: string;
    champion: string;
    result: 'Victory' | 'Defeat';
    kda: string;
  };
  topMistakes: Array<{
    time: string;
    type: string;
    description: string;
    severity: 'critical' | 'high' | 'medium';
    improvement: string;
  }>;
  metrics: {
    csPerMin: number;
    benchmarkCs: number;
    visionScore: number;
    benchmarkVision: number;
    earlyDeaths: number;
    objectiveParticipation: number;
  };
  drill: {
    title: string;
    description: string;
    steps: string[];
  };
}

class ReplayService {
  private replayDirectory: string;

  constructor() {
    // In real Electron app, this would be dynamic based on OS
    // Windows: C:\Users\<user>\Documents\League of Legends\Replays\
    // macOS: ~/Documents/League of Legends/Replays/
    this.replayDirectory = '';
  }

  async findLatestReplay(): Promise<string | null> {
    try {
      // In real Electron app, would use Node.js fs module:
      // const files = await fs.readdir(this.replayDirectory);
      // const roflFiles = files.filter(f => f.endsWith('.rofl'));
      // return roflFiles.sort((a, b) => b.localeCompare(a))[0];
      
      // Mock for demo
      console.log('Searching for latest replay file...');
      return 'NA1_4234567890.rofl';
    } catch (error) {
      console.error('Failed to find replay files:', error);
      return null;
    }
  }

  async parseReplay(filePath: string): Promise<ReplayData | null> {
    try {
      // In real app, would use rofl-parser or similar library
      console.log(`Parsing replay file: ${filePath}`);
      
      // Mock parsed data
      return {
        gameId: '4234567890',
        gameDuration: 1472, // 24:32 in seconds
        participants: [
          {
            championName: 'Yasuo',
            position: 'MIDDLE',
            kills: 7,
            deaths: 3,
            assists: 12,
            totalMinionsKilled: 152,
            visionScore: 18
          }
        ],
        timeline: [
          {
            timestamp: 225000, // 3:45
            type: 'CHAMPION_KILL',
            data: { victimName: 'Yasuo', killerName: 'Graves' }
          },
          {
            timestamp: 492000, // 8:12
            type: 'CHAMPION_KILL',
            data: { victimName: 'Yasuo', killerName: 'Zed' }
          }
        ]
      };
    } catch (error) {
      console.error('Failed to parse replay:', error);
      return null;
    }
  }

  analyzeReplay(replayData: ReplayData): AnalysisResult {
    const player = replayData.participants[0]; // Assume first participant is the player
    const gameDurationMinutes = replayData.gameDuration / 60;
    
    // Calculate metrics
    const csPerMin = player.totalMinionsKilled / gameDurationMinutes;
    const benchmarkCs = this.getCSBenchmark(player.position);
    const benchmarkVision = this.getVisionBenchmark(player.position);
    
    // Analyze timeline for mistakes
    const deaths = replayData.timeline.filter(event => 
      event.type === 'CHAMPION_KILL' && 
      event.data.victimName === player.championName
    );
    
    const earlyDeaths = deaths.filter(death => death.timestamp < 600000).length; // First 10 minutes
    
    // Generate mistakes
    const mistakes = this.generateMistakes(deaths, csPerMin, benchmarkCs, player.visionScore, benchmarkVision);
    
    // Generate drill recommendation
    const drill = this.generateDrill(mistakes[0]);

    return {
      gameInfo: {
        duration: this.formatDuration(replayData.gameDuration),
        role: this.formatRole(player.position),
        champion: player.championName,
        result: player.kills + player.assists > player.deaths ? 'Victory' : 'Defeat',
        kda: `${player.kills}/${player.deaths}/${player.assists}`
      },
      topMistakes: mistakes.slice(0, 3),
      metrics: {
        csPerMin: Math.round(csPerMin * 10) / 10,
        benchmarkCs: benchmarkCs,
        visionScore: player.visionScore,
        benchmarkVision: benchmarkVision,
        earlyDeaths: earlyDeaths,
        objectiveParticipation: 65 // Mock value
      },
      drill
    };
  }

  private getCSBenchmark(position: string): number {
    const benchmarks = {
      'MIDDLE': 7.8,
      'TOP': 7.5,
      'BOTTOM': 8.0,
      'JUNGLE': 5.5,
      'UTILITY': 2.0
    };
    return benchmarks[position as keyof typeof benchmarks] || 7.0;
  }

  private getVisionBenchmark(position: string): number {
    const benchmarks = {
      'UTILITY': 45,
      'JUNGLE': 35,
      'MIDDLE': 25,
      'TOP': 20,
      'BOTTOM': 15
    };
    return benchmarks[position as keyof typeof benchmarks] || 25;
  }

  private generateMistakes(deaths: any[], csPerMin: number, benchmarkCs: number, visionScore: number, benchmarkVision: number) {
    const mistakes = [];
    
    // Early death analysis
    const earlyDeaths = deaths.filter(d => d.timestamp < 600000);
    if (earlyDeaths.length > 0) {
      mistakes.push({
        time: this.formatTimestamp(earlyDeaths[0].timestamp),
        type: 'Death to Gank',
        description: 'Died to jungle gank without vision',
        severity: 'critical' as const,
        improvement: 'Ward river brush at 3:00 when enemy jungler completes first clear'
      });
    }
    
    // CS analysis
    if (csPerMin < benchmarkCs) {
      mistakes.push({
        time: '8:12',
        type: 'CS Deficit',
        description: `${Math.round((benchmarkCs - csPerMin) * 8)} CS behind expected benchmark`,
        severity: 'high' as const,
        improvement: 'Focus on last-hitting under tower, use abilities more efficiently'
      });
    }
    
    // Vision analysis
    if (visionScore < benchmarkVision) {
      mistakes.push({
        time: '15:30',
        type: 'Poor Vision Control',
        description: 'Vision score below average for role',
        severity: 'medium' as const,
        improvement: 'Place more control wards and sweep enemy vision regularly'
      });
    }
    
    return mistakes;
  }

  private generateDrill(topMistake: any) {
    if (topMistake?.type === 'Death to Gank') {
      return {
        title: 'Early Game Warding Drill',
        description: 'Practice placing defensive wards at 2:45-3:00 game time',
        steps: [
          'Load into Practice Tool',
          'Set timer for 2:45',
          'Practice ward placements in river/tri-brush',
          'Repeat 10 times for muscle memory'
        ]
      };
    }
    
    return {
      title: 'CS Training Drill',
      description: 'Improve last-hitting consistency',
      steps: [
        'Load Practice Tool with your main champion',
        'Focus on last-hitting for 10 minutes',
        'Aim for 80+ CS by 10 minutes',
        'Practice under tower scenarios'
      ]
    };
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private formatRole(position: string): string {
    const roleMap = {
      'MIDDLE': 'Mid Lane',
      'TOP': 'Top Lane',
      'BOTTOM': 'Bot Lane',
      'JUNGLE': 'Jungle',
      'UTILITY': 'Support'
    };
    return roleMap[position as keyof typeof roleMap] || position;
  }

  private formatTimestamp(timestamp: number): string {
    const totalSeconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async autoAnalyzeLatestReplay(): Promise<AnalysisResult | null> {
    try {
      const latestReplay = await this.findLatestReplay();
      if (!latestReplay) return null;
      
      const replayData = await this.parseReplay(latestReplay);
      if (!replayData) return null;
      
      return this.analyzeReplay(replayData);
    } catch (error) {
      console.error('Auto analysis failed:', error);
      return null;
    }
  }
}

export const replayService = new ReplayService();
export type { ReplayData, AnalysisResult };


import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Sword, Eye } from 'lucide-react';

interface Champion {
  name: string;
  role: string;
  earlyGameStrength: 'weak' | 'medium' | 'strong';
  counters: string[];
  counteredBy: string[];
}

interface ChampionDetectorProps {
  onDetection: (data: {
    playerChampion: Champion;
    enemyChampion: Champion;
    lane: string;
    matchupAdvantage: 'favorable' | 'neutral' | 'unfavorable';
  }) => void;
}

const ChampionDetector = ({ onDetection }: ChampionDetectorProps) => {
  const [detected, setDetected] = useState(false);
  
  // Mock champion database - in a real app, this would be more comprehensive
  const champions: Champion[] = [
    {
      name: 'Darius',
      role: 'top',
      earlyGameStrength: 'strong',
      counters: ['Teemo', 'Vayne', 'Quinn'],
      counteredBy: ['Gnar', 'Kennen', 'Jayce']
    },
    {
      name: 'Teemo',
      role: 'top',
      earlyGameStrength: 'medium',
      counters: ['Darius', 'Garen', 'Nasus'],
      counteredBy: ['Irelia', 'Yasuo', 'Pantheon']
    },
    {
      name: 'Yasuo',
      role: 'mid',
      earlyGameStrength: 'medium',
      counters: ['Malzahar', 'Annie', 'Pantheon'],
      counteredBy: ['Zed', 'Fizz', 'Kassadin']
    },
    {
      name: 'Zed',
      role: 'mid',
      earlyGameStrength: 'strong',
      counters: ['Yasuo', 'Katarina', 'Akali'],
      counteredBy: ['Malzahar', 'Lissandra', 'Kayle']
    },
    {
      name: 'Jinx',
      role: 'adc',
      earlyGameStrength: 'weak',
      counters: ['Kog\'Maw', 'Twitch'],
      counteredBy: ['Draven', 'Lucian', 'Caitlyn']
    },
    {
      name: 'Draven',
      role: 'adc',
      earlyGameStrength: 'strong',
      counters: ['Jinx', 'Vayne', 'Kai\'Sa'],
      counteredBy: ['Caitlyn', 'Ezreal']
    }
  ];

  useEffect(() => {
    // Simulate automatic detection after 3 seconds
    const timer = setTimeout(() => {
      // Mock detection - in a real app, this would use game API or screen detection
      const playerChampion = champions[Math.floor(Math.random() * champions.length)];
      const possibleEnemies = champions.filter(c => c.role === playerChampion.role && c.name !== playerChampion.name);
      const enemyChampion = possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];
      
      let matchupAdvantage: 'favorable' | 'neutral' | 'unfavorable' = 'neutral';
      
      if (playerChampion.counters.includes(enemyChampion.name)) {
        matchupAdvantage = 'favorable';
      } else if (playerChampion.counteredBy.includes(enemyChampion.name)) {
        matchupAdvantage = 'unfavorable';
      }

      const detectionData = {
        playerChampion,
        enemyChampion,
        lane: playerChampion.role,
        matchupAdvantage
      };

      setDetected(true);
      onDetection(detectionData);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDetection]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Champion Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!detected ? (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
            <span>Detecting champions...</span>
          </div>
        ) : (
          <div className="text-green-400 text-sm">
            ✓ Champions detected successfully
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChampionDetector;

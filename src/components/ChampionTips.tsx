
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Target, Crown, Eye } from 'lucide-react';

interface Champion {
  id: number;
  name: string;
  role: string;
  tips: string[];
  counters: string[];
  counteredBy: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const ChampionTips = () => {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [enemyChampion, setEnemyChampion] = useState<Champion | null>(null);

  // Mock champion data - in real app would come from LCU
  const mockChampions: Champion[] = [
    {
      id: 157,
      name: 'Yasuo',
      role: 'mid',
      tips: [
        'Use E to dash through minions for mobility',
        'Build up tornado (Q) before engaging',
        'Use W to block enemy projectiles',
        'R can be used on any airborne enemy'
      ],
      counters: ['Zed', 'Fizz', 'Kassadin'],
      counteredBy: ['Malzahar', 'Annie', 'Pantheon'],
      difficulty: 'Hard'
    },
    {
      id: 238,
      name: 'Zed',
      role: 'mid',
      tips: [
        'Use W shadow for escape routes',
        'R behind enemy to avoid skillshots',
        'E slows enemies hit by shadows',
        'Combo: W-E-Q for poke'
      ],
      counters: ['Yasuo', 'Fizz', 'Talon'],
      counteredBy: ['Malzahar', 'Kayle', 'Lissandra'],
      difficulty: 'Hard'
    }
  ];

  useEffect(() => {
    // Simulate champion selection
    setSelectedChampion(mockChampions[0]); // Yasuo
    setEnemyChampion(mockChampions[1]); // Zed
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'top': return Shield;
      case 'jungle': return Target;
      case 'mid': return Crown;
      case 'adc': return Sword;
      case 'support': return Eye;
      default: return Crown;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Hard': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  if (!selectedChampion) {
    return (
      <div className="fixed top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 text-white text-sm">
        Select your champion...
      </div>
    );
  }

  const RoleIcon = getRoleIcon(selectedChampion.role);

  return (
    <div className="fixed top-4 left-4 z-50 space-y-3 max-w-sm">
      {/* Your Champion */}
      <Card className="bg-slate-900/95 border-blue-600 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <RoleIcon className="h-5 w-5 text-blue-400" />
            {selectedChampion.name}
            <Badge className={`${getDifficultyColor(selectedChampion.difficulty)} text-white`}>
              {selectedChampion.difficulty}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="text-blue-300 font-semibold text-sm mb-2">Champion Tips</h4>
            <div className="space-y-1">
              {selectedChampion.tips.map((tip, index) => (
                <div key={index} className="text-slate-300 text-xs flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matchup Analysis */}
      {enemyChampion && (
        <Card className="bg-slate-900/95 border-red-600 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Sword className="h-5 w-5 text-red-400" />
              vs {enemyChampion.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="text-red-300 font-semibold text-sm mb-2">Matchup Tips</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-green-400 text-xs font-medium">You counter: </span>
                  <span className="text-slate-300 text-xs">
                    {selectedChampion.counters.includes(enemyChampion.name) ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-red-400 text-xs font-medium">They counter you: </span>
                  <span className="text-slate-300 text-xs">
                    {selectedChampion.counteredBy.includes(enemyChampion.name) ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reminder */}
      <div className="bg-purple-900/95 border border-purple-600 rounded-lg p-2 shadow-xl backdrop-blur-sm">
        <p className="text-purple-200 text-xs text-center">
          Press Alt+A to toggle this overlay
        </p>
      </div>
    </div>
  );
};

export default ChampionTips;

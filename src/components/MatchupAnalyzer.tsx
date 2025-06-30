
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Sword, TrendingUp, TrendingDown } from 'lucide-react';

interface Champion {
  name: string;
  role: string;
  earlyGameStrength: 'weak' | 'medium' | 'strong';
  counters: string[];
  counteredBy: string[];
}

interface MatchupAnalyzerProps {
  playerChampion: Champion;
  enemyChampion: Champion;
  matchupAdvantage: 'favorable' | 'neutral' | 'unfavorable';
}

const MatchupAnalyzer = ({ playerChampion, enemyChampion, matchupAdvantage }: MatchupAnalyzerProps) => {
  const getAdvantageColor = () => {
    switch (matchupAdvantage) {
      case 'favorable': return 'bg-green-600';
      case 'unfavorable': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const getAdvantageIcon = () => {
    switch (matchupAdvantage) {
      case 'favorable': return <TrendingUp className="h-4 w-4" />;
      case 'unfavorable': return <TrendingDown className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'weak': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getPlaystyleRecommendation = () => {
    if (matchupAdvantage === 'unfavorable') {
      return {
        style: 'Defensive',
        tips: [
          'Play safe and farm under tower',
          'Ward bushes to avoid ganks',
          'Wait for jungle assistance',
          'Focus on scaling for mid-late game'
        ],
        urgency: 'high'
      };
    } else if (matchupAdvantage === 'favorable') {
      return {
        style: 'Aggressive',
        tips: [
          'Look for early trading opportunities',
          'Establish lane dominance',
          'Push for level advantages',
          'Consider early all-ins'
        ],
        urgency: 'medium'
      };
    } else {
      return {
        style: 'Balanced',
        tips: [
          'Trade when enemy abilities are on cooldown',
          'Focus on CS and positioning',
          'Look for jungle opportunities',
          'Scale evenly through laning phase'
        ],
        urgency: 'low'
      };
    }
  };

  const recommendation = getPlaystyleRecommendation();

  return (
    <div className="space-y-4">
      {/* Matchup Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sword className="h-5 w-5" />
            Matchup Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-white font-semibold">{playerChampion.name}</p>
                <p className="text-slate-400 text-sm">(You)</p>
              </div>
              <span className="text-slate-400">vs</span>
              <div className="text-center">
                <p className="text-white font-semibold">{enemyChampion.name}</p>
                <p className="text-slate-400 text-sm">(Enemy)</p>
              </div>
            </div>
            <Badge className={`${getAdvantageColor()} text-white flex items-center gap-1`}>
              {getAdvantageIcon()}
              {matchupAdvantage}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-sm">Your Early Game</p>
              <p className={`font-semibold ${getStrengthColor(playerChampion.earlyGameStrength)}`}>
                {playerChampion.earlyGameStrength.toUpperCase()}
              </p>
            </div>
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-sm">Enemy Early Game</p>
              <p className={`font-semibold ${getStrengthColor(enemyChampion.earlyGameStrength)}`}>
                {enemyChampion.earlyGameStrength.toUpperCase()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playstyle Recommendation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {recommendation.urgency === 'high' ? (
              <AlertTriangle className="h-5 w-5 text-red-400" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            Recommended Playstyle: {recommendation.style}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recommendation.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchupAnalyzer;


import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChampionDetector from '@/components/ChampionDetector';
import MatchupAnalyzer from '@/components/MatchupAnalyzer';
import GameSenseEngine from '@/components/GameSenseEngine';
import GameOverlay from '@/components/GameOverlay';
import ReplayAnalysis from '@/components/ReplayAnalysis';
import NotificationSettings from '@/components/NotificationSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Settings, Target, Eye, BarChart3 } from 'lucide-react';

interface Champion {
  name: string;
  role: string;
  earlyGameStrength: 'weak' | 'medium' | 'strong';
  counters: string[];
  counteredBy: string[];
}

interface MatchupData {
  playerChampion: Champion;
  enemyChampion: Champion;
  lane: string;
  matchupAdvantage: 'favorable' | 'neutral' | 'unfavorable';
}

const Dashboard = () => {
  const [gameActive, setGameActive] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [matchupData, setMatchupData] = useState<MatchupData | undefined>();
  const [notifications, setNotifications] = useState<any[]>([]);

  // Game timer simulation - in real app this would sync with LCU API
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameActive]);

  const handleChampionDetection = (data: MatchupData) => {
    setMatchupData(data);
    setGameActive(true);
    setGameTime(0);
  };

  const handleGameSenseNotification = (notification: { message: string; urgency: 'red' | 'orange' | 'yellow' | 'green' }) => {
    // Pass notification to overlay
  };

  const handleOverlayNotification = (notification: any) => {
    setNotifications(prev => [...prev.slice(-4), notification]); // Keep last 5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Game Overlay - Always visible when game is active */}
      {gameActive && matchupData && (
        <GameOverlay
          role={matchupData.lane}
          gameTime={gameTime}
          onNotification={handleOverlayNotification}
        />
      )}

      {/* Game Sense Engine - Hidden component that manages notifications */}
      {gameActive && matchupData && (
        <GameSenseEngine
          role={matchupData.lane}
          gameTime={gameTime}
          active={gameActive}
          matchupData={matchupData}
          onNotification={handleGameSenseNotification}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">League Coach Pro</h1>
              <p className="text-slate-400">Real-time coaching for League of Legends</p>
            </div>
            <div className="flex items-center gap-4">
              {gameActive && (
                <Badge className="bg-green-600 text-white px-4 py-2">
                  LIVE - {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
                </Badge>
              )}
              <Badge variant="outline" className="text-slate-400">
                Not endorsed by Riot Games
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Live Game
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Replay Analysis
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Live Game Tab */}
          <TabsContent value="live" className="space-y-6">
            {!gameActive ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChampionDetector onDetection={handleChampionDetection} />
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Game Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-slate-400 mb-4">
                        <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Waiting for Game</h3>
                      <p className="text-slate-400 text-sm">
                        Start a League of Legends match to begin receiving coaching
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {matchupData && (
                  <MatchupAnalyzer
                    playerChampion={matchupData.playerChampion}
                    enemyChampion={matchupData.enemyChampion}
                    matchupAdvantage={matchupData.matchupAdvantage}
                  />
                )}
                
                {/* Recent Notifications */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-sm">No notifications yet...</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.slice(-3).map((notif, index) => (
                          <div key={index} className="p-2 bg-slate-700/50 rounded text-sm text-slate-300">
                            {notif.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Replay Analysis Tab */}
          <TabsContent value="analysis">
            <ReplayAnalysis />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <NotificationSettings />
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">About League Coach Pro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-white font-semibold mb-2">Features</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Real-time champion detection and matchup analysis</li>
                    <li>• Role-specific coaching notifications</li>
                    <li>• Automatic replay analysis</li>
                    <li>• Jungle tracking and gank warnings</li>
                    <li>• Objective timing reminders</li>
                    <li>• Post-game performance insights</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">Technical Requirements</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Windows 10 64-bit or higher</li>
                    <li>• Intel i3 processor or equivalent</li>
                    <li>• 4 GB RAM minimum</li>
                    <li>• 16 GB free disk space</li>
                    <li>• League of Legends installed</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-600">
                  <p className="text-xs text-slate-400">
                    League Coach Pro is not endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

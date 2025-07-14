
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
import { Button } from '@/components/ui/button';
import { useOverwolfIntegration } from '@/hooks/useOverwolfIntegration';
import { 
  Play, 
  Settings, 
  Target, 
  Eye, 
  BarChart3, 
  Gamepad2,
  Minimize2,
  X,
  Maximize2
} from 'lucide-react';

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
  
  const { 
    connected, 
    gameRunning, 
    gamePhase, 
    isOverwolfAvailable,
    minimizeWindow,
    closeWindow,
    maximizeWindow
  } = useOverwolfIntegration();

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
    <div className="min-h-screen bg-background">
      {/* Title Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">League Coach Pro</h1>
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "Connected" : "Disconnected"}
          </Badge>
          {gameRunning && (
            <Badge variant="outline">
              {gamePhase}
            </Badge>
          )}
        </div>
        
        {isOverwolfAvailable && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={minimizeWindow}>
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={maximizeWindow}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeWindow}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

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
        {/* Overwolf Status */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Overwolf Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {connected ? "✓" : "○"}
                  </div>
                  <div className="text-sm text-muted-foreground">Connection</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {gameRunning ? "✓" : "○"}
                  </div>
                  <div className="text-sm text-muted-foreground">Game Running</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {gamePhase}
                  </div>
                  <div className="text-sm text-muted-foreground">Phase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {isOverwolfAvailable ? "Overwolf" : "Web"}
                  </div>
                  <div className="text-sm text-muted-foreground">Platform</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Game Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-4">
                        <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      </div>
                      <h3 className="font-semibold mb-2">Waiting for Game</h3>
                      <p className="text-muted-foreground text-sm">
                        {isOverwolfAvailable 
                          ? "Start League of Legends to begin receiving coaching"
                          : "Running in web mode - full features available in Overwolf"
                        }
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
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notifications.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No notifications yet...</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.slice(-3).map((notif, index) => (
                          <div key={index} className="p-2 bg-muted rounded text-sm">
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
            <Card>
              <CardHeader>
                <CardTitle>About League Coach Pro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Real-time champion detection and matchup analysis</li>
                    <li>• Role-specific coaching notifications</li>
                    <li>• Automatic replay analysis</li>
                    <li>• Jungle tracking and gank warnings</li>
                    <li>• Objective timing reminders</li>
                    <li>• Post-game performance insights</li>
                    <li>• Native Overwolf integration</li>
                    <li>• Customizable overlay system</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Technical Requirements</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Windows 10 64-bit or higher</li>
                    <li>• Overwolf platform installed</li>
                    <li>• League of Legends installed</li>
                    <li>• 4 GB RAM minimum</li>
                    <li>• 1 GB free disk space</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Overwolf Benefits</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Native game integration and events</li>
                    <li>• Automatic updates through Overwolf store</li>
                    <li>• Secure and trusted platform</li>
                    <li>• Optimized for gaming performance</li>
                    <li>• Built-in overlay management</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
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

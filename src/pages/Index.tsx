
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Play, Settings, Target, TrendingUp, Shield, Sword, Crown, Eye } from 'lucide-react';
import GameOverlay from '@/components/GameOverlay';
import ReplayAnalysis from '@/components/ReplayAnalysis';
import NotificationSettings from '@/components/NotificationSettings';
import GameSenseEngine from '@/components/GameSenseEngine';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [overlayActive, setOverlayActive] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const roles = [
    { id: 'top', name: 'Top Lane', icon: Shield, color: 'bg-blue-600' },
    { id: 'jungle', name: 'Jungle', icon: Target, color: 'bg-green-600' },
    { id: 'mid', name: 'Mid Lane', icon: Crown, color: 'bg-purple-600' },
    { id: 'adc', name: 'ADC', icon: Sword, color: 'bg-red-600' },
    { id: 'support', name: 'Support', icon: Eye, color: 'bg-yellow-600' }
  ];

  const stats = [
    { label: 'Games Analyzed', value: '47', change: '+12' },
    { label: 'Avg. Improvement', value: '+23%', change: '+5%' },
    { label: 'Ganks Prevented', value: '89', change: '+34' },
    { label: 'Objectives Secured', value: '156', change: '+67' }
  ];

  useEffect(() => {
    if (overlayActive) {
      const interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [overlayActive]);

  const startOverlay = () => {
    if (!selectedRole) {
      alert('Please select your role first!');
      return;
    }
    setOverlayActive(true);
    setGameTime(0);
  };

  const stopOverlay = () => {
    setOverlayActive(false);
    setGameTime(0);
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            League Coach Pro
          </h1>
          <p className="text-blue-200 text-lg">
            Master challenger-level game sense with real-time coaching
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Control Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overlay" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="overlay" className="data-[state=active]:bg-blue-600">
                  Live Overlay
                </TabsTrigger>
                <TabsTrigger value="replay" className="data-[state=active]:bg-blue-600">
                  Replay Analysis
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overlay" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Role Selection & Live Overlay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Role Selection */}
                    <div>
                      <h3 className="text-white mb-3 font-semibold">Select Your Role</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {roles.map((role) => {
                          const IconComponent = role.icon;
                          return (
                            <Button
                              key={role.id}
                              variant={selectedRole === role.id ? "default" : "outline"}
                              className={`h-20 flex-col gap-2 ${
                                selectedRole === role.id 
                                  ? `${role.color} hover:${role.color}/80` 
                                  : 'border-slate-600 hover:bg-slate-700'
                              }`}
                              onClick={() => setSelectedRole(role.id)}
                            >
                              <IconComponent className="h-6 w-6" />
                              <span className="text-xs">{role.name}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Overlay Control */}
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Live Overlay Status</h4>
                        <p className="text-slate-400 text-sm">
                          {overlayActive ? `Active - Game Time: ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}` : 'Inactive'}
                        </p>
                      </div>
                      <Button
                        onClick={overlayActive ? stopOverlay : startOverlay}
                        className={overlayActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                      >
                        {overlayActive ? 'Stop Overlay' : 'Start Overlay'}
                      </Button>
                    </div>

                    {/* Game Progress */}
                    {overlayActive && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Game Progress</span>
                          <span className="text-white">{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <Progress value={(gameTime / 1800) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="replay">
                <ReplayAnalysis />
              </TabsContent>

              <TabsContent value="settings">
                <NotificationSettings />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Recent Notifications */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-slate-400 text-sm">No recent notifications</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(-5).map((notif, index) => (
                      <div key={index} className={`p-2 rounded text-sm ${
                        notif.urgency === 'red' ? 'bg-red-900/30 text-red-300' :
                        notif.urgency === 'orange' ? 'bg-orange-900/30 text-orange-300' :
                        notif.urgency === 'yellow' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-green-900/30 text-green-300'
                      }`}>
                        {notif.message}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300">Check minimap every 3-5 seconds</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300">Ward before enemy jungler's first clear</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300">Track enemy summoner spells cooldowns</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300">Ping missing enemies immediately</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Overlay Component */}
        {overlayActive && (
          <GameOverlay
            role={selectedRole}
            gameTime={gameTime}
            onNotification={(notification) => {
              setNotifications(prev => [...prev, { ...notification, timestamp: Date.now() }]);
            }}
          />
        )}

        {/* Game Sense Engine */}
        <GameSenseEngine
          role={selectedRole}
          gameTime={gameTime}
          active={overlayActive}
          onNotification={(notification) => {
            setNotifications(prev => [...prev, { ...notification, timestamp: Date.now() }]);
          }}
        />
      </div>
    </div>
  );
};

export default Index;

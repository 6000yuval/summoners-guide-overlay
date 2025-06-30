
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Volume2, Clock, Target, Bell } from 'lucide-react';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    frequency: [2], // notifications per minute
    enabledCategories: {
      jungleTracking: true,
      warding: true,
      objectives: true,
      trading: false,
      roaming: true,
      minimap: true
    },
    urgencyFilters: {
      red: true,
      orange: true,
      yellow: true,
      green: false
    },
    soundEnabled: true,
    overlayOpacity: [85]
  });

  const categories = [
    {
      id: 'jungleTracking',
      name: 'Jungle Tracking',
      description: 'Early gank warnings and jungle position alerts',
      icon: Target,
      color: 'bg-red-600'
    },
    {
      id: 'warding',
      name: 'Vision Control',
      description: 'Ward placement reminders and vision timing',
      icon: Clock,
      color: 'bg-orange-600'
    },
    {
      id: 'objectives',
      name: 'Objectives',
      description: 'Dragon, Herald, and Baron timing alerts',
      icon: Bell,
      color: 'bg-purple-600'
    },
    {
      id: 'trading',
      name: 'Trading Windows',
      description: 'Optimal trading opportunity notifications',
      icon: Target,
      color: 'bg-blue-600'
    },
    {
      id: 'roaming',
      name: 'Roaming Alerts',
      description: 'Enemy missing and rotation warnings',
      icon: Bell,
      color: 'bg-green-600'
    },
    {
      id: 'minimap',
      name: 'Minimap Reminders',
      description: 'Regular minimap checking reminders',
      icon: Clock,
      color: 'bg-yellow-600'
    }
  ];

  const urgencyLevels = [
    { id: 'red', name: 'Critical', description: 'Immediate threats', color: 'bg-red-600' },
    { id: 'orange', name: 'High Priority', description: 'Important events', color: 'bg-orange-600' },
    { id: 'yellow', name: 'Medium Priority', description: 'Helpful reminders', color: 'bg-yellow-600' },
    { id: 'green', name: 'Low Priority', description: 'Optional tips', color: 'bg-green-600' }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSettings(prev => ({
      ...prev,
      enabledCategories: {
        ...prev.enabledCategories,
        [categoryId]: !prev.enabledCategories[categoryId as keyof typeof prev.enabledCategories]
      }
    }));
  };

  const handleUrgencyToggle = (urgencyId: string) => {
    setSettings(prev => ({
      ...prev,
      urgencyFilters: {
        ...prev.urgencyFilters,
        [urgencyId]: !prev.urgencyFilters[urgencyId as keyof typeof prev.urgencyFilters]
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Frequency Control */}
          <div>
            <h3 className="text-white font-semibold mb-3">Notification Frequency</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Notifications per minute</span>
                <Badge variant="outline">{settings.frequency[0]}</Badge>
              </div>
              <Slider
                value={settings.frequency}
                onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-slate-400 text-sm">
                Higher frequency = more coaching, lower frequency = less distraction
              </p>
            </div>
          </div>

          {/* Notification Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3">Notification Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{category.name}</p>
                        <p className="text-slate-400 text-sm">{category.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enabledCategories[category.id as keyof typeof settings.enabledCategories]}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency Filters */}
          <div>
            <h3 className="text-white font-semibold mb-3">Urgency Levels</h3>
            <div className="space-y-3">
              {urgencyLevels.map((level) => (
                <div key={level.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                    <div>
                      <p className="text-white font-medium">{level.name}</p>
                      <p className="text-slate-400 text-sm">{level.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.urgencyFilters[level.id as keyof typeof settings.urgencyFilters]}
                    onCheckedChange={() => handleUrgencyToggle(level.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h3 className="text-white font-semibold mb-3">Additional Settings</h3>
            <div className="space-y-4">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Sound Notifications</p>
                    <p className="text-slate-400 text-sm">Play sound with notifications</p>
                  </div>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
                />
              </div>

              {/* Overlay Opacity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Overlay Opacity</span>
                  <Badge variant="outline">{settings.overlayOpacity[0]}%</Badge>
                </div>
                <Slider
                  value={settings.overlayOpacity}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, overlayOpacity: value }))}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;

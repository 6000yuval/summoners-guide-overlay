
import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  message: string;
  urgency: 'red' | 'orange' | 'yellow' | 'green';
  duration: number;
  timestamp: number;
}

interface GameOverlayProps {
  role: string;
  gameTime: number;
  onNotification: (notification: Notification) => void;
}

const GameOverlay = ({ role, gameTime, onNotification }: GameOverlayProps) => {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [muted, setMuted] = useState(false);

  const addNotification = (message: string, urgency: 'red' | 'orange' | 'yellow' | 'green', duration = 5000) => {
    if (muted) return;
    
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      urgency,
      duration,
      timestamp: Date.now()
    };

    setActiveNotifications(prev => [...prev, notification]);
    onNotification(notification);

    // Auto-remove after duration
    setTimeout(() => {
      setActiveNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, duration);
  };

  const removeNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'red':
        return 'bg-red-900/95 border-red-500 text-red-100 shadow-red-500/20';
      case 'orange':
        return 'bg-orange-900/95 border-orange-500 text-orange-100 shadow-orange-500/20';
      case 'yellow':
        return 'bg-yellow-900/95 border-yellow-500 text-yellow-100 shadow-yellow-500/20';
      case 'green':
        return 'bg-green-900/95 border-green-500 text-green-100 shadow-green-500/20';
      default:
        return 'bg-slate-900/95 border-slate-500 text-slate-100 shadow-slate-500/20';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2 max-w-sm">
      {/* Control Panel */}
      <div className="bg-slate-900/95 border border-slate-600 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="text-white text-sm font-medium">
            League Coach Pro - {role.toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMuted(!muted)}
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Game Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Active Notifications */}
      {activeNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg p-4 border-2 shadow-xl backdrop-blur-sm animate-in slide-in-from-left-5 ${getUrgencyStyles(notification.urgency)}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">
                {notification.message}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeNotification(notification.id)}
              className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}

      {/* Sample Notification for Demo */}
      {gameTime === 10 && (
        <div className="hidden" />
      )}
    </div>
  );
};

export default GameOverlay;

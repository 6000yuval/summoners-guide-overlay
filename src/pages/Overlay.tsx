
import React, { useState, useEffect } from 'react';
import GameOverlay from '@/components/GameOverlay';
import { useLeagueIntegration } from '@/hooks/useLeagueIntegration';

const Overlay = () => {
  const { connected, gamePhase } = useLeagueIntegration();
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    if (gamePhase === 'InProgress') {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase]);

  if (!connected || gamePhase !== 'InProgress') {
    return (
      <div className="fixed top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 text-white text-sm">
        Waiting for game...
      </div>
    );
  }

  return (
    <GameOverlay
      role="mid"
      gameTime={gameTime}
      onNotification={(notification) => {
        console.log('Notification:', notification);
      }}
    />
  );
};

export default Overlay;


import React, { useState, useEffect } from 'react';
import GameOverlay from '@/components/GameOverlay';
import ChampionTips from '@/components/ChampionTips';
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

  if (!connected) {
    return (
      <div className="fixed top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 text-white text-sm">
        Waiting for League connection...
      </div>
    );
  }

  // Show champion tips during champion select
  if (gamePhase === 'ChampSelect') {
    return <ChampionTips />;
  }

  // Show game overlay during active game
  if (gamePhase === 'InProgress') {
    return (
      <GameOverlay
        role="mid"
        gameTime={gameTime}
        onNotification={(notification) => {
          console.log('Notification:', notification);
        }}
      />
    );
  }

  // Default waiting state
  return (
    <div className="fixed top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 text-white text-sm">
      Waiting for game...
    </div>
  );
};

export default Overlay;

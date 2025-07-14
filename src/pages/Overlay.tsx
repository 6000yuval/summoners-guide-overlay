
import React, { useState, useEffect } from 'react';
import GameOverlay from '@/components/GameOverlay';
import ChampionTips from '@/components/ChampionTips';
import { useOverwolfIntegration } from '@/hooks/useOverwolfIntegration';

const Overlay = () => {
  const { connected, gamePhase, minimizeWindow, closeWindow } = useOverwolfIntegration();
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
      <div className="fixed top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 text-white text-sm flex items-center gap-2">
        <span>Waiting for Overwolf connection...</span>
        <button 
          onClick={closeWindow}
          className="ml-2 text-red-400 hover:text-red-300"
          title="Close"
        >
          ×
        </button>
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
    <div className="fixed top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 text-white text-sm flex items-center gap-2">
      <span>Waiting for game...</span>
      <button 
        onClick={minimizeWindow}
        className="ml-2 text-blue-400 hover:text-blue-300"
        title="Minimize"
      >
        −
      </button>
      <button 
        onClick={closeWindow}
        className="text-red-400 hover:text-red-300"
        title="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Overlay;

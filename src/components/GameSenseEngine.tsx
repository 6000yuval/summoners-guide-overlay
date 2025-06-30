
import React, { useEffect, useRef } from 'react';

interface GameSenseEngineProps {
  role: string;
  gameTime: number;
  active: boolean;
  onNotification: (notification: { message: string; urgency: 'red' | 'orange' | 'yellow' | 'green' }) => void;
}

const GameSenseEngine = ({ role, gameTime, active, onNotification }: GameSenseEngineProps) => {
  const lastNotificationTime = useRef(0);
  const gameState = useRef({
    jungleStart: null as 'top' | 'bot' | null,
    enemyArrivalTimes: {
      top: 0,
      bot: 0
    },
    firstGankWarningShown: false,
    objectiveWarningsShown: {
      dragon: false,
      herald: false
    },
    minimapReminders: 0
  });

  useEffect(() => {
    if (!active) return;

    const processGameLogic = () => {
      // Prevent notification spam - max 1 per 5 seconds
      if (Date.now() - lastNotificationTime.current < 5000) return;

      // Early game jungle tracking (1:15 mark)
      if (gameTime === 75 && !gameState.current.jungleStart) {
        // Simulate enemy arrival detection
        const topLate = Math.random() > 0.7; // 30% chance top is late
        const botLate = Math.random() > 0.8; // 20% chance bot is late
        
        if (topLate) {
          gameState.current.jungleStart = 'bot';
          onNotification({
            message: "Enemy top arrived late → jungle started RED side. Bot: expect gank at 3:00",
            urgency: 'red'
          });
          lastNotificationTime.current = Date.now();
        } else if (botLate) {
          gameState.current.jungleStart = 'top';
          onNotification({
            message: "Enemy bot arrived late → jungle started BLUE side. Top: expect gank at 3:00",
            urgency: 'red'
          });
          lastNotificationTime.current = Date.now();
        }
      }

      // First gank warning (2:30 mark)
      if (gameTime === 150 && !gameState.current.firstGankWarningShown) {
        gameState.current.firstGankWarningShown = true;
        onNotification({
          message: "First gank window! Ward river/tri-brush NOW",
          urgency: 'orange'
        });
        lastNotificationTime.current = Date.now();
      }

      // Smart warding based on jungle start (2:45 mark)
      if (gameTime === 165 && gameState.current.jungleStart) {
        const message = gameState.current.jungleStart === 'bot' 
          ? "Enemy jungler started bot → ward TOP side river/pixel brush"
          : "Enemy jungler started top → ward BOT side river/raptor entrance";
        
        onNotification({
          message,
          urgency: 'orange'
        });
        lastNotificationTime.current = Date.now();
      }

      // Dragon spawn warning (4:45 mark)
      if (gameTime === 285 && !gameState.current.objectiveWarningsShown.dragon) {
        gameState.current.objectiveWarningsShown.dragon = true;
        onNotification({
          message: "Dragon spawns in 15s → Bot/Mid: sweep pit vision",
          urgency: 'yellow'
        });
        lastNotificationTime.current = Date.now();
      }

      // Herald spawn warning (7:45 mark)
      if (gameTime === 465 && !gameState.current.objectiveWarningsShown.herald) {
        gameState.current.objectiveWarningsShown.herald = true;
        onNotification({
          message: "Herald spawns in 15s → Top/Mid: push wave & help jungler",
          urgency: 'yellow'
        });
        lastNotificationTime.current = Date.now();
      }

      // Role-specific notifications
      if (gameTime > 180 && gameTime % 60 === 0) { // Every minute after 3:00
        const roleNotifications = getRoleSpecificNotifications(role, gameTime);
        if (roleNotifications.length > 0) {
          const randomNotif = roleNotifications[Math.floor(Math.random() * roleNotifications.length)];
          onNotification(randomNotif);
          lastNotificationTime.current = Date.now();
        }
      }

      // Minimap reminder (every 30 seconds)
      if (gameTime > 60 && gameTime % 30 === 0) {
        gameState.current.minimapReminders++;
        if (gameState.current.minimapReminders % 4 === 0) { // Every 2 minutes
          onNotification({
            message: "Check minimap — look for missing enemies",
            urgency: 'green'
          });
          lastNotificationTime.current = Date.now();
        }
      }

      // Mid-game rotations (after 10 minutes)
      if (gameTime === 600) {
        onNotification({
          message: "Mid-game phase: Group with team for objectives",
          urgency: 'yellow'
        });
        lastNotificationTime.current = Date.now();
      }
    };

    processGameLogic();
  }, [gameTime, active, role, onNotification]);

  const getRoleSpecificNotifications = (role: string, gameTime: number) => {
    const notifications = [];

    switch (role) {
      case 'top':
        notifications.push(
          { message: "If enemy uses abilities on minions, trade window open", urgency: 'yellow' as const },
          { message: "Teleport ready? Look for bot lane fights", urgency: 'orange' as const },
          { message: "Push wave before backing to maintain pressure", urgency: 'green' as const }
        );
        break;
      
      case 'mid':
        notifications.push(
          { message: "If enemy roams, shove wave before following", urgency: 'orange' as const },
          { message: "Roam bot after clearing wave for 2v2 advantage", urgency: 'yellow' as const },
          { message: "Control vision around mid river for safety", urgency: 'green' as const }
        );
        break;
      
      case 'adc':
        notifications.push(
          { message: "Farm safely when support roams", urgency: 'orange' as const },
          { message: "Track enemy ADC items for power spikes", urgency: 'yellow' as const },
          { message: "Position behind minions vs hook supports", urgency: 'green' as const }
        );
        break;
      
      case 'support':
        notifications.push(
          { message: "If support roams, ping Mid—prevent collapse", urgency: 'red' as const },
          { message: "Deep ward enemy jungle when ahead", urgency: 'yellow' as const },
          { message: "Peel for ADC in team fights", urgency: 'orange' as const }
        );
        break;
      
      case 'jungle':
        notifications.push(
          { message: "Gank pushed lanes for easy kills", urgency: 'orange' as const },
          { message: "Counter-jungle when enemy shows opposite side", urgency: 'yellow' as const },
          { message: "Secure scuttle crab for vision control", urgency: 'green' as const }
        );
        break;
    }

    return notifications;
  };

  return null; // This component doesn't render anything
};

export default GameSenseEngine;

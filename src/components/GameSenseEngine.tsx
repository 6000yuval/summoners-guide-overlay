import React, { useEffect, useRef } from 'react';

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

interface GameSenseEngineProps {
  role: string;
  gameTime: number;
  active: boolean;
  matchupData?: MatchupData;
  onNotification: (notification: { message: string; urgency: 'red' | 'orange' | 'yellow' | 'green' }) => void;
}

const GameSenseEngine = ({ role, gameTime, active, matchupData, onNotification }: GameSenseEngineProps) => {
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
    minimapReminders: 0,
    matchupWarningsShown: {
      earlyGame: false,
      counter: false,
      powerspike: false
    }
  });

  useEffect(() => {
    if (!active) return;

    const processGameLogic = () => {
      // Prevent notification spam - max 1 per 5 seconds
      if (Date.now() - lastNotificationTime.current < 5000) return;

      // Matchup-specific early game warnings (0:30 mark)
      if (gameTime === 30 && matchupData && !gameState.current.matchupWarningsShown.earlyGame) {
        gameState.current.matchupWarningsShown.earlyGame = true;
        
        if (matchupData.matchupAdvantage === 'unfavorable') {
          onNotification({
            message: `⚠️ COUNTER MATCHUP: ${matchupData.enemyChampion.name} counters you! Play defensively and farm safely`,
            urgency: 'red'
          });
        } else if (matchupData.enemyChampion.earlyGameStrength === 'strong' && matchupData.playerChampion.earlyGameStrength === 'weak') {
          onNotification({
            message: `🛡️ Enemy ${matchupData.enemyChampion.name} is strong early game. Play safe until level 6+`,
            urgency: 'orange'
          });
        } else if (matchupData.matchupAdvantage === 'favorable') {
          onNotification({
            message: `⚔️ FAVORABLE MATCHUP: You counter ${matchupData.enemyChampion.name}! Look for early trades`,
            urgency: 'green'
          });
        }
        
        lastNotificationTime.current = Date.now();
      }

      // Counter-specific warning (1:00 mark)
      if (gameTime === 60 && matchupData && !gameState.current.matchupWarningsShown.counter && matchupData.matchupAdvantage === 'unfavorable') {
        gameState.current.matchupWarningsShown.counter = true;
        onNotification({
          message: `🚨 Stay behind minions! ${matchupData.enemyChampion.name} will try to poke/all-in you`,
          urgency: 'red'
        });
        lastNotificationTime.current = Date.now();
      }

      // Power spike warning (based on levels)
      if ((gameTime === 180 || gameTime === 360) && matchupData && !gameState.current.matchupWarningsShown.powerspike) { // 3 min or 6 min
        const level = gameTime === 180 ? 3 : 6;
        gameState.current.matchupWarningsShown.powerspike = true;
        
        if (matchupData.enemyChampion.earlyGameStrength === 'strong') {
          onNotification({
            message: `⚡ Enemy ${matchupData.enemyChampion.name} level ${level} power spike! Extra caution needed`,
            urgency: 'orange'
          });
        } else if (matchupData.playerChampion.earlyGameStrength === 'strong') {
          onNotification({
            message: `💪 Your level ${level} power spike! Consider trading aggressively`,
            urgency: 'yellow'
          });
        }
        
        lastNotificationTime.current = Date.now();
      }

      
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

      // Role-specific notifications with matchup considerations
      if (gameTime > 180 && gameTime % 60 === 0) { // Every minute after 3:00
        const roleNotifications = getRoleSpecificNotifications(role, gameTime, matchupData);
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
  }, [gameTime, active, role, matchupData, onNotification]);

  const getRoleSpecificNotifications = (role: string, gameTime: number, matchupData?: MatchupData) => {
    const notifications = [];
    const isUnfavorable = matchupData?.matchupAdvantage === 'unfavorable';
    const isFavorable = matchupData?.matchupAdvantage === 'favorable';

    switch (role) {
      case 'top':
        if (isUnfavorable) {
          notifications.push(
            { message: "Counter matchup: Focus on farming and avoid extended trades", urgency: 'red' as const },
            { message: "Call for jungle help - you need assistance in this matchup", urgency: 'orange' as const }
          );
        } else if (isFavorable) {
          notifications.push(
            { message: "Favorable matchup: Press your advantage with trades", urgency: 'green' as const },
            { message: "Zone enemy from CS when you have prio", urgency: 'yellow' as const }
          );
        }
        notifications.push(
          { message: "If enemy uses abilities on minions, trade window open", urgency: 'yellow' as const },
          { message: "Teleport ready? Look for bot lane fights", urgency: 'orange' as const }
        );
        break;
      
      case 'mid':
        if (isUnfavorable) {
          notifications.push(
            { message: "Tough matchup: Play safe and farm from distance", urgency: 'red' as const },
            { message: "Roam to help side lanes since you can't win 1v1", urgency: 'orange' as const }
          );
        } else if (isFavorable) {
          notifications.push(
            { message: "Winning matchup: Look for solo kills", urgency: 'green' as const },
            { message: "Push and roam - make enemy miss CS", urgency: 'yellow' as const }
          );
        }
        notifications.push(
          { message: "If enemy roams, shove wave before following", urgency: 'orange' as const },
          { message: "Control vision around mid river for safety", urgency: 'green' as const }
        );
        break;
      
      case 'adc':
        if (isUnfavorable) {
          notifications.push(
            { message: "Outranged/outscaled: Focus on farming safely", urgency: 'red' as const },
            { message: "Stay behind minions and avoid poke", urgency: 'orange' as const }
          );
        } else if (isFavorable) {
          notifications.push(
            { message: "Strong matchup: Look for aggressive trades", urgency: 'green' as const },
            { message: "Push for level 2 advantage", urgency: 'yellow' as const }
          );
        }
        notifications.push(
          { message: "Track enemy ADC items for power spikes", urgency: 'yellow' as const },
          { message: "Position behind minions vs hook supports", urgency: 'green' as const }
        );
        break;
      
      case 'support':
        notifications.push(
          { message: "Deep ward enemy jungle when ahead", urgency: 'yellow' as const },
          { message: "Peel for ADC in team fights", urgency: 'orange' as const },
          { message: "Roam mid when ADC is safe", urgency: 'green' as const }
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

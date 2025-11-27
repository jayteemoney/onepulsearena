import { useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useCallback, useState } from 'react';
import { EVENT_TYPES } from '../config/sui';

export interface PulseEvent {
  player: string;
  profileId: string;
  actionType: string;
  value: number;
  newScore: number;
  yieldEarned: number;
  timestamp: number;
}

export interface LeaderboardUpdateEvent {
  player: string;
  score: number;
  rank: number;
  leaderboardType: string;
  timestamp: number;
}

export function useSuiEventStream() {
  const client = useSuiClient();
  const [pulseEvents, setPulseEvents] = useState<PulseEvent[]>([]);
  const [leaderboardEvents, setLeaderboardEvents] = useState<LeaderboardUpdateEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handlePulseEvent = useCallback((event: any) => {
    try {
      const parsedContent = event.parsedJson;
      const pulseEvent: PulseEvent = {
        player: parsedContent.player,
        profileId: parsedContent.profile_id,
        actionType: parsedContent.action_type,
        value: parseInt(parsedContent.value),
        newScore: parseInt(parsedContent.new_score),
        yieldEarned: parseInt(parsedContent.yield_earned),
        timestamp: parseInt(parsedContent.timestamp),
      };

      setPulseEvents((prev) => [pulseEvent, ...prev].slice(0, 50)); // Keep last 50 events
    } catch (error) {
      console.error('Error parsing pulse event:', error);
    }
  }, []);

  const handleLeaderboardEvent = useCallback((event: any) => {
    try {
      const parsedContent = event.parsedJson;
      const lbEvent: LeaderboardUpdateEvent = {
        player: parsedContent.player,
        score: parseInt(parsedContent.score),
        rank: parseInt(parsedContent.rank),
        leaderboardType: parsedContent.leaderboard_type,
        timestamp: parseInt(parsedContent.timestamp),
      };

      setLeaderboardEvents((prev) => [lbEvent, ...prev].slice(0, 20));
    } catch (error) {
      console.error('Error parsing leaderboard event:', error);
    }
  }, []);

  // Subscribe to events
  useEffect(() => {
    let unsubscribePulse: (() => void) | undefined;
    let unsubscribeLeaderboard: (() => void) | undefined;

    const subscribeToPulseEvents = async () => {
      try {
        unsubscribePulse = await client.subscribeEvent({
          filter: {
            MoveEventType: EVENT_TYPES.PULSE_ACTION,
          },
          onMessage: handlePulseEvent,
        });
        setIsConnected(true);
      } catch (error) {
        console.error('Error subscribing to pulse events:', error);
        setIsConnected(false);
      }
    };

    const subscribeToLeaderboardEvents = async () => {
      try {
        unsubscribeLeaderboard = await client.subscribeEvent({
          filter: {
            MoveEventType: EVENT_TYPES.LEADERBOARD_UPDATED,
          },
          onMessage: handleLeaderboardEvent,
        });
      } catch (error) {
        console.error('Error subscribing to leaderboard events:', error);
      }
    };

    subscribeToPulseEvents();
    subscribeToLeaderboardEvents();

    return () => {
      if (unsubscribePulse) unsubscribePulse();
      if (unsubscribeLeaderboard) unsubscribeLeaderboard();
    };
  }, [client, handlePulseEvent, handleLeaderboardEvent]);

  return {
    pulseEvents,
    leaderboardEvents,
    isConnected,
  };
}

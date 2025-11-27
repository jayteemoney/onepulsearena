import { useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useCallback, useState, useRef } from 'react';
import { EVENT_TYPES, PACKAGE_ID } from '../config/sui';

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

// Polling configuration
const POLL_INTERVAL = 3000; // Poll every 3 seconds
const MAX_EVENTS_PER_POLL = 10; // Fetch up to 10 events per poll
const MAX_STORED_EVENTS = 50; // Keep last 50 pulse events
const MAX_STORED_LEADERBOARD = 20; // Keep last 20 leaderboard events

export function useSuiEventStream() {
  const client = useSuiClient();
  const [pulseEvents, setPulseEvents] = useState<PulseEvent[]>([]);
  const [leaderboardEvents, setLeaderboardEvents] = useState<LeaderboardUpdateEvent[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [lastPollTime, setLastPollTime] = useState<Date | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  // Use refs to track the latest event timestamps to avoid fetching duplicates
  const lastPulseTimestampRef = useRef<number>(0);
  const lastLeaderboardTimestampRef = useRef<number>(0);
  const isFirstLoadRef = useRef<boolean>(true);

  const parsePulseEvent = useCallback((event: any): PulseEvent | null => {
    try {
      const parsedContent = event.parsedJson;
      return {
        player: parsedContent.player,
        profileId: parsedContent.profile_id,
        actionType: parsedContent.action_type,
        value: parseInt(parsedContent.value),
        newScore: parseInt(parsedContent.new_score),
        yieldEarned: parseInt(parsedContent.yield_earned),
        timestamp: parseInt(parsedContent.timestamp),
      };
    } catch (error) {
      console.error('Error parsing pulse event:', error);
      return null;
    }
  }, []);

  const parseLeaderboardEvent = useCallback((event: any): LeaderboardUpdateEvent | null => {
    try {
      const parsedContent = event.parsedJson;

      // Convert byte array to string for leaderboard_type
      let leaderboardType = parsedContent.leaderboard_type;
      if (Array.isArray(leaderboardType)) {
        leaderboardType = String.fromCharCode(...leaderboardType);
      }

      return {
        player: parsedContent.player,
        score: parseInt(parsedContent.score),
        rank: parseInt(parsedContent.rank),
        leaderboardType,
        timestamp: parseInt(parsedContent.timestamp),
      };
    } catch (error) {
      console.error('Error parsing leaderboard event:', error);
      return null;
    }
  }, []);

  // Fetch pulse events using queryEvents
  const fetchPulseEvents = useCallback(async () => {
    if (!PACKAGE_ID) return;

    try {
      console.log('🔍 Querying pulse events:', EVENT_TYPES.PULSE_ACTION);

      const result = await client.queryEvents({
        query: {
          MoveEventType: EVENT_TYPES.PULSE_ACTION,
        },
        order: 'descending',
        limit: MAX_EVENTS_PER_POLL,
      });

      console.log(`📊 Query result: ${result.data?.length || 0} events found`);

      if (result.data && result.data.length > 0) {
        console.log('📦 First event sample:', JSON.stringify(result.data[0], null, 2));

        const newEvents: PulseEvent[] = [];

        for (const eventData of result.data) {
          const parsed = parsePulseEvent(eventData);
          if (parsed) {
            // On first load, accept all events. Otherwise, only add new ones
            if (isFirstLoadRef.current || parsed.timestamp > lastPulseTimestampRef.current) {
              newEvents.push(parsed);
              console.log(`✅ New event: Player ${parsed.player.slice(0, 8)}... | Score: ${parsed.newScore}`);
            } else {
              console.log(`⏭️  Skipping old event (timestamp: ${parsed.timestamp} <= ${lastPulseTimestampRef.current})`);
            }
          }
        }

        if (newEvents.length > 0) {
          // Update the latest timestamp
          const latestTimestamp = Math.max(...newEvents.map(e => e.timestamp));
          lastPulseTimestampRef.current = latestTimestamp;

          // Add new events to the beginning and limit total stored
          setPulseEvents(prev => [...newEvents, ...prev].slice(0, MAX_STORED_EVENTS));
          console.log(`🎉 Added ${newEvents.length} new pulse events to feed`);

          // Mark first load as complete
          if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            console.log('✓ Initial load complete');
          }
        } else {
          console.log('⏸️  No new events to add (all filtered by timestamp)');
        }
      } else {
        console.log('ℹ️  No pulse events found on blockchain yet');
        if (isFirstLoadRef.current) {
          isFirstLoadRef.current = false;
          console.log('✓ Initial load complete (no events found)');
        }
      }

      // Reset error count on success
      setErrorCount(0);
    } catch (error) {
      console.error('❌ Error fetching pulse events:', error);
      setErrorCount(prev => prev + 1);
    }
  }, [client, parsePulseEvent]);

  // Fetch leaderboard events using queryEvents
  const fetchLeaderboardEvents = useCallback(async () => {
    if (!PACKAGE_ID) return;

    try {
      console.log('🏆 Querying leaderboard events:', EVENT_TYPES.LEADERBOARD_UPDATED);

      const result = await client.queryEvents({
        query: {
          MoveEventType: EVENT_TYPES.LEADERBOARD_UPDATED,
        },
        order: 'descending',
        limit: MAX_EVENTS_PER_POLL,
      });

      console.log(`📊 Leaderboard query result: ${result.data?.length || 0} events found`);

      if (result.data && result.data.length > 0) {
        const newEvents: LeaderboardUpdateEvent[] = [];

        for (const eventData of result.data) {
          const parsed = parseLeaderboardEvent(eventData);
          if (parsed) {
            // Only add events newer than the last one we processed
            if (parsed.timestamp > lastLeaderboardTimestampRef.current) {
              newEvents.push(parsed);
              console.log(`✅ New leaderboard event: Player ${parsed.player.slice(0, 8)}... | Rank: ${parsed.rank}`);
            }
          }
        }

        if (newEvents.length > 0) {
          // Update the latest timestamp
          const latestTimestamp = Math.max(...newEvents.map(e => e.timestamp));
          lastLeaderboardTimestampRef.current = latestTimestamp;

          // Add new events to the beginning and limit total stored
          setLeaderboardEvents(prev => [...newEvents, ...prev].slice(0, MAX_STORED_LEADERBOARD));
          console.log(`🎉 Added ${newEvents.length} new leaderboard events`);
        }
      } else {
        console.log('ℹ️  No leaderboard events found on blockchain yet');
      }
    } catch (error) {
      console.error('❌ Error fetching leaderboard events:', error);
    }
  }, [client, parseLeaderboardEvent]);

  // Combined polling function
  const pollEvents = useCallback(async () => {
    console.log('⏰ Polling events...');
    await Promise.all([
      fetchPulseEvents(),
      fetchLeaderboardEvents(),
    ]);
    setLastPollTime(new Date());
    console.log('✓ Poll complete');
  }, [fetchPulseEvents, fetchLeaderboardEvents]);

  // Set up polling interval
  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const startPolling = async () => {
      if (!isMounted) return;

      setIsPolling(true);
      console.log('🔄 Event polling started (interval: 3s)');

      // Initial fetch
      await pollEvents();

      // Set up recurring polling
      pollInterval = setInterval(async () => {
        if (isMounted) {
          await pollEvents();
        }
      }, POLL_INTERVAL);
    };

    // Only start polling if PACKAGE_ID is configured
    if (PACKAGE_ID) {
      startPolling();
    } else {
      console.warn('⚠️ PACKAGE_ID not configured. Event polling disabled.');
    }

    return () => {
      isMounted = false;
      setIsPolling(false);
      if (pollInterval) {
        clearInterval(pollInterval);
        console.log('🛑 Event polling stopped');
      }
    };
  }, [pollEvents]);

  return {
    pulseEvents,
    leaderboardEvents,
    isPolling,
    lastPollTime,
    errorCount,
  };
}

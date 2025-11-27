import { useSuiEventStream } from '../hooks/useSuiEventStream';
import { useGameStore } from '../stores/gameStore';
import { useEffect, useState, useCallback } from 'react';
import { PACKAGE_ID, GLOBAL_LEADERBOARD_ID } from '../config/sui';
import { useSuiClient } from '@mysten/dapp-kit';

export function Leaderboard() {
  const { leaderboardEvents } = useSuiEventStream();
  const { leaderboard, updateLeaderboard } = useGameStore();
  const client = useSuiClient();
  const [loading, setLoading] = useState(true);
  // @ts-ignore - used for future feature
  const packageId = PACKAGE_ID;

  // Fetch initial leaderboard state from contract
  const fetchInitialLeaderboard = useCallback(async () => {
    if (!GLOBAL_LEADERBOARD_ID) {
      console.warn('GLOBAL_LEADERBOARD_ID not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const leaderboardObj = await client.getObject({
        id: GLOBAL_LEADERBOARD_ID,
        options: {
          showContent: true,
        },
      });

      if (leaderboardObj.data?.content && 'fields' in leaderboardObj.data.content) {
        const fields = leaderboardObj.data.content.fields as any;
        const topPlayers = fields.top_players || [];

        // Convert to leaderboard format
        const initialLeaderboard = topPlayers.slice(0, 10).map((address: string, index: number) => ({
          address,
          score: 0, // We'd need to query individual entries for scores
          rank: index + 1,
        }));

        updateLeaderboard(initialLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching initial leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [client, updateLeaderboard]);

  // Fetch initial state on mount
  useEffect(() => {
    fetchInitialLeaderboard();
  }, [fetchInitialLeaderboard]);

  // Update from real-time events
  useEffect(() => {
    if (leaderboardEvents.length > 0) {
      // Update local leaderboard from events
      const newLeaderboard = leaderboardEvents
        .filter((e) => e.leaderboardType === 'GLOBAL')
        .slice(0, 10)
        .map((e) => ({
          address: e.player,
          score: e.score,
          rank: e.rank,
        }));

      updateLeaderboard(newLeaderboard);
    }
  }, [leaderboardEvents, updateLeaderboard]);

  return (
    <div className="bg-cyber-dark border-2 border-neon-purple rounded-lg p-6 w-80">
      <h2 className="text-2xl font-cyber text-neon-purple mb-4 flex items-center gap-2">
        <span>🏆</span> Leaderboard
      </h2>

      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-gray-400 text-center py-8 font-mono text-sm">
            No players yet. Be the first!
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.address}
              className="bg-cyber-gray p-3 rounded border border-neon-blue/30 hover:border-neon-blue transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-neon-blue font-cyber text-lg w-6">
                    #{index + 1}
                  </span>
                  <span className="text-white font-mono text-sm truncate max-w-[150px]">
                    {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                  </span>
                </div>
                <span className="text-neon-green font-cyber">
                  {entry.score}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-cyber-gray">
        <div className="text-xs text-gray-400 font-mono text-center">
          Updates in real-time via Sui events
        </div>
      </div>
    </div>
  );
}

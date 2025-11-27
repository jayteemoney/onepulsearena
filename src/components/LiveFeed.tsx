import { useSuiEventStream } from '../hooks/useSuiEventStream';
import { useEffect, useRef } from 'react';

export function LiveFeed() {
  const { pulseEvents, isConnected } = useSuiEventStream();
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [pulseEvents]);

  return (
    <div className="bg-cyber-dark border-2 border-neon-blue rounded-lg p-6 w-96">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-cyber text-neon-blue flex items-center gap-2">
          <span>📡</span> Live Feed
        </h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-green animate-pulse' : 'bg-red-500'
              }`}
          />
          <span className="text-xs font-mono text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div
        ref={feedRef}
        className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar"
      >
        {pulseEvents.length === 0 ? (
          <div className="text-gray-400 text-center py-8 font-mono text-sm">
            Waiting for pulse actions...
          </div>
        ) : (
          pulseEvents.map((event, index) => (
            <div
              key={`${event.player}-${event.timestamp}-${index}`}
              className="bg-cyber-gray p-3 rounded border border-neon-pink/30 animate-slide-up"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-neon-pink font-mono text-xs truncate">
                    {event.player.slice(0, 8)}...{event.player.slice(-6)}
                  </div>
                  <div className="text-white font-cyber text-sm mt-1">
                    ⚡ PULSE +{event.value}
                  </div>
                  <div className="text-neon-green text-xs font-mono mt-1">
                    Score: {event.newScore} | Yield: +{event.yieldEarned}
                  </div>
                </div>
                <div className="text-gray-500 text-xs font-mono">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1E293B;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00F5FF;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF006E;
        }
      `}</style>
    </div>
  );
}

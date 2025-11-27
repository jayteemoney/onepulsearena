import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletConnect } from './components/WalletConnect';
import { GameCanvas } from './components/GameCanvas';
import { Leaderboard } from './components/Leaderboard';
import { LiveFeed } from './components/LiveFeed';
import { useOnePulseArena } from './hooks/useOnePulseArena';
import { Toaster } from 'react-hot-toast';
import { PACKAGE_ID, GAME_STATE_ID } from './config/sui';
import { useEffect } from 'react';

function App() {
  const account = useCurrentAccount();
  const { profile, createProfile, claimYield, mintAchievement, achievements, loading } = useOnePulseArena();

  // Debug: Log configuration on mount
  useEffect(() => {
    console.log('🔧 OnePulse Arena Configuration:');
    console.log('  Package ID:', PACKAGE_ID || '❌ NOT SET');
    console.log('  GameState ID:', GAME_STATE_ID || '❌ NOT SET');
    console.log('  Network:', import.meta.env.VITE_SUI_NETWORK || 'testnet');
    console.log('  RPC URL:', import.meta.env.VITE_ONECHAIN_RPC_URL);

    if (!PACKAGE_ID) {
      console.error('❌ PACKAGE_ID is not set! Check your .env file and restart dev server.');
    }
    if (!GAME_STATE_ID) {
      console.error('❌ GAME_STATE_ID is not set! Check your .env file and restart dev server.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-cyber-dark text-white">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b border-neon-blue/30 bg-cyber-darker/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-cyber text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                OnePulse Arena
              </h1>
              <p className="text-sm text-gray-400 font-mono mt-1">
                Real-Time Multiplayer GameFi on OneChain
              </p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {!account ? (
          // Welcome Screen
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <div className="text-8xl mb-4 animate-pulse-slow">⚡</div>
                <h2 className="text-5xl font-cyber text-neon-blue mb-4">
                  Welcome to OnePulse Arena
                </h2>
                <p className="text-xl text-gray-300 font-mono mb-8">
                  A real-time multiplayer blockchain game powered by{' '}
                  <span className="text-neon-purple font-cyber">
                    Sui Move
                  </span>{' '}
                  on <span className="text-neon-blue font-cyber">OneChain</span>
                </p>
              </div>

              <div className="bg-cyber-gray border border-neon-pink rounded-lg p-8 mb-8">
                <h3 className="text-2xl font-cyber text-neon-pink mb-4">
                  How to Play
                </h3>
                <div className="text-left space-y-3 font-mono text-sm">
                  <p className="flex items-start gap-3">
                    <span className="text-neon-blue">1.</span>
                    Connect your OneWallet (Sui compatible)
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-neon-blue">2.</span>
                    Create your player profile (one-time setup)
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-neon-blue">3.</span>
                    Use arrow keys to move, SPACE to pulse
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-neon-blue">4.</span>
                    Each pulse scores +100 points & earns yield
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-neon-blue">5.</span>
                    Climb the leaderboard in real-time!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="bg-cyber-dark border border-neon-blue rounded-lg p-4">
                  <div className="text-neon-blue font-cyber text-sm">
                    ⚡ Speed
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    ~100-200ms latency
                  </div>
                </div>
                <div className="bg-cyber-dark border border-neon-purple rounded-lg p-4">
                  <div className="text-neon-purple font-cyber text-sm">
                    🔒 Security
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Move resources
                  </div>
                </div>
                <div className="bg-cyber-dark border border-neon-green rounded-lg p-4">
                  <div className="text-neon-green font-cyber text-sm">
                    💰 GameFi
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Yield generation
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !profile ? (
          // Profile Creation
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-3xl font-cyber text-neon-purple mb-4">
                Create Your Profile
              </h2>
              <p className="text-gray-300 font-mono mb-8">
                You need a player profile to start playing. This is a one-time
                transaction on OneChain.
              </p>
              <div className="bg-cyber-gray border border-neon-blue rounded-lg p-6 mb-6">
                <div className="text-sm text-gray-400 font-mono space-y-2">
                  <p>✓ Creates your PlayerProfile NFT</p>
                  <p>✓ Tracks your score & yield</p>
                  <p>✓ Enables leaderboard ranking</p>
                </div>
              </div>
              <button
                onClick={createProfile}
                disabled={loading}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-blue text-white font-cyber text-lg py-4 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Creating Profile...' : '🎮 Create Profile'}
              </button>
            </div>
          </div>
        ) : (
          // Game View
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_auto] gap-6">
            {/* Game Canvas */}
            <div className="flex flex-col items-center">
              <GameCanvas />

              {/* Player Stats */}
              <div className="mt-6 w-full max-w-[800px] grid grid-cols-3 gap-4">
                <div className="bg-cyber-gray border border-neon-blue rounded-lg p-4 text-center">
                  <div className="text-neon-blue font-cyber text-2xl">
                    {profile.score}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">Score</div>
                </div>
                <div className="bg-cyber-gray border border-neon-purple rounded-lg p-4 text-center">
                  <div className="text-neon-purple font-cyber text-2xl">
                    {profile.totalPulses}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Total Pulses
                  </div>
                </div>
                <div className="bg-cyber-gray border border-neon-green rounded-lg p-4 text-center">
                  <div className="text-neon-green font-cyber text-2xl">
                    {profile.yieldAccrued}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Yield Accrued
                  </div>
                </div>
              </div>

              {/* Claim Yield Button */}
              <div className="mt-4 w-full max-w-[800px]">
                <button
                  onClick={claimYield}
                  disabled={loading || profile.yieldAccrued === 0}
                  className="w-full bg-gradient-to-r from-neon-green to-neon-blue text-cyber-dark font-cyber text-lg py-4 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed relative group"
                  title={profile.yieldAccrued === 0 ? "No yield to claim" : `Claim ${profile.yieldAccrued} yield (1% per pulse)`}
                >
                  <span className="flex items-center justify-center gap-2">
                    💰 Claim Yield {profile.yieldAccrued > 0 && `(${profile.yieldAccrued})`}
                  </span>
                  {/* Tooltip */}
                  {profile.yieldAccrued > 0 && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-cyber-dark border border-neon-green rounded text-xs text-neon-green font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Earn 1% yield per pulse • GameFi mechanics
                    </span>
                  )}
                </button>
              </div>

              {/* Achievement Milestones Panel */}
              <div className="mt-4 w-full max-w-[800px]">
                <div className="bg-cyber-gray border border-neon-pink rounded-lg p-4">
                  <h3 className="text-neon-pink font-cyber text-lg mb-3 flex items-center gap-2">
                    🏆 Achievement Milestones
                  </h3>
                  <div className="space-y-2">
                    {achievements.map((achievement) => {
                      const isEligible = profile.totalPulses >= achievement.milestone;
                      const isEarned = achievement.earned;

                      return (
                        <div
                          key={achievement.milestone}
                          className={`flex items-center justify-between p-3 rounded border ${isEarned
                            ? 'bg-neon-green/10 border-neon-green'
                            : isEligible
                              ? 'bg-neon-purple/10 border-neon-purple'
                              : 'bg-cyber-dark border-gray-600'
                            }`}
                        >
                          <div className="flex-1">
                            <div className="font-mono text-sm">
                              <span className={isEarned ? 'text-neon-green' : isEligible ? 'text-neon-purple' : 'text-gray-400'}>
                                {achievement.name}
                              </span>
                              <span className="text-gray-500 ml-2">
                                ({profile.totalPulses}/{achievement.milestone} pulses)
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {achievement.description}
                            </div>
                          </div>
                          {isEligible && !isEarned && (
                            <button
                              onClick={() => mintAchievement(achievement.milestone)}
                              disabled={loading}
                              className="ml-4 px-4 py-2 bg-neon-purple text-white font-cyber text-sm rounded hover:opacity-90 disabled:opacity-50"
                            >
                              Mint NFT
                            </button>
                          )}
                          {isEarned && (
                            <span className="ml-4 text-neon-green text-sm font-mono">✓ Owned</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <Leaderboard />

            {/* Live Feed */}
            <LiveFeed />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-blue/30 bg-cyber-darker/50 backdrop-blur mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
            <div>
              Built with{' '}
              <span className="text-neon-pink">♥</span> for{' '}
              <span className="text-neon-blue">OneHack</span> Hackathon
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/jayteemoney/onepulse-arena"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-blue transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://t.me/hello_onechain"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-blue transition-colors"
              >
                OneChain
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

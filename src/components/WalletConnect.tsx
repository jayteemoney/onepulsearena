import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useOnePulseArena } from '../hooks/useOnePulseArena';
import { useEffect } from 'react';

export function WalletConnect() {
  const account = useCurrentAccount();
  const { profile, createProfile, loading } = useOnePulseArena();

  useEffect(() => {
    // Auto-create profile if wallet connected but no profile
    if (account && !profile && !loading) {
      // Show prompt instead of auto-creating
      console.log('Wallet connected, profile needed');
    }
  }, [account, profile, loading]);

  return (
    <div className="flex items-center gap-4">
      <ConnectButton className="bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-2 rounded-lg font-cyber text-white hover:shadow-lg hover:shadow-neon-blue/50 transition-all" />

      {account && !profile && (
        <button
          onClick={createProfile}
          disabled={loading}
          className="bg-neon-pink px-6 py-2 rounded-lg font-cyber text-white hover:shadow-lg hover:shadow-neon-pink/50 transition-all disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Profile'}
        </button>
      )}

      {account && profile && (
        <div className="bg-cyber-gray px-4 py-2 rounded-lg border border-neon-blue">
          <div className="text-neon-blue text-sm font-mono">
            Score: {profile.score} | Pulses: {profile.totalPulses}
          </div>
          <div className="text-neon-green text-xs font-mono">
            Yield: {profile.yieldAccrued}
          </div>
        </div>
      )}
    </div>
  );
}

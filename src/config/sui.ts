import { getFullnodeUrl } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';

// OneChain testnet configuration
const ONECHAIN_TESTNET_URL = import.meta.env.VITE_ONECHAIN_RPC_URL || getFullnodeUrl('testnet');

// Debug: Log configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 Sui Configuration:');
  console.log('  RPC URL:', ONECHAIN_TESTNET_URL);
  console.log('  Package ID:', import.meta.env.VITE_PACKAGE_ID || 'Not set');
  console.log('  Event Sync: Polling mode (3s interval)');
}

export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '';
export const GAME_STATE_ID = import.meta.env.VITE_GAME_STATE_ID || '';
export const GLOBAL_LEADERBOARD_ID = import.meta.env.VITE_GLOBAL_LEADERBOARD_ID || '';
export const DAILY_LEADERBOARD_ID = import.meta.env.VITE_DAILY_LEADERBOARD_ID || '';

// Network configuration for dApp Kit
const { networkConfig, useNetworkVariable } = createNetworkConfig({
  testnet: {
    url: ONECHAIN_TESTNET_URL,
    variables: {
      packageId: PACKAGE_ID,
    },
  },
  mainnet: {
    url: getFullnodeUrl('mainnet'),
    variables: {
      packageId: '',
    },
  },
});

export { networkConfig, useNetworkVariable };

// Game constants
export const GAME_CONFIG = {
  PULSE_VALUE: parseInt(import.meta.env.VITE_PULSE_VALUE || '100'),
  PULSE_COOLDOWN_MS: parseInt(import.meta.env.VITE_PULSE_COOLDOWN_MS || '1000'),
  YIELD_RATE: parseFloat(import.meta.env.VITE_YIELD_RATE || '0.0001'),
};

// Module names for contract interactions
export const MODULES = {
  ONEPULSE_ARENA: `${PACKAGE_ID}::onepulse_arena`,
  LEADERBOARD: `${PACKAGE_ID}::leaderboard`,
  ACHIEVEMENT_NFT: `${PACKAGE_ID}::achievement_nft`,
};

// Event types
export const EVENT_TYPES = {
  PULSE_ACTION: `${PACKAGE_ID}::onepulse_arena::PulseAction`,
  YIELD_CLAIMED: `${PACKAGE_ID}::onepulse_arena::YieldClaimed`,
  PLAYER_JOINED: `${PACKAGE_ID}::onepulse_arena::PlayerJoined`,
  LEADERBOARD_UPDATED: `${PACKAGE_ID}::leaderboard::LeaderboardUpdated`,
};

// Helper to check if shared object IDs are configured
export function hasSharedObjectIds(): boolean {
  return !!(GAME_STATE_ID && GLOBAL_LEADERBOARD_ID && DAILY_LEADERBOARD_ID);
}

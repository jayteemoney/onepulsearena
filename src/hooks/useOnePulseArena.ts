import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiObjectData } from '@mysten/sui.js/client';
import { useState, useCallback, useEffect } from 'react';
import { PACKAGE_ID, MODULES, GAME_STATE_ID } from '../config/sui';
import toast from 'react-hot-toast';

export interface PlayerProfile {
  id: string;
  player: string;
  score: number;
  totalPulses: number;
  yieldAccrued: number;
  lastPulseTimestamp: number;
  createdAt: number;
}

export interface Achievement {
  milestone: number;
  name: string;
  description: string;
  earned: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { milestone: 1, name: 'First Pulse', description: 'Completed your first pulse!', earned: false },
  { milestone: 100, name: 'Pulse Master', description: 'Reached 100 pulses!', earned: false },
  { milestone: 1000, name: 'Pulse Legend', description: 'An incredible 1000 pulses!', earned: false },
];

export function useOnePulseArena() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameStateId, setGameStateId] = useState<string>('');
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  // Fetch player profile
  const fetchProfile = useCallback(async () => {
    if (!account?.address) return;

    try {
      const objects = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${PACKAGE_ID}::onepulse_arena::PlayerProfile`,
        },
        options: {
          showContent: true,
        },
      });

      if (objects.data.length > 0) {
        const profileData = objects.data[0].data as SuiObjectData;
        if (profileData.content && 'fields' in profileData.content) {
          const fields = profileData.content.fields as any;
          setProfile({
            id: profileData.objectId,
            player: fields.player,
            score: parseInt(fields.score),
            totalPulses: parseInt(fields.total_pulses),
            yieldAccrued: parseInt(fields.yield_accrued),
            lastPulseTimestamp: parseInt(fields.last_pulse_timestamp),
            createdAt: parseInt(fields.created_at),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [account?.address, client]);

  // Fetch game state ID - now using configured value
  const fetchGameState = useCallback(async () => {
    try {
      // Use the configured GameState ID from environment
      if (GAME_STATE_ID) {
        setGameStateId(GAME_STATE_ID);
        return;
      }

      // Fallback: try to find GameState by querying dynamic fields of the package
      // Note: This is a fallback and may not work in all cases
      console.warn('GAME_STATE_ID not configured in .env, attempting to find it...');

      // For now, we'll need the admin to set this in .env after deployment
      toast.error('GameState ID not configured. Please set VITE_GAME_STATE_ID in .env');
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  }, []);

  // Create player profile
  const createProfile = useCallback(async () => {
    if (!account?.address) {
      toast.error('Please connect wallet first');
      return;
    }

    setLoading(true);
    try {
      const tx = new TransactionBlock();

      // Get clock object
      const clock = tx.object('0x6');

      tx.moveCall({
        target: `${MODULES.ONEPULSE_ARENA}::create_player_profile`,
        arguments: [
          tx.object(gameStateId),
          clock,
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
        },
      });

      if (result.effects?.status === 'success') {
        toast.success('Profile created successfully!');
        await fetchProfile();
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  }, [account?.address, gameStateId, signAndExecute, fetchProfile]);

  // Validate GameState is available before operations
  useEffect(() => {
    if (!gameStateId && !GAME_STATE_ID) {
      console.warn('GameState ID not available. Profile creation and pulse actions will fail.');
    }
  }, [gameStateId]);

  // Record a pulse action
  const recordPulse = useCallback(async () => {
    if (!account?.address || !profile) {
      toast.error('Profile not found');
      return;
    }

    setLoading(true);
    try {
      const tx = new TransactionBlock();
      const clock = tx.object('0x6');

      tx.moveCall({
        target: `${MODULES.ONEPULSE_ARENA}::record_pulse`,
        arguments: [
          tx.object(profile.id),
          tx.object(gameStateId),
          clock,
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      if (result.effects?.status === 'success') {
        toast.success('+100 points!', {
          icon: '⚡',
          style: {
            background: '#00F5FF',
            color: '#0A0E27',
          },
        });
        await fetchProfile();
        return result;
      }
    } catch (error: any) {
      console.error('Error recording pulse:', error);
      if (error.message?.includes('EPulseCooldown')) {
        toast.error('Pulse cooldown! Wait 1 second.');
      } else {
        toast.error(error.message || 'Failed to record pulse');
      }
    } finally {
      setLoading(false);
    }
  }, [account?.address, profile, gameStateId, signAndExecute, fetchProfile]);

  // Claim yield
  const claimYield = useCallback(async () => {
    if (!account?.address || !profile) {
      toast.error('Profile not found');
      return;
    }

    if (profile.yieldAccrued === 0) {
      toast.error('No yield to claim');
      return;
    }

    setLoading(true);
    try {
      const tx = new TransactionBlock();
      const clock = tx.object('0x6');

      tx.moveCall({
        target: `${MODULES.ONEPULSE_ARENA}::claim_yield`,
        arguments: [
          tx.object(profile.id),
          tx.object(gameStateId),
          clock,
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
        },
      });

      if (result.effects?.status === 'success') {
        toast.success('Yield claimed!');
        await fetchProfile();
      }
    } catch (error: any) {
      console.error('Error claiming yield:', error);
      toast.error(error.message || 'Failed to claim yield');
    } finally {
      setLoading(false);
    }
  }, [account?.address, profile, gameStateId, signAndExecute, fetchProfile]);

  // Mint achievement NFT
  const mintAchievement = useCallback(async (milestone: number) => {
    if (!account?.address || !profile) {
      toast.error('Profile not found');
      return;
    }

    const achievement = ACHIEVEMENTS.find(a => a.milestone === milestone);
    if (!achievement) return;

    if (profile.totalPulses < milestone) {
      toast.error(`Need ${milestone} pulses to mint this achievement`);
      return;
    }

    setLoading(true);
    try {
      const tx = new TransactionBlock();
      const clock = tx.object('0x6');

      // Find AchievementMinter object
      const minterObjects = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${PACKAGE_ID}::achievement_nft::AchievementMinter`,
        },
      });

      if (minterObjects.data.length === 0) {
        toast.error('Achievement minter not found');
        setLoading(false);
        return;
      }

      const minterId = minterObjects.data[0].data?.objectId;

      tx.moveCall({
        target: `${PACKAGE_ID}::achievement_nft::check_and_mint_milestone`,
        arguments: [
          tx.object(minterId!),
          tx.pure.address(account.address),
          tx.pure.u64(profile.totalPulses),
          tx.pure.u64(Date.now()), // timestamp
          clock,
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
        },
      });

      if (result.effects?.status === 'success') {
        toast.success(`Achievement "${achievement.name}" minted!`, {
          icon: '🏆',
          duration: 5000,
        });

        // Mark achievement as earned
        setAchievements(prev =>
          prev.map(a => a.milestone === milestone ? { ...a, earned: true } : a)
        );
      }
    } catch (error: any) {
      console.error('Error minting achievement:', error);
      toast.error(error.message || 'Failed to mint achievement');
    } finally {
      setLoading(false);
    }
  }, [account?.address, profile, client, signAndExecute]);

  // Initial fetch
  useEffect(() => {
    if (account?.address) {
      fetchProfile();
      fetchGameState();
    }
  }, [account?.address, fetchProfile, fetchGameState]);

  return {
    profile,
    loading,
    createProfile,
    recordPulse,
    claimYield,
    mintAchievement,
    achievements,
    refetch: fetchProfile,
  };
}

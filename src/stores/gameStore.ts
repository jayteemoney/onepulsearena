import { create } from 'zustand';

interface Player {
  address: string;
  score: number;
  position: { x: number; y: number };
  color: string;
}

interface LeaderboardEntry {
  address: string;
  score: number;
  rank: number;
}

interface GameStore {
  // Game state
  isGameActive: boolean;
  players: Map<string, Player>;
  localPlayer: Player | null;
  leaderboard: LeaderboardEntry[];

  // UI state
  showTutorial: boolean;
  spectatorMode: boolean;

  // Actions
  setGameActive: (active: boolean) => void;
  addPlayer: (address: string, player: Player) => void;
  updatePlayer: (address: string, updates: Partial<Player>) => void;
  removePlayer: (address: string) => void;
  setLocalPlayer: (player: Player | null) => void;
  updateLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setShowTutorial: (show: boolean) => void;
  setSpectatorMode: (mode: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  isGameActive: false,
  players: new Map(),
  localPlayer: null,
  leaderboard: [],
  showTutorial: true,
  spectatorMode: false,

  // Actions
  setGameActive: (active) => set({ isGameActive: active }),

  addPlayer: (address, player) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.set(address, player);
      return { players: newPlayers };
    }),

  updatePlayer: (address, updates) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      const existing = newPlayers.get(address);
      if (existing) {
        newPlayers.set(address, { ...existing, ...updates });
      }
      return { players: newPlayers };
    }),

  removePlayer: (address) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.delete(address);
      return { players: newPlayers };
    }),

  setLocalPlayer: (player) => set({ localPlayer: player }),

  updateLeaderboard: (leaderboard) => set({ leaderboard }),

  setShowTutorial: (show) => set({ showTutorial: show }),

  setSpectatorMode: (mode) => set({ spectatorMode: mode }),

  reset: () =>
    set({
      isGameActive: false,
      players: new Map(),
      localPlayer: null,
      leaderboard: [],
    }),
}));

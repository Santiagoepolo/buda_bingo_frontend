import { create } from 'zustand';

interface Player {
  id: string;
  username: string;
  card: number[][];
  selectedNumbers: Set<number>;
  isWinner: boolean;
}

interface GameState {
  status: 'waiting' | 'playing' | 'finished';
  currentNumber: number | null;
  drawnNumbers: Set<number>;
  players: Player[];
  winner: string | null;
  selectNumber: (playerId: string, number: number) => void;
  updateGameState: (update: Partial<GameState>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'waiting',
  currentNumber: null,
  drawnNumbers: new Set(),
  players: [],
  winner: null,

  selectNumber: (playerId, number) =>
    set((state) => {
      const playerIndex = state.players.findIndex((p) => p.id === playerId);
      if (playerIndex === -1) return state;

      const updatedPlayers = [...state.players];
      const player = { ...updatedPlayers[playerIndex] };
      player.selectedNumbers.add(number);
      updatedPlayers[playerIndex] = player;

      return { players: updatedPlayers };
    }),

  updateGameState: (update) =>
    set((state) => ({
      ...state,
      ...update,
    })),
}));
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useAuth } from '../contexts/AuthContext';

export const GameControls: React.FC = () => {
  const { user } = useAuth();
  const { status, drawnNumbers } = useGameStore();

  const handleBingoClaim = () => {
    // Implement bingo claim logic
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Controles de Juego</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Números Cantados</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(drawnNumbers).map(number => (
              <span key={number} className="bg-blue-500 text-white px-2 py-1 rounded">
                {number}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleBingoClaim}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          disabled={status !== 'playing'}
        >
          ¡Cantar Bingo!
        </button>
      </div>
    </div>
  );
};
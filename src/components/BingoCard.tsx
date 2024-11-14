import React from 'react';
import { useGameStore } from '../store/gameStore';

interface BingoCardProps {
  playerId: string;
  card: number[][];
}

export const BingoCard: React.FC<BingoCardProps> = ({ playerId, card }) => {
  const { drawnNumbers, selectNumber } = useGameStore();

  const isNumberDrawn = (number: number) => drawnNumbers.has(number);
  const isNumberSelected = (number: number) => drawnNumbers.has(number);

  const handleNumberClick = (number: number) => {
    if (isNumberDrawn(number)) {
      selectNumber(playerId, number);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="grid grid-cols-5 gap-2 mb-4">
        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
          <div
            key={letter}
            className="bg-blue-500 text-white text-center py-2 rounded font-bold"
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {card.map((row, rowIndex) =>
          row.map((number, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleNumberClick(number)}
              className={`
                aspect-square flex items-center justify-center text-lg font-semibold rounded-lg transition-all
                ${
                  isNumberSelected(number)
                    ? 'bg-green-500 text-white'
                    : isNumberDrawn(number)
                    ? 'bg-blue-100 hover:bg-blue-200'
                    : 'bg-gray-100'
                }
              `}
            >
              {number}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
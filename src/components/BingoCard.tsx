import React from 'react';
import { Crown } from 'lucide-react';

interface BingoCardProps {
  playerId: string;
  card: number[][];
  drawnNumbers: number[];
  selectedNumbers: number[];
  onNumberSelect: (number: number) => void;
  isDisabled?: boolean;
}

export const BingoCard: React.FC<BingoCardProps> = ({ 
  playerId, 
  card = [], 
  drawnNumbers = [],
  selectedNumbers = [],
  onNumberSelect,
  isDisabled = false 
}) => {
  const isNumberDrawn = (number: number) => drawnNumbers.includes(number);
  const isNumberSelected = (number: number) => selectedNumbers.includes(number);

  const handleNumberClick = (number: number) => {
    if (isDisabled) return;
    if (number === 0) return; // Ignorar clics en el comodín
    if (isNumberDrawn(number) && !isNumberSelected(number)) {
      onNumberSelect(number);
    }
  };

  if (!card.length) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {['B', 'I', 'N', 'G', 'O'].map((letter) => (
              <div
                key={letter}
                className="bg-blue-200 text-transparent text-center py-2 rounded font-bold"
              >
                {letter}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
      {/* Cabecera BINGO */}
      <div className="grid grid-cols-5 gap-2">
        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
          <div
            key={letter}
            className="bg-blue-500 text-white text-center py-2 rounded font-bold"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Tarjetón */}
      <div className="grid grid-cols-5 gap-2">
        {card.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const isCorner = (
              (rowIndex === 0 && colIndex === 0) || // Superior izquierda
              (rowIndex === 0 && colIndex === 4) || // Superior derecha
              (rowIndex === 4 && colIndex === 0) || // Inferior izquierda
              (rowIndex === 4 && colIndex === 4)    // Inferior derecha
            );

            // Si es el comodín (centro del tablero)
            if (number === 0) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square flex items-center justify-center bg-yellow-400 rounded-lg transform scale-95"
                >
                  <Crown className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              );
            }

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleNumberClick(number)}
                disabled={isDisabled || !isNumberDrawn(number)}
                className={`
                  aspect-square flex items-center justify-center text-lg font-semibold rounded-lg
                  transition-all duration-200
                  ${isCorner ? 'border-2 border-blue-300' : ''}
                  ${
                    isNumberSelected(number)
                      ? 'bg-green-500 text-white transform scale-95'
                      : isNumberDrawn(number)
                      ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
                      : 'bg-gray-100 cursor-not-allowed opacity-50'
                  }
                `}
              >
                {number}
              </button>
            );
          })
        )}
      </div>

      {/* Reglas */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Formas de ganar:</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Completar una línea horizontal</li>
          <li>• Completar una línea vertical</li>
          <li>• Completar una diagonal</li>
          <li>• Marcar las cuatro esquinas</li>
          <li>• La corona dorada es un comodín automático</li>
        </ul>
      </div>
    </div>
  );
};
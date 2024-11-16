import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Frown, Home } from 'lucide-react';

interface GameEndModalProps {
  winner: string;
  isWinner: boolean;
}

export const GameEndModal: React.FC<GameEndModalProps> = ({ winner, isWinner }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="text-center">
          {isWinner ? (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Felicitaciones!
              </h2>
              <p className="text-gray-600 mb-6">
                ¡Has ganado la partida!
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Frown className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Fin del Juego!
              </h2>
              <p className="text-gray-600 mb-6">
                {winner} ha ganado la partida
              </p>
            </>
          )}

          <button
            onClick={() => navigate('/home')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                     transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { BingoCard } from './BingoCard';
import { GameControls } from './GameControls';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const GameBoard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { status, currentNumber, players } = useGameStore();
  const playerCard = players.find(p => p.id === user?.id);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-4">Bingo Gran Buda</h1>
            <div className="text-xl">
              Current Number: {currentNumber || 'Waiting...'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {playerCard && <BingoCard playerId={user.id} card={playerCard.card} />}
          <GameControls />
        </div>
      </div>
    </div>
  );
};
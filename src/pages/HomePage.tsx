import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, LogOut, Trophy, Users, Info } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleStartGame = () => {
    navigate('/lobby');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">¡Bienvenido, {user.username}!</h1>
            <p className="text-blue-200">¿Listo para jugar Bingo Gran Buda?</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Game Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-green-400 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Comenzar a Jugar</h2>
              <p className="text-blue-200">Únete a una partida con otros jugadores</p>
            </div>
            <button
              onClick={handleStartGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Unirse al Lobby
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-2xl font-bold mb-2">Tus Estadísticas</h2>
              <p className="text-blue-200">Seguimiento de tus logros en el bingo</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">{user.gamesWon}</div>
                <div className="text-sm text-blue-200">Partidas Ganadas</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">{user.gamesPlayed}</div>
                <div className="text-sm text-blue-200">Partidas Jugadas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-blue-300" />
            <h2 className="text-2xl font-bold">Cómo Jugar</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-lg font-semibold mb-2">1. Únete a una Partida</div>
              <p className="text-blue-200">Entra al lobby y espera a otros jugadores. Se necesitan mínimo 3 jugadores para comenzar.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-lg font-semibold mb-2">2. Marca los Números</div>
              <p className="text-blue-200">Cuando se anuncien los números, márcalos en tu cartón si coinciden.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-lg font-semibold mb-2">3. ¡Canta Bingo!</div>
              <p className="text-blue-200">Completa una línea (horizontal, vertical o diagonal) y haz clic en "¡BINGO!" para ganar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
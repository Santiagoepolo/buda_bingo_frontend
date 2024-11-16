import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Confetti } from '../components/Confetti';
import { GameEndModal } from '../components/GameEndModal';

interface PlayerCard {
  id: number;
  card_numbers: number[][];
  selected_numbers: number[];
  is_winner: boolean;
}

interface GameState {
  currentNumber: number | null;
  drawnNumbers: number[];
  players: { username: string; is_disqualified?: boolean }[];
  status: 'playing' | 'finished';
  winner: string | null;
}

export const GamePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [playerCard, setPlayerCard] = useState<PlayerCard | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentNumber: null,
    drawnNumbers: [],
    players: [],
    status: 'playing',
    winner: null
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const handleLogout = async () => {
    if (socket) {
      socket.close();
    }
    await logout();
    navigate('/');
  };

  const handleNumberClick = (number: number) => {
    if (isDisqualified || gameState.status === 'finished') return;
    
    if (!gameState.drawnNumbers.includes(number)) {
      toast.error('Este número aún no ha sido cantado');
      return;
    }

    if (playerCard && !playerCard.selected_numbers.includes(number)) {
      socket?.send(JSON.stringify({
        action: 'select_number',
        number: number
      }));
    }
  };

  const handleBingoClaim = () => {
    if (isDisqualified || gameState.status === 'finished') return;

    socket?.send(JSON.stringify({
      action: 'claim_bingo'
    }));
  };

  useEffect(() => {
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    if (!gameId) {
      toast.error('ID de juego no encontrado');
      navigate('/home');
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(
      `${protocol}//${window.location.host}/ws/game/${gameId}/?token=${localStorage.getItem('token')}`
    );

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida');
      toast.success('Conectado al juego');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido:', data);

      switch (data.type) {
        case 'game_state':
          setGameState(data.state);
          setPlayerCard(data.player_card);
          if (data.state.status === 'finished' && data.state.winner) {
            setShowEndModal(true);
          }
          break;
        case 'number_drawn':
          setGameState(prev => ({
            ...prev,
            currentNumber: data.number,
            drawnNumbers: [...prev.drawnNumbers, data.number]
          }));
          toast.success(`Número cantado: ${data.number}`);
          break;
        case 'number_selected':
          if (data.success) {
            setPlayerCard(prev => prev ? {
              ...prev,
              selected_numbers: [...prev.selected_numbers, data.number]
            } : null);
          }
          break;
        case 'bingo_claimed':
          if (data.success) {
            setGameState(prev => ({
              ...prev,
              status: 'finished',
              winner: data.player
            }));
            setShowEndModal(true);
            if (data.player === user?.username) {
              toast.success('¡Has ganado!', { duration: 5000 });
            } else {
              toast.error(`${data.player} ha ganado la partida`, { duration: 5000 });
            }
          } else if (data.player === user?.username) {
            toast.error('¡Has sido descalificado por cantar Bingo incorrectamente!');
            setIsDisqualified(true);
          }
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      toast.error('Error de conexión');
    };

    ws.onclose = () => {
      console.log('Conexión WebSocket cerrada');
      toast.error('Se perdió la conexión con el juego');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [navigate, user]);

  if (!user || !playerCard) return null;

  return (
    <>
      {gameState.status === 'finished' && gameState.winner === user.username && <Confetti />}
      
      {showEndModal && gameState.winner && (
        <GameEndModal
          winner={gameState.winner}
          isWinner={gameState.winner === user.username}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Bingo Gran Buda</h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-sm">Número Actual:</span>
                  <div className="text-2xl font-bold text-yellow-300">
                    {gameState.currentNumber || '-'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{gameState.players.length} Jugadores</span>
                </div>
              </div>
              {isDisqualified && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Descalificado</span>
                </div>
              )}
            </div>
          </div>

          {/* Game Area */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bingo Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
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
                {playerCard.card_numbers.map((row, rowIndex) =>
                  row.map((number, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleNumberClick(number)}
                      disabled={isDisqualified || gameState.status === 'finished'}
                      className={`
                        aspect-square flex items-center justify-center text-lg font-semibold rounded-lg
                        transition-all duration-200 ${
                          playerCard.selected_numbers.includes(number)
                            ? 'bg-green-500 text-white transform scale-95'
                            : gameState.drawnNumbers.includes(number)
                            ? 'bg-yellow-100 hover:bg-yellow-200'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }
                        ${(isDisqualified || gameState.status === 'finished') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {number}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-6">
              {/* Drawn Numbers */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Números Cantados</h3>
                <div className="flex flex-wrap gap-3">
                  {gameState.drawnNumbers.map((number, index) => (
                    <div
                      key={`drawn-${number}-${index}`}
                      className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full font-semibold"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>

              {/* Players List */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Jugadores</h3>
                <div className="space-y-2">
                  {gameState.players.map((player, index) => (
                    <div
                      key={`player-${index}`}
                      className={`p-2 rounded ${
                        player.is_disqualified
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100'
                      }`}
                    >
                      {player.username}
                      {player.is_disqualified && ' (Descalificado)'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bingo Button */}
              <button
                onClick={handleBingoClaim}
                disabled={isDisqualified || gameState.status === 'finished'}
                className={`
                  w-full py-4 px-6 rounded-xl text-white text-xl font-bold
                  transition-all duration-300 transform hover:scale-105
                  ${
                    isDisqualified || gameState.status === 'finished'
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }
                `}
              >
                ¡BINGO!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
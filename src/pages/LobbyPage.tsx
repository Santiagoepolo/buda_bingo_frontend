import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Timer, Users, LogOut } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface LobbyState {
  gameId: string | null;
  players: string[];
  status: 'waiting' | 'starting' | 'error';
  createdAt?: number;
}

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState(60);
  const [showCardGeneration, setShowCardGeneration] = useState(true);
  const [cardGenerated, setCardGenerated] = useState(false);
  const [lobbyState, setLobbyState] = useState<LobbyState>({
    gameId: null,
    players: [],
    status: 'waiting'
  });
  const socketRef = useRef<WebSocket | null>(null);
  const joinAttemptedRef = useRef(false);

  const handleLogout = async () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    await logout();
    navigate('/');
  };

  const handleError = (error: unknown) => {
    if (!joinAttemptedRef.current) return;
    
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      if (axiosError.response?.status === 400) {
        toast.error('No se pudo unir al juego. Volviendo al inicio...');
      } else {
        toast.error('Error al unirse al juego. Por favor, intenta de nuevo.');
      }
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } else {
      toast.error('Ocurrió un error inesperado');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    }
  };

  useEffect(() => {
    if (showCardGeneration) {
      const timer = setTimeout(() => {
        setShowCardGeneration(false);
        setCardGenerated(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showCardGeneration]);

  useEffect(() => {
    const joinGame = async () => {
      if (joinAttemptedRef.current || !user) return;
      joinAttemptedRef.current = true;

      try {
        const { data } = await axios.post('/api/games/games/join_game/', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const uniquePlayers: string[] = Array.from(new Set(
          data.player_cards.map((pc: any) => pc.user.username)
        ));

        setLobbyState(prev => ({
          ...prev,
          gameId: data.id,
          players: uniquePlayers,
          createdAt: data.created_at
        }));

        // Establecer conexión WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/game/${data.id}/?token=${localStorage.getItem('token')}`;
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket Connected');
          toast.success('Conectado al servidor de juego');
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (data.type === 'player_joined') {
            setLobbyState(prev => {
              const updatedPlayers = Array.from(new Set([...prev.players, data.player]));
              return {
                ...prev,
                players: updatedPlayers
              };
            });
            toast.success(`${data.player} se ha unido al juego`);
          } else if (data.type === 'game_starting') {
            setLobbyState(prev => ({
              ...prev,
              status: 'starting'
            }));
            toast.success('¡El juego está por comenzar!');
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          toast.error('Error de conexión. Por favor, intenta de nuevo.');
          setLobbyState(prev => ({ ...prev, status: 'error' }));
          handleError(error);
        };

        ws.onclose = () => {
          console.log('WebSocket Disconnected');
        };

        socketRef.current = ws;
      } catch (error) {
        console.error('Error joining game:', error);
        handleError(error);
      }
    };

    if (user) {
      joinGame();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      joinAttemptedRef.current = false;
    };
  }, [user, navigate]);

  useEffect(() => {
    if (!lobbyState.createdAt) return;

    const calculateInitialTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const gameStartTime = lobbyState.createdAt;
      const elapsedTime = gameStartTime ? now - gameStartTime : 0;
      const remainingTime = Math.max(60 - elapsedTime, 0);
      return Math.floor(remainingTime);
    };

    setTimeLeft(calculateInitialTime());

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(prev - 1, 0);
        if (newTime <= 0) {
          clearInterval(timer);
          if (lobbyState.players.length >= 3) {
            navigate(`/game?gameId=${lobbyState.gameId}`);
          } else {
            toast.error('No hay suficientes jugadores. Volviendo al inicio...');
            setTimeout(() => {
              navigate('/home');
            }, 2000);
          }
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lobbyState.createdAt, lobbyState.players.length, lobbyState.gameId, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bingo Gran Buda</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center text-white">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Timer className="w-8 h-8" />
            <span className="text-4xl font-bold">{timeLeft}s</span>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 text-2xl mb-2">
              <Users className="w-6 h-6" />
              <span>Jugadores en Lobby: {lobbyState.players.length}</span>
            </div>
            <p className="text-white/80">Mínimo 3 jugadores requeridos</p>
          </div>

          {/* Card Generation Animation */}
          {showCardGeneration && (
            <div className="my-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/20 rounded"></div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className="h-12 bg-white/20 rounded"></div>
                  ))}
                </div>
                <p className="text-blue-200 mt-4">Generando tu cartón de bingo...</p>
              </div>
            </div>
          )}

          {cardGenerated && !showCardGeneration && (
            <div className="my-8 p-4 bg-white/10 rounded-lg">
              <p className="text-green-400 font-semibold">
                ¡Tu cartón ha sido generado y será mostrado al iniciar la partida!
              </p>
            </div>
          )}

          {/* Player List */}
          <div className="mt-8 space-y-2">
            {lobbyState.players.map((player, index) => (
              <div key={`player-${player}-${index}`} className="bg-white/10 p-3 rounded-lg">
                {player}
              </div>
            ))}
          </div>

          {lobbyState.status === 'error' && (
            <div className="mt-4 text-red-300">
              Error de conexión. Volviendo al inicio...
            </div>
          )}

          <div className="mt-8">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
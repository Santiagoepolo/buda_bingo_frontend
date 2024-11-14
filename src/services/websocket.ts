import { useGameStore } from '../store/gameStore';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private gameId: string;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  connect() {
    this.socket = new WebSocket(`ws://localhost:8000/ws/game/${this.gameId}/`);
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  private handleMessage(data: any) {
    const store = useGameStore.getState();
    
    switch (data.type) {
      case 'game_update':
        store.updateGameState(data.game);
        break;
      case 'number_drawn':
        store.updateGameState({
          currentNumber: data.number,
          drawnNumbers: new Set([...store.drawnNumbers, data.number])
        });
        break;
      case 'game_over':
        store.updateGameState({
          status: 'finished',
          winner: data.winner
        });
        break;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}
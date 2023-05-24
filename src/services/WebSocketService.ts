import ReconnectingWebSocket from 'reconnecting-websocket';

class WebSocketService {
  private socket: ReconnectingWebSocket;

  constructor(url: string) {
    this.socket = new ReconnectingWebSocket(url);

    this.socket.onopen = () => {
      console.log('Connected');
    };

    this.socket.onmessage = (message) => {
      // handle incoming message
      console.log('Message received', message);
    };

    this.socket.onerror = (error) => {
      // handle error
      console.error('Error occurred', error);
    };

    this.socket.onclose = () => {
      console.log('Disconnected');
    };
  }

  public send(message: string): void {
    this.socket.send(message);
  }
}

export default WebSocketService;

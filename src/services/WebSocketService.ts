import ReconnectingWebSocket, {
  Event,
  CloseEvent,
} from 'reconnecting-websocket';
import { store } from '../app/store';
import {
  OrderBookEntry,
  setOrderBookData,
} from '../features/orderBook/orderBookSlice';
import { Dispatch } from 'redux';
import {
  setConnected,
  setDisconnected,
} from '../features/websocket/websocketSlice';

const WEBSOCKET_URL = 'wss://api.bitfinex.com/ws/2';
class WebSocketService {
  private socket!: ReconnectingWebSocket;
  private url: string;
  private static instance: WebSocketService;
  private dispatch: Dispatch;
  constructor(url: string, dispatch: Dispatch) {
    this.url = url;
    this.dispatch = dispatch;
  }
  public static getInstance(dispatch: Dispatch): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(WEBSOCKET_URL, dispatch);
    }

    return WebSocketService.instance;
  }
  private subscribeToOrderBook(symbol: string, precision: string) {
    const payload = {
      event: 'subscribe',
      channel: 'book',
      symbol: symbol,
      prec: precision,
      len: '25',
    };
    this.socket.send(JSON.stringify(payload));
  }
  public connect() {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new ReconnectingWebSocket(this.url);

    this.socket.onopen = this.handleOpen;
    this.socket.onclose = this.handleClose;
    this.socket.onerror = this.handleError;
    this.socket.onmessage = this.handleMessage;
    this.subscribeToOrderBook('tBTCUSD', 'P0');
  }

  public disconnect() {
    if (this.socket?.OPEN) {
      this.socket.close();
    }
  }

  handleOpen = (event: Event) => {
    console.log('WebSocket open', event);
    this.dispatch(setConnected());
  };

  handleClose = (event: CloseEvent) => {
    console.log('WebSocket close', event);
    this.dispatch(setDisconnected());
  };

  handleError = (event: Event) => {
    console.error('WebSocket error', event);
  };

  handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    // service events
    if (!Array.isArray(data)) {
      if (data.event === 'info' && data.code === 20051) {
        // Bitfinex API sends this event code when it will restart soon, so we should reconnect.
        this.socket.close();
      } else if (data.event === 'info' && data.code === 20060) {
        // Bitfinex API sends this event code when it is in maintenance mode, so we should wait and then reconnect.
        setTimeout(() => {
          this.socket.close();
        }, 5000); // Wait 5 seconds before reconnecting
      }
    } else {
      if (Array.isArray(data[1])) {
        // Snapshot
        const snapshot = data[1];
        const bids: OrderBookEntry[] = [];
        const asks: OrderBookEntry[] = [];

        snapshot.forEach((entry) => {
          if (Array.isArray(entry)) {
            const [price, count, amount] = entry;
            const order = {
              price,
              count,
              amount,
              total: Math.abs(count * amount),
            };
            if (amount > 0) {
              bids.push(order);
            } else {
              asks.push(order);
            }
          }
        });

        // Sort bids descending and asks ascending by price
        bids.sort((a, b) => b.price - a.price);
        asks.sort((a, b) => a.price - b.price);

        // Dispatch updateOrderBook action to update state in Redux
        store.dispatch(setOrderBookData({ bids, asks }));
      } else {
        // Individual update
        if (Array.isArray(data[1])) {
          const [price, count, amount] = data[1];
          const order = {
            price,
            count,
            amount,
            total: Math.abs(count * amount),
          };

          // Update the order book based on the received update
          store.dispatch((dispatch, getState) => {
            const { bids, asks } = getState().orderBook;
            if (amount > 0) {
              const index = bids.findIndex((bid) => bid.price === price);
              if (index !== -1) {
                if (count === 0) {
                  bids.splice(index, 1);
                } else {
                  bids[index] = order;
                }
              } else if (count !== 0) {
                bids.push(order);
                bids.sort((a, b) => b.price - a.price);
              }
            } else {
              const index = asks.findIndex((ask) => ask.price === price);
              if (index !== -1) {
                if (count === 0) {
                  asks.splice(index, 1);
                } else {
                  asks[index] = order;
                }
              } else if (count !== 0) {
                asks.push(order);
                asks.sort((a, b) => a.price - b.price);
              }
            }
            dispatch(setOrderBookData({ bids, asks }));
          });
        }
      }
    }
  };

  public send(message: string): void {
    this.socket.send(message);
  }
}

export default WebSocketService;

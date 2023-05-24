import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrderBook } from '../features/orderBook/orderBookSlice';
import {
  selectPrecision,
  setPrecision,
} from '../features/precision/precisionSlice';
import {
  selectIsConnected,
  setConnected,
  setDisconnected,
} from '../features/websocket/websocketSlice';

import WebSocketService from '../services/WebSocketService';

const OrderBook: React.FC = () => {
  const orderBook = useSelector(selectOrderBook);
  const precision = useSelector(selectPrecision);
  const isConnected = useSelector(selectIsConnected);
  const dispatch = useDispatch();
  const websocketService = WebSocketService.getInstance(dispatch);

  useEffect(() => {
    if (isConnected) {
      websocketService.connect();
    } else {
      websocketService.disconnect();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [websocketService, isConnected]);

  const handlePrecisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch(setPrecision(Number(event.target.value)));
  };

  const handleConnectClick = () => {
    dispatch(setConnected());
  };

  const handleDisconnectClick = () => {
    dispatch(setDisconnected());
  };

  return (
    <div>
      <button onClick={handleConnectClick}>Connect</button>
      <button onClick={handleDisconnectClick}>Disconnect</button>
      <h2>Order Book</h2>
      <label>
        Precision:
        <select value={precision} onChange={handlePrecisionChange}>
          {/* Add as many options as needed, these are just examples */}
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th colSpan={3}>Bids</th>
            <th colSpan={3}>Asks</th>
          </tr>
          <tr>
            <th>Count</th>
            <th>Amount</th>
            <th>Total</th>
            <th>Price</th>
            <th>Price</th>
            <th>Total</th>
            <th>Amount</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {orderBook.bids.map((bid, i) => (
            <tr key={i}>
              <td>{bid.count}</td>
              <td>{bid.amount}</td>
              <td>{bid.total}</td>
              <td>{bid.price.toFixed(precision)}</td>
              <td>
                {orderBook.asks[i]
                  ? orderBook.asks[i].price.toFixed(precision)
                  : ''}
              </td>
              <td>{orderBook.asks[i] ? orderBook.asks[i].total : ''}</td>
              <td>{orderBook.asks[i] ? orderBook.asks[i].amount : ''}</td>
              <td>{orderBook.asks[i] ? orderBook.asks[i].count : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBook;

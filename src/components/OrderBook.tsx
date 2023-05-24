import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrderBook } from '../features/orderBook/orderBookSlice';
import { selectPrecision } from '../features/precision/precisionSlice';
import {
  selectIsConnected,
  setConnected,
  setDisconnected,
} from '../features/websocket/websocketSlice';
import {
  Container,
  Table,
  TableHeader,
  Title,
  SubTitle,
  Button,
  TitleContainer,
  PrecisionButtonContainer,
  TableColumnHeader,
} from './OrderBook.styles';

import WebSocketService from '../services/WebSocketService';
import IncreasePrecisionIcon from '../icons/IncreasePrecisionIcon';
import DecreasePrecisionIcon from '../icons/DecreasePrecisionIcon';

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

  const handleConnectClick = () => {
    dispatch(setConnected());
  };

  const handleDisconnectClick = () => {
    dispatch(setDisconnected());
  };

  return (
    <Container>
      <Button onClick={handleConnectClick}>Connect</Button>
      <Button onClick={handleDisconnectClick}>Disconnect</Button>
      <TitleContainer>
        <div>
          <Title>
            ORDER BOOK <SubTitle>BTC/USD</SubTitle>
          </Title>
        </div>
        <PrecisionButtonContainer>
          <Button onClick={() => websocketService.decreasePrecision()}>
            <DecreasePrecisionIcon />
          </Button>
          <Button onClick={() => websocketService.increasePrecision()}>
            <IncreasePrecisionIcon />
          </Button>
        </PrecisionButtonContainer>
      </TitleContainer>

      <Table>
        <TableHeader>
          <tr>
            <th colSpan={4}>Bids</th>
            <th colSpan={4}>Asks</th>
          </tr>
          <tr>
            <TableColumnHeader>COUNT</TableColumnHeader>
            <TableColumnHeader>AMOUNT</TableColumnHeader>
            <TableColumnHeader>TOTAL</TableColumnHeader>
            <TableColumnHeader>PRICE</TableColumnHeader>
            <TableColumnHeader>PRICE</TableColumnHeader>
            <TableColumnHeader>TOTAL</TableColumnHeader>
            <TableColumnHeader>AMOUNT</TableColumnHeader>
            <TableColumnHeader>COUNT</TableColumnHeader>
          </tr>
        </TableHeader>
        <tbody>
          {orderBook.bids.map((bid, i) => (
            <tr key={i}>
              <td>{bid.count}</td>
              <td>{bid.amount.toFixed(4)}</td>
              <td>{bid.total.toFixed(4)}</td>
              <td>{bid.price.toFixed(precision)}</td>
              <td>
                {orderBook.asks[i]
                  ? orderBook.asks[i].price.toFixed(precision)
                  : ''}
              </td>
              <td>
                {orderBook.asks[i] ? orderBook.asks[i].total.toFixed(4) : ''}
              </td>
              <td>
                {orderBook.asks[i] ? orderBook.asks[i].amount.toFixed(4) : ''}
              </td>
              <td>{orderBook.asks[i] ? orderBook.asks[i].count : ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderBook;

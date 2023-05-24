import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrderBook } from '../features/orderBook/orderBookSlice';
import {
  selectPrecision,
  setPrecision,
} from '../features/precision/precisionSlice';

const OrderBook: React.FC = () => {
  const orderBook = useSelector(selectOrderBook);
  const precision = useSelector(selectPrecision);
  const dispatch = useDispatch();

  const handlePrecisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch(setPrecision(Number(event.target.value)));
  };

  return (
    <div>
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
      <div>
        <h3>Bids</h3>
        {orderBook.bids.map((bid, index) => (
          <div key={index}>
            {/* Format the price to the selected precision */}
            Price: {bid.price.toFixed(precision)}
            {/* Display the rest of the bid data */}
          </div>
        ))}
      </div>
      <div>
        <h3>Asks</h3>
        {orderBook.asks.map((ask, index) => (
          <div key={index}>
            {/* Format the price to the selected precision */}
            Price: {ask.price.toFixed(precision)}
            {/* Display the rest of the ask data */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;

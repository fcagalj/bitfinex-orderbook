import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface OrderBookState {
  bids: any[]; // replace any[] with the correct type for your bid data
  asks: any[]; // replace any[] with the correct type for your ask data
}

const initialState: OrderBookState = {
  bids: [],
  asks: [],
};

export const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    setOrderBookData: (state, action: PayloadAction<OrderBookState>) => {
      state.bids = action.payload.bids;
      state.asks = action.payload.asks;
    },
  },
});

export const { setOrderBookData } = orderBookSlice.actions;

export const selectOrderBook = (state: RootState) => state.orderBook;

export default orderBookSlice.reducer;
